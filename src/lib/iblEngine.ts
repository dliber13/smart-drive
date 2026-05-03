// IBL (Income Based Lending / BHPH) Scoring Engine
// Runs FIRST in the program waterfall before retail lenders

export type IBLDecision = {
  eligible: boolean;
  score: number; // 0-100
  maxWeeklyPayment: number;
  maxBiweeklyPayment: number;
  maxMonthlyPayment: number;
  maxVehiclePrice: number;
  recommendedTerm: number; // weeks
  requiredDown: number;
  riskBand: "A" | "B" | "C" | "D" | "INELIGIBLE";
  declineReasons: string[];
  scoreBreakdown: {
    incomeScore: number;       // 0-30
    stabilityScore: number;    // 0-25
    cashScore: number;         // 0-20
    creditScore: number;       // 0-15
    profileScore: number;      // 0-10
  };
};

export type IBLInput = {
  monthlyIncome: number;
  payFrequency: "WEEKLY" | "BIWEEKLY" | "SEMIMONTHLY" | "MONTHLY";
  monthlyExpenses: number;
  employmentMonths: number;
  residenceMonths: number;
  creditScore: number;
  downPayment: number;
  tradeIn: number;
  vehiclePrice: number;
  bankruptcyStatus: string;
  repoCount: number;
  incomeType: string;
};

// Convert monthly income to per-paycheck amount
function incomePerCheck(monthlyIncome: number, freq: IBLInput["payFrequency"]): number {
  switch (freq) {
    case "WEEKLY": return monthlyIncome * 12 / 52;
    case "BIWEEKLY": return monthlyIncome * 12 / 26;
    case "SEMIMONTHLY": return monthlyIncome / 2;
    case "MONTHLY": return monthlyIncome;
  }
}

// IBL max PTI by risk band
const IBL_PTI: Record<string, number> = {
  A: 0.155, // 15.5% of monthly income
  B: 0.150, // 15.0%
  C: 0.140, // 14.0%
  D: 0.130, // 13.0%
};

// IBL required down payment by risk band (% of vehicle price)
const IBL_DOWN: Record<string, number> = {
  A: 0.10, // 10%
  B: 0.15, // 15%
  C: 0.20, // 20%
  D: 0.25, // 25%
};

// IBL term by risk band (weeks)
const IBL_TERM: Record<string, number> = {
  A: 156, // 3 years
  B: 130, // 2.5 years
  C: 104, // 2 years
  D: 78,  // 1.5 years
};

// Calculate actual amortized payment
function amortizedPayment(principal: number, annualRate: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRate === 0) return Math.round(principal / termMonths);
  const monthlyRate = annualRate / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment);
}

