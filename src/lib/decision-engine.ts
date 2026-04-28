// src/lib/decision-engine.ts

export type DecisionStatus = "APPROVED" | "DECLINED"

export type DealTypeRecommendation = "RETAIL" | "IBL" | "LEASE" | "SUBSCRIPTION"

export type RiskTier =
  | "PRIME"
  | "NEAR_PRIME"
  | "SUBPRIME"
  | "DEEP_SUBPRIME"
  | "UNSCOREABLE"

export type LenderName =
  | "Global Lending Services"
  | "Westlake Financial"
  | "CPS"
  | "Midwest Acceptance"
  | "Western Funding"
  | "NONE"

export type DecisionEngineInput = {
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  email?: string | null

  identityType?: string | null
  identityValue?: string | null
  issuingCountry?: string | null
  identityStatus?: string | null

  stockNumber?: string | null
  vin?: string | null
  vehicleYear?: number | null
  vehicleMake?: string | null
  vehicleModel?: string | null
  vehiclePrice?: number | null
  mileage?: number | null

  downPayment?: number | null
  tradeIn?: number | null
  amountFinanced?: number | null

  creditScore?: number | null
  monthlyIncome?: number | null

  incomeType?: string | null
  employmentMonths?: number | null
  residenceMonths?: number | null
  bankruptcyStatus?: string | null
  repoCount?: number | null
  state?: string | null
}

export type LenderMatch = {
  lender: LenderName
  tier: string
  apr: number
  termMonths: number
  maxFinanced: number
  eligible: boolean
  reason: string
}

export type DecisionEngineOutput = {
  status: DecisionStatus
  riskTier: RiskTier
  recommendedDealType: DealTypeRecommendation
  alternateDealType?: DealTypeRecommendation
  lender: LenderName
  lenderTier: string
  apr: number
  termMonths: number
  maxPayment: number
  maxVehicle: number
  dealStrength: number
  pti: number
  estimatedDTI: number
  decisionReason: string
  dealTypeReason: string
  lenderWaterfall: LenderMatch[]
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function safeNumber(value: number | null | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0
  return value
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function hasValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== ""
}

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return principal / months
  return (principal * r) / (1 - Math.pow(1 + r, -months))
}

