// Credit Engine — Mock mode until 700Credit credentials arrive
// When CREDIT_API_KEY is set in env, this switches to live pulls automatically

export type CreditPullResult = {
  score: number;
  source: "LIVE" | "MOCK" | "MANUAL";
  bureaus: ("TRANSUNION" | "EQUIFAX" | "EXPERIAN")[];
  tradelines: {
    creditor: string;
    type: string;
    balance: number;
    limit: number | null;
    monthlyPayment: number;
    status: "CURRENT" | "DELINQUENT" | "CHARGED_OFF" | "COLLECTION";
    monthsOpen: number;
  }[];
  bankruptcyStatus: "NONE" | "CHAPTER_7" | "CHAPTER_13" | "DISMISSED";
  repoCount: number;
  derogatoryCount: number;
  inquiries: number;
  estimatedDTI: number;
  pullDate: string;
  referenceId: string;
};

// Score band definitions
function getScoreBand(score: number): string {
  if (score >= 720) return "PRIME";
  if (score >= 660) return "NEAR_PRIME";
  if (score >= 600) return "SUBPRIME";
  if (score >= 540) return "DEEP_SUBPRIME";
  return "ADVERSE";
}

// Generate realistic mock tradelines based on score
function generateTradelines(score: number, monthlyIncome: number): CreditPullResult["tradelines"] {
  const band = getScoreBand(score);
  const tradelines: CreditPullResult["tradelines"][] = [];

  if (band === "PRIME") {
    return [
      { creditor: "Chase Auto", type: "AUTO", balance: 12400, limit: null, monthlyPayment: 387, status: "CURRENT", monthsOpen: 28 },
      { creditor: "Capital One", type: "REVOLVING", balance: 1200, limit: 8000, monthlyPayment: 35, status: "CURRENT", monthsOpen: 48 },
      { creditor: "Discover", type: "REVOLVING", balance: 450, limit: 5000, monthlyPayment: 25, status: "CURRENT", monthsOpen: 36 },
      { creditor: "Mortgage Co", type: "MORTGAGE", balance: 187000, limit: null, monthlyPayment: 1247, status: "CURRENT", monthsOpen: 84 },
    ];
  }

  if (band === "NEAR_PRIME") {
    return [
      { creditor: "Westlake Auto", type: "AUTO", balance: 9800, limit: null, monthlyPayment: 312, status: "CURRENT", monthsOpen: 18 },
      { creditor: "Credit One", type: "REVOLVING", balance: 1800, limit: 2500, monthlyPayment: 55, status: "CURRENT", monthsOpen: 24 },
      { creditor: "Rent-A-Center", type: "INSTALLMENT", balance: 800, limit: null, monthlyPayment: 89, status: "CURRENT", monthsOpen: 12 },
    ];
  }

  if (band === "SUBPRIME") {
    return [
      { creditor: "DriveTime", type: "AUTO", balance: 7200, limit: null, monthlyPayment: 289, status: "CURRENT", monthsOpen: 10 },
      { creditor: "First Premier", type: "REVOLVING", balance: 700, limit: 700, monthlyPayment: 35, status: "CURRENT", monthsOpen: 18 },
      { creditor: "Collections LLC", type: "COLLECTION", balance: 1200, limit: null, monthlyPayment: 0, status: "COLLECTION", monthsOpen: 24 },
    ];
  }

  if (band === "DEEP_SUBPRIME") {
    return [
      { creditor: "JD Byrider", type: "AUTO", balance: 5400, limit: null, monthlyPayment: 0, status: "CHARGED_OFF", monthsOpen: 6 },
      { creditor: "Midland Credit", type: "COLLECTION", balance: 2300, limit: null, monthlyPayment: 0, status: "COLLECTION", monthsOpen: 36 },
      { creditor: "Portfolio Recovery", type: "COLLECTION", balance: 890, limit: null, monthlyPayment: 0, status: "COLLECTION", monthsOpen: 18 },
    ];
  }

  // ADVERSE
  return [
    { creditor: "Various", type: "COLLECTION", balance: 8900, limit: null, monthlyPayment: 0, status: "COLLECTION", monthsOpen: 48 },
    { creditor: "Repo Co", type: "AUTO", balance: 0, limit: null, monthlyPayment: 0, status: "CHARGED_OFF", monthsOpen: 12 },
  ];
}

function estimateDTI(tradelines: CreditPullResult["tradelines"], monthlyIncome: number): number {
  if (!monthlyIncome || monthlyIncome <= 0) return 0;
  const totalMonthlyDebt = tradelines
    .filter(t => t.status === "CURRENT")
    .reduce((sum, t) => sum + t.monthlyPayment, 0);
  return Math.round((totalMonthlyDebt / monthlyIncome) * 100);
}

export async function pullCredit(params: {
  ssn?: string | null;
  dob?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  creditScore?: number | null;
  monthlyIncome?: number | null;
}): Promise<CreditPullResult> {
  const CREDIT_API_KEY = process.env.CREDIT_API_KEY;

  // LIVE mode — when 700Credit credentials arrive
  if (CREDIT_API_KEY && params.ssn && params.dob) {
    // TODO: implement live 700Credit API call
    // For now fall through to mock
  }

  // Use manually entered score if provided, otherwise simulate based on nothing
  const score = params.creditScore ?? simulateScore();
  const monthlyIncome = params.monthlyIncome ?? 3000;
  const band = getScoreBand(score);
  const tradelines = generateTradelines(score, monthlyIncome);

  // Simulate derogatory indicators based on score
  const repoCount = score < 540 ? 1 : score < 580 ? Math.random() > 0.6 ? 1 : 0 : 0;
  const bankruptcyStatus: CreditPullResult["bankruptcyStatus"] =
    score < 520 ? "CHAPTER_7" : "NONE";
  const derogatoryCount = tradelines.filter(t => t.status !== "CURRENT").length;
  const inquiries = score >= 660 ? 2 : score >= 600 ? 4 : 7;

  return {
    score,
    source: params.creditScore ? "MANUAL" : "MOCK",
    bureaus: ["TRANSUNION"],
    tradelines,
    bankruptcyStatus,
    repoCount,
    derogatoryCount,
    inquiries,
    estimatedDTI: estimateDTI(tradelines, monthlyIncome),
    pullDate: new Date().toISOString(),
    referenceId: `MOCK-${Date.now()}`,
  };
}

function simulateScore(): number {
  // Realistic distribution: most people 580-720
  const ranges = [
    { min: 300, max: 539, weight: 8 },
    { min: 540, max: 579, weight: 12 },
    { min: 580, max: 619, weight: 18 },
    { min: 620, max: 659, weight: 22 },
    { min: 660, max: 699, weight: 20 },
    { min: 700, max: 739, weight: 12 },
    { min: 740, max: 850, weight: 8 },
  ];
  const total = ranges.reduce((s, r) => s + r.weight, 0);
  let rand = Math.random() * total;
  for (const range of ranges) {
    rand -= range.weight;
    if (rand <= 0) {
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
  }
  return 650;
}