export function runIBLEngine(input: IBLInput): IBLDecision {
  const declineReasons: string[] = [];

  // ── Income Score (0-30) ──────────────────────────────────────────────────
  let incomeScore = 0;
  if (input.monthlyIncome >= 5000) incomeScore = 30;
  else if (input.monthlyIncome >= 4000) incomeScore = 26;
  else if (input.monthlyIncome >= 3500) incomeScore = 22;
  else if (input.monthlyIncome >= 3000) incomeScore = 18;
  else if (input.monthlyIncome >= 2500) incomeScore = 14;
  else if (input.monthlyIncome >= 2000) incomeScore = 10;
  else if (input.monthlyIncome >= 1500) incomeScore = 6;
  else if (input.monthlyIncome >= 1200) incomeScore = 2;

  // ── Stability Score (0-25) ───────────────────────────────────────────────
  let stabilityScore = 0;

  // Employment stability (0-13)
  if (input.employmentMonths >= 24) stabilityScore += 13;
  else if (input.employmentMonths >= 18) stabilityScore += 11;
  else if (input.employmentMonths >= 12) stabilityScore += 9;
  else if (input.employmentMonths >= 9) stabilityScore += 7;
  else if (input.employmentMonths >= 6) stabilityScore += 5;
  else if (input.employmentMonths >= 3) stabilityScore += 3;
  else stabilityScore += 1;

  // Residence stability (0-12)
  if (input.residenceMonths >= 24) stabilityScore += 12;
  else if (input.residenceMonths >= 18) stabilityScore += 10;
  else if (input.residenceMonths >= 12) stabilityScore += 8;
  else if (input.residenceMonths >= 9) stabilityScore += 6;
  else if (input.residenceMonths >= 6) stabilityScore += 4;
  else if (input.residenceMonths >= 3) stabilityScore += 2;
  else stabilityScore += 0;

  // ── Cash Score (0-20) ────────────────────────────────────────────────────
  let cashScore = 0;
  const totalCash = input.downPayment + input.tradeIn;
  const cashPct = input.vehiclePrice > 0 ? totalCash / input.vehiclePrice : 0;

  if (cashPct >= 0.30) cashScore = 20;
  else if (cashPct >= 0.25) cashScore = 17;
  else if (cashPct >= 0.20) cashScore = 14;
  else if (cashPct >= 0.15) cashScore = 11;
  else if (cashPct >= 0.10) cashScore = 8;
  else if (cashPct >= 0.05) cashScore = 4;
  else if (totalCash > 0) cashScore = 1;

  // ── Credit Score component (0-15) ────────────────────────────────────────
  // IBL is income-based but credit history still matters
  let creditScorePoints = 0;
  if (input.creditScore === 0 || input.creditScore === null) {
    creditScorePoints = 7; // unscoreable gets middle score — income matters more
  } else if (input.creditScore >= 620) creditScorePoints = 15;
  else if (input.creditScore >= 580) creditScorePoints = 13;
  else if (input.creditScore >= 540) creditScorePoints = 11;
  else if (input.creditScore >= 500) creditScorePoints = 9;
  else if (input.creditScore >= 460) creditScorePoints = 6;
  else if (input.creditScore >= 420) creditScorePoints = 3;
  else creditScorePoints = 1;

  // ── Profile Score (0-10) ─────────────────────────────────────────────────
  let profileScore = 10;

  // Deductions
  if (input.bankruptcyStatus === "CHAPTER_7") profileScore -= 4;
  else if (input.bankruptcyStatus === "CHAPTER_13") profileScore -= 2;

  if (input.repoCount >= 2) profileScore -= 6;
  else if (input.repoCount === 1) profileScore -= 3;

  const isGig = ["1099", "SELF_EMPLOYED", "GIG", "BANK_STATEMENT"].includes(
    (input.incomeType || "").toUpperCase()
  );
  if (isGig) profileScore -= 2; // slight penalty for unverified income

  profileScore = Math.max(0, profileScore);

  // ── Total IBL Score ───────────────────────────────────────────────────────
  const totalScore = incomeScore + stabilityScore + cashScore + creditScorePoints + profileScore;

  // ── Risk Band Assignment ──────────────────────────────────────────────────
  let riskBand: IBLDecision["riskBand"] = "INELIGIBLE";
  if (totalScore >= 72) riskBand = "A";
  else if (totalScore >= 58) riskBand = "B";
  else if (totalScore >= 42) riskBand = "C";
  else if (totalScore >= 28) riskBand = "D";

  // ── Hard Decline Rules ────────────────────────────────────────────────────
  if (input.monthlyIncome < 1200) {
    declineReasons.push("Income below IBL minimum ($1,200/mo)");
  }
  if (input.vehiclePrice > 25000) {
    declineReasons.push("Vehicle price exceeds IBL maximum ($25,000)");
  }
  if (input.repoCount >= 3) {
    declineReasons.push("Three or more repossessions — IBL ineligible");
  }
  if (input.bankruptcyStatus === "OPEN") {
    declineReasons.push("Open bankruptcy — IBL ineligible until discharged");
  }

  const eligible = declineReasons.length === 0 && riskBand !== "INELIGIBLE";

  // ── Payment Calculations ──────────────────────────────────────────────────
  const ptiLimit = eligible ? IBL_PTI[riskBand] : 0;
  const ptiMaxMonthly = Math.round(input.monthlyIncome * ptiLimit);

  const termWeeks = eligible ? IBL_TERM[riskBand] : 0;
  const termMonths = Math.round(termWeeks / 52 * 12);
  const requiredDownPct = eligible ? IBL_DOWN[riskBand] : 0;
  const requiredDown = Math.round(input.vehiclePrice * requiredDownPct);

  // ── Correct amortized payment math ──────────────────────────────────────
  // Step 1: PTI cap = max affordable monthly payment based on income
  const monthlyRate = 0.2499 / 12;

  // Step 2: Max principal = loan amount that produces exactly ptiMaxMonthly at 24.99%
  // Formula: P = PMT * ((1-(1+r)^-n)/r)
  const maxPrincipal = eligible && termMonths > 0
    ? Math.round(ptiMaxMonthly * ((1 - Math.pow(1 + monthlyRate, -termMonths)) / monthlyRate))
    : 0;

  // Step 3: Max vehicle = max principal + down + trade (capped at $25K)
  const maxVehiclePrice = eligible
    ? Math.min(maxPrincipal + input.downPayment + input.tradeIn, 25000)
    : 0;

  // Step 4: Actual payment on SELECTED vehicle — amortized at 24.99%
  const amountFinanced = Math.max(0, input.vehiclePrice - input.downPayment - input.tradeIn);
  const actualMonthlyPayment = eligible && termMonths > 0 && amountFinanced > 0
    ? amortizedPayment(amountFinanced, 0.2499, termMonths)
    : ptiMaxMonthly;

  // Step 5: maxPayment = PTI cap (what the customer can AFFORD based on income)
  // actualMonthlyPayment is used only for payment check comparison on decision screen
  const maxMonthlyPayment = ptiMaxMonthly;
  const maxWeeklyPayment = Math.round(maxMonthlyPayment * 12 / 52);
  const maxBiweeklyPayment = Math.round(maxMonthlyPayment * 12 / 26);

  return {
    eligible,
    score: Math.min(totalScore, 100),
    maxWeeklyPayment,
    maxBiweeklyPayment,
    maxMonthlyPayment,
    maxVehiclePrice,
    recommendedTerm: termWeeks,
    requiredDown,
    riskBand,
    declineReasons,
    scoreBreakdown: {
      incomeScore,
      stabilityScore,
      cashScore,
      creditScore: creditScorePoints,
      profileScore,
    },
  };
}