function calculateMaxLoan(
  maxMonthlyPayment: number,
  annualRate: number,
  months: number
): number {
  if (maxMonthlyPayment <= 0 || months <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return maxMonthlyPayment * months
  return maxMonthlyPayment * ((1 - Math.pow(1 + r, -months)) / r)
}

// ─── Risk Tier Assignment ───────────────────────────────────────────────────

function assignRiskTier(creditScore: number): RiskTier {
  if (creditScore === 0) return "UNSCOREABLE"
  if (creditScore >= 700) return "PRIME"
  if (creditScore >= 620) return "NEAR_PRIME"
  if (creditScore >= 520) return "SUBPRIME"
  return "DEEP_SUBPRIME"
}

// ─── Lender Waterfall ──────────────────────────────────────────────────────
// Based on actual program guidelines for all 5 lenders

function runLenderWaterfall(
  input: DecisionEngineInput,
  monthlyIncome: number,
  creditScore: number,
  vehiclePrice: number,
  vehicleYear: number,
  mileage: number,
  downPayment: number,
  tradeIn: number,
  state: string
): LenderMatch[] {
  const waterfall: LenderMatch[] = []
  const incomeType = (input.incomeType || "W2").toUpperCase()
  const bankruptcyStatus = (input.bankruptcyStatus || "NONE").toUpperCase()
  const repoCount = safeNumber(input.repoCount)
  const currentYear = new Date().getFullYear()
  const vehicleAge = currentYear - vehicleYear

  // ── 1. Global Lending Services ────────────────────────────────────────────
  // W2 only, 400-680 FICO, min $1,800/mo, max PTI 20%, no open BK, no repo last 9mo
  const glsEligible =
    monthlyIncome >= 1800 &&
    creditScore >= 400 &&
    creditScore <= 680 &&
    incomeType === "W2" &&
    bankruptcyStatus !== "OPEN" &&
    repoCount === 0 &&
    vehiclePrice >= 7000 &&
    vehiclePrice <= 55000

  let glsTier = "Tier 1"
  let glsMaxTerm = 72
  let glsMaxMileage = 80000

  if (creditScore >= 640) {
    glsTier = "Select"
    glsMaxTerm = 75
    glsMaxMileage = 80000
  } else if (creditScore >= 580) {
    glsTier = "Tier 1"
    glsMaxTerm = 72
    glsMaxMileage = 120000
  } else {
    glsTier = "Tier 2"
    glsMaxTerm = 66
    glsMaxMileage = 150000
  }

  const glsMileageOk = mileage <= glsMaxMileage

  waterfall.push({
    lender: "Global Lending Services",
    tier: glsTier,
    apr: 0.0995,
    termMonths: glsMaxTerm,
    maxFinanced: 55000,
    eligible: glsEligible && glsMileageOk,
    reason: !glsEligible
      ? incomeType !== "W2"
        ? "GLS requires W2 income"
        : creditScore > 680
        ? "Credit score above GLS max (680)"
        : creditScore < 400
        ? "Credit score below GLS min (400)"
        : monthlyIncome < 1800
        ? "Income below GLS minimum ($1,800/mo)"
        : bankruptcyStatus === "OPEN"
        ? "GLS does not accept open bankruptcies"
        : repoCount > 0
        ? "GLS does not accept recent repossessions"
        : vehiclePrice < 7000
        ? "Vehicle price below GLS minimum ($7,000)"
        : "Does not meet GLS program requirements"
      : !glsMileageOk
      ? `Mileage ${mileage.toLocaleString()} exceeds GLS max for this tier (${glsMaxMileage.toLocaleString()})`
      : `Eligible — ${glsTier}`,
  })

  // ── 2. Westlake Financial ─────────────────────────────────────────────────
  // Full spectrum, no min FICO, no min income, no min job time, max $50K
  // Tiers: Titanium 750+, Platinum 700-749, Gold 600-699, Standard 0-599
  let wlTier = "Standard"
  let wlApr = 0.2390
  let wlMinDown = 0.10
  let wlMaxLTV = 1.40
  let wlMaxTerm = 72

  if (creditScore >= 750) {
    wlTier = "Titanium"
    wlApr = 0.0609
    wlMinDown = 0
    wlMaxLTV = 1.50
  } else if (creditScore >= 700) {
    wlTier = "Platinum"
    wlApr = 0.0999
    wlMinDown = 0
    wlMaxLTV = 1.50
  } else if (creditScore >= 600) {
    wlTier = "Gold"
    wlApr = 0.1599
    wlMinDown = 0.075
    wlMaxLTV = 1.50
  }

  const wlHasRepo =
    repoCount > 0 &&
    (input.bankruptcyStatus || "").toUpperCase() !== "DISCHARGED"

  const downPct =
    vehiclePrice > 0 ? (downPayment + tradeIn) / vehiclePrice : 0

  const wlEligible =
    vehiclePrice <= 50000 &&
    !wlHasRepo &&
    downPct >= wlMinDown

  waterfall.push({
    lender: "Westlake Financial",
    tier: wlTier,
    apr: wlApr,
    termMonths: wlMaxTerm,
    maxFinanced: 50000,
    eligible: wlEligible,
    reason: !wlEligible
      ? vehiclePrice > 50000
        ? "Vehicle price exceeds Westlake max ($50,000)"
        : wlHasRepo
        ? "Westlake does not accept prior Westlake/Wilshire repossessions"
        : `Minimum down payment required: ${(wlMinDown * 100).toFixed(0)}%`
      : `Eligible — ${wlTier} tier`,
  })

  // ── 3. CPS — Consumer Portfolio Services ─────────────────────────────────
  // No min FICO, self-employed/1099 OK, open BK OK, min income $1,400-$2,500 by tier
  const vehicleAgeCPSOk = vehicleAge <= 15
  let cpsTier = "Standard"
  let cpsMinIncome = 1400
  let cpsMaxPTI = 0.15
  let cpsMaxDTI = 0.45
  let cpsMaxFinanced = 35000
  let cpsApr = 0.2199
  let cpsTerm = 60

  if (creditScore >= 680 || monthlyIncome >= 5000) {
    cpsTier = "Meta"
    cpsMinIncome = 2500
    cpsMaxPTI = 0.16
    cpsMaxDTI = 0.80
    cpsMaxFinanced = 55000
    cpsApr = 0.1455
    cpsTerm = 78
  } else if (creditScore >= 620 || monthlyIncome >= 4000) {
    cpsTier = "Alpha Plus"
    cpsMinIncome = 2000
    cpsMaxPTI = 0.16
    cpsMaxDTI = 0.50
    cpsMaxFinanced = 40000
    cpsApr = 0.1799
    cpsTerm = 66
  } else if (creditScore >= 560 || monthlyIncome >= 3000) {
    cpsTier = "Alpha"
    cpsMinIncome = 1600
    cpsMaxPTI = 0.16
    cpsMaxDTI = 0.50
    cpsMaxFinanced = 40000
    cpsApr = 0.1999
    cpsTerm = 60
  }

  const cpsPTI =
    monthlyIncome > 0
      ? calculateMonthlyPayment(vehiclePrice, cpsApr, cpsTerm) / monthlyIncome
      : 1

  const cpsEligible =
    monthlyIncome >= cpsMinIncome &&
    vehicleAgeCPSOk &&
    vehiclePrice <= cpsMaxFinanced &&
    cpsPTI <= cpsMaxPTI

  waterfall.push({
    lender: "CPS",
    tier: cpsTier,
    apr: cpsApr,
    termMonths: cpsTerm,
    maxFinanced: cpsMaxFinanced,
    eligible: cpsEligible,
    reason: !cpsEligible
      ? monthlyIncome < cpsMinIncome
        ? `Income below CPS ${cpsTier} minimum ($${cpsMinIncome.toLocaleString()}/mo)`
        : !vehicleAgeCPSOk
        ? `Vehicle age ${vehicleAge} years exceeds CPS maximum (15 years)`
        : vehiclePrice > cpsMaxFinanced
        ? `Vehicle price exceeds CPS ${cpsTier} maximum ($${cpsMaxFinanced.toLocaleString()})`
        : `PTI too high for CPS ${cpsTier} (max ${(cpsMaxPTI * 100).toFixed(0)}%)`
      : `Eligible — ${cpsTier} tier`,
  })

  // ── 4. Midwest Acceptance Corp ────────────────────────────────────────────
  // MO/IL/AR/KS only, no min FICO, min $1,800/mo, max $20K, 5 tiers
  const macStates = ["MO", "IL", "AR", "KS"]
  const macStateOk = macStates.includes(state.toUpperCase())
  const macNoEV = true // No EVs

  let macTier = "Tier B"
  let macApr = 0.2295
  let macMaxFinanced = 20000
  let macTerm = 60

  if (creditScore >= 650 || monthlyIncome >= 4000) {
    macTier = "Tier A"
    macApr = 0.1695
  } else if (vehiclePrice <= 10000) {
    macTier = "Tier C"
    macApr = 0.2695
    macMaxFinanced = 10000
    macTerm = 42
  }

  const macEligible =
    macStateOk &&
    monthlyIncome >= 1800 &&
    vehiclePrice <= macMaxFinanced &&
    macNoEV

  waterfall.push({
    lender: "Midwest Acceptance",
    tier: macTier,
    apr: macApr,
    termMonths: macTerm,
    maxFinanced: macMaxFinanced,
    eligible: macEligible,
    reason: !macEligible
      ? !macStateOk
        ? `Midwest Acceptance only serves MO, IL, AR, KS (customer state: ${state})`
        : monthlyIncome < 1800
        ? "Income below MAC minimum ($1,800/mo)"
        : vehiclePrice > macMaxFinanced
        ? `Vehicle price exceeds MAC maximum ($${macMaxFinanced.toLocaleString()})`
        : "Does not meet MAC program requirements"
      : `Eligible — ${macTier}`,
  })

  // ── 5. Western Funding ────────────────────────────────────────────────────
  // True catch-all — no min FICO, no min income, no min job, unlimited mileage
  const wfiMaxFinanced = creditScore >= 580 ? 24000 : 20000

  const wfiEligible = vehiclePrice <= wfiMaxFinanced

  waterfall.push({
    lender: "Western Funding",
    tier: creditScore >= 580 ? "Tier 1-4" : "Tier 5-9",
    apr: 0.2499,
    termMonths: 48,
    maxFinanced: wfiMaxFinanced,
    eligible: wfiEligible,
    reason: !wfiEligible
      ? `Vehicle price ($${vehiclePrice.toLocaleString()}) exceeds Western Funding maximum ($${wfiMaxFinanced.toLocaleString()})`
      : "Eligible — catch-all program",
  })

  return waterfall
}

// ─── Deal Type Recommendation ──────────────────────────────────────────────

function recommendDealType(
  creditScore: number,
  monthlyIncome: number,
  incomeType: string,
  riskTier: RiskTier,
  vehiclePrice: number,
  vehicleYear: number
): { primary: DealTypeRecommendation; alternate?: DealTypeRecommendation; reason: string } {
  const currentYear = new Date().getFullYear()
  const vehicleAge = currentYear - vehicleYear
  const isGigOrSelfEmployed = ["1099", "SELF_EMPLOYED", "GIG", "BANK_STATEMENT"].includes(
    incomeType.toUpperCase()
  )

  // PRIME — clean credit, W2 income → Retail
  if (riskTier === "PRIME" && !isGigOrSelfEmployed) {
    return {
      primary: "RETAIL",
      reason:
        "Strong credit profile and verified W2 income qualify for standard retail financing at competitive rates.",
    }
  }

  // NEAR PRIME with W2 → Retail, offer Lease as alternate
  if (riskTier === "NEAR_PRIME" && !isGigOrSelfEmployed) {
    return {
      primary: "RETAIL",
      alternate: "LEASE",
      reason:
        "Near-prime credit with stable W2 income supports retail financing. Lease is an option if a lower payment is preferred.",
    }
  }

  // Self-employed or 1099 regardless of credit → IBL
  if (isGigOrSelfEmployed) {
    return {
      primary: "IBL",
      alternate: "LEASE",
      reason:
        "1099 or self-employed income requires income-based lending structure. Payment is built around verified monthly deposits rather than credit score. CPS and Western Funding are primary lenders.",
    }
  }

  // SUBPRIME → IBL primary, Lease alternate
  if (riskTier === "SUBPRIME") {
    return {
      primary: "IBL",
      alternate: "LEASE",
      reason:
        "Subprime credit profile is best structured as income-based lending. Payment is calculated from verified income (PTI max 15-16%). Lease or subscription may provide a lower payment option.",
    }
  }

  // DEEP SUBPRIME → IBL or Subscription
  if (riskTier === "DEEP_SUBPRIME") {
    return {
      primary: "IBL",
      alternate: "SUBSCRIPTION",
      reason:
        "Deep subprime profile requires income-based structuring. Western Funding is the primary lender. Subscription may be the best option if retail or IBL cannot be structured within payment limits.",
    }
  }

  // UNSCOREABLE → IBL
  if (riskTier === "UNSCOREABLE") {
    return {
      primary: "IBL",
      reason:
        "No credit score on file. Income-based lending is the recommended structure. CPS and Western Funding accept zero-score applicants. Bank statements or pay stubs required.",
    }
  }

  return {
    primary: "RETAIL",
    reason: "Standard retail financing recommended based on available profile data.",
  }
}

// ─── Deal Strength Scoring ─────────────────────────────────────────────────

function scoreDeal(
  input: DecisionEngineInput,
  creditScore: number,
  monthlyIncome: number,
  vehiclePrice: number,
  maxVehicle: number,
  downPayment: number,
  tradeIn: number
): number {
  let score = 0

  // Credit (0-30)
  if (creditScore >= 750) score += 30
  else if (creditScore >= 700) score += 26
  else if (creditScore >= 660) score += 22
  else if (creditScore >= 620) score += 18
  else if (creditScore >= 580) score += 14
  else if (creditScore >= 540) score += 10
  else if (creditScore >= 500) score += 6
  else if (creditScore > 0) score += 3

  // Income (0-25)
  if (monthlyIncome >= 8000) score += 25
  else if (monthlyIncome >= 6000) score += 22
  else if (monthlyIncome >= 5000) score += 19
  else if (monthlyIncome >= 4000) score += 16
  else if (monthlyIncome >= 3200) score += 13
  else if (monthlyIncome >= 2500) score += 10
  else if (monthlyIncome >= 1800) score += 6

  // Cash in deal — down + trade (0-20)
  const totalCash = downPayment + tradeIn
  const cashRatio = vehiclePrice > 0 ? totalCash / vehiclePrice : 0
  if (cashRatio >= 0.30) score += 20
  else if (cashRatio >= 0.20) score += 16
  else if (cashRatio >= 0.15) score += 13
  else if (cashRatio >= 0.10) score += 10
  else if (cashRatio >= 0.05) score += 6
  else if (totalCash > 0) score += 3

  // Vehicle fit vs max vehicle (0-15)
  if (vehiclePrice <= 0 || maxVehicle <= 0) score += 0
  else if (vehiclePrice <= maxVehicle * 0.80) score += 15
  else if (vehiclePrice <= maxVehicle * 0.90) score += 12
  else if (vehiclePrice <= maxVehicle) score += 9
  else if (vehiclePrice <= maxVehicle * 1.10) score += 4

  // Identity verified (0-10)
  if ((input.identityStatus || "").toUpperCase() === "VERIFIED") score += 10
  else if ((input.identityStatus || "").toUpperCase() === "PENDING") score += 4

  return clamp(score, 0, 100)
}

// ─── Main Engine ───────────────────────────────────────────────────────────

export function runDecisionEngine(input: DecisionEngineInput): DecisionEngineOutput {
  const creditScore = safeNumber(input.creditScore)
  const monthlyIncome = safeNumber(input.monthlyIncome)
  const vehiclePrice = safeNumber(input.vehiclePrice)
  const vehicleYear = safeNumber(input.vehicleYear) || new Date().getFullYear() - 5
  const mileage = safeNumber(input.mileage)
  const downPayment = safeNumber(input.downPayment)
  const tradeIn = safeNumber(input.tradeIn)
  const incomeType = input.incomeType || "W2"
  const state = input.state || "MO"

  // 1. Assign risk tier
  const riskTier = assignRiskTier(creditScore)

  // 2. Run lender waterfall
  const lenderWaterfall = runLenderWaterfall(
    input,
    monthlyIncome,
    creditScore,
    vehiclePrice,
    vehicleYear,
    mileage,
    downPayment,
    tradeIn,
    state
  )

  // 3. Find best eligible lender
  const bestLender = lenderWaterfall.find((l) => l.eligible)

  // 4. Calculate PTI and DTI
  const estimatedMonthlyDebts = monthlyIncome * 0.15
  const maxPaymentRaw = bestLender
    ? monthlyIncome * (riskTier === "PRIME" ? 0.18 : riskTier === "NEAR_PRIME" ? 0.17 : riskTier === "SUBPRIME" ? 0.16 : 0.15)
    : 0

  const maxPayment = roundCurrency(clamp(maxPaymentRaw, 0, monthlyIncome * 0.20))
  const pti = monthlyIncome > 0 ? maxPayment / monthlyIncome : 0
  const estimatedDTI = monthlyIncome > 0 ? (maxPayment + estimatedMonthlyDebts) / monthlyIncome : 0

  // 5. Calculate max vehicle
  const maxLoan = bestLender
    ? calculateMaxLoan(maxPayment, bestLender.apr, bestLender.termMonths)
    : 0
  const maxVehicle = roundCurrency(Math.max(0, maxLoan + downPayment + tradeIn))

  // 6. Deal strength score
  const dealStrength = scoreDeal(
    input,
    creditScore,
    monthlyIncome,
    vehiclePrice,
    maxVehicle,
    downPayment,
    tradeIn
  )

  // 7. Deal type recommendation
  const dealTypeResult = recommendDealType(
    creditScore,
    monthlyIncome,
    incomeType,
    riskTier,
    vehiclePrice,
    vehicleYear
  )

  // 8. Determine approval status
  const missingCore =
    !hasValue(input.firstName) ||
    !hasValue(input.lastName) ||
    vehiclePrice <= 0 ||
    monthlyIncome <= 0

  let status: DecisionStatus = "APPROVED"
  let declineReason = ""

  if (missingCore) {
    status = "DECLINED"
    declineReason = "Missing required application data. First name, last name, vehicle, and income are required."
  } else if (!bestLender) {
    status = "DECLINED"
    declineReason = "No eligible lender found in waterfall. Vehicle price may exceed all program limits or applicant does not meet minimum requirements."
  } else if (vehiclePrice > maxVehicle && maxVehicle > 0) {
    status = "DECLINED"
    declineReason = `Selected vehicle ($${vehiclePrice.toLocaleString()}) exceeds calculated maximum vehicle amount ($${maxVehicle.toLocaleString()}) based on income and program limits.`
  } else if (dealStrength < 20) {
    status = "DECLINED"
    declineReason = `Deal strength score (${dealStrength}/100) is below minimum threshold. Additional down payment, trade-in, or income verification may help.`
  }

  // 9. Build decision reason
  const decisionReason =
    status === "DECLINED"
      ? declineReason
      : `Approved — ${riskTier.replace("_", " ")} profile. ${bestLender?.lender} ${bestLender?.tier}. Max payment $${maxPayment.toLocaleString()} / Max vehicle $${maxVehicle.toLocaleString()}. Deal strength ${dealStrength}/100.`

  return {
    status,
    riskTier,
    recommendedDealType: dealTypeResult.primary,
    alternateDealType: dealTypeResult.alternate,
    lender: bestLender?.lender ?? "NONE",
    lenderTier: bestLender?.tier ?? "—",
    apr: bestLender?.apr ?? 0,
    termMonths: bestLender?.termMonths ?? 0,
    maxPayment,
    maxVehicle,
    dealStrength,
    pti: roundCurrency(pti * 100),
    estimatedDTI: roundCurrency(estimatedDTI * 100),
    decisionReason,
    dealTypeReason: dealTypeResult.reason,
    lenderWaterfall,
  }
}