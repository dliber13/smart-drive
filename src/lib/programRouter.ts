// Program Router — Task 5
// Waterfall: IBL → Retail → Lease → Subscription
// No salesman input. The engine decides.

import type { IBLDecision } from "./iblEngine";

type DecisionEngineOutput = {
  status: string;
  lender: string;
  lenderTier: string;
  apr: number;
  termMonths: number;
  maxPayment: number;
  maxVehicle: number;
  decisionReason: string;
  [key: string]: any;
};

export type Program = "IBL" | "RETAIL" | "LEASE" | "SUBSCRIPTION" | "DECLINED";

export type ProgramRouterResult = {
  assignedProgram: Program;
  programReason: string;
  iblEligible: boolean;
  retailEligible: boolean;
  leaseEligible: boolean;
  subscriptionEligible: boolean;
  waterfallTrace: {
    program: Program;
    evaluated: boolean;
    eligible: boolean;
    reason: string;
  }[];
  finalMaxPayment: number;
  finalMaxVehicle: number;
  finalWeeklyPayment: number;
  finalBiweeklyPayment: number;
  finalTerm: string;
  finalLender: string;
  finalAPR: number;
};

export type RouterInput = {
  ibl: IBLDecision;
  retail: DecisionEngineOutput;
  vehiclePrice: number;
  monthlyIncome: number;
  creditScore: number;
  payFrequency: string;
};

export function runProgramRouter(input: RouterInput): ProgramRouterResult {
  const trace: ProgramRouterResult["waterfallTrace"] = [];

  // ── Step 1: IBL ──────────────────────────────────────────────────────────
  const iblEligible = input.ibl.eligible;
  trace.push({
    program: "IBL",
    evaluated: true,
    eligible: iblEligible,
    reason: iblEligible
      ? `IBL Band ${input.ibl.riskBand} — score ${input.ibl.score}/100. Max weekly $${input.ibl.maxWeeklyPayment}, max vehicle $${input.ibl.maxVehiclePrice.toLocaleString()}.`
      : input.ibl.declineReasons.length > 0
      ? input.ibl.declineReasons.join("; ")
      : `IBL score ${input.ibl.score}/100 — below Band D threshold (28).`,
  });

  if (iblEligible) {
    return buildResult("IBL", trace, input, iblEligible, false, false, false);
  }

  // ── Step 2: Retail ───────────────────────────────────────────────────────
  const retailEligible = input.retail.status === "APPROVED";
  trace.push({
    program: "RETAIL",
    evaluated: true,
    eligible: retailEligible,
    reason: retailEligible
      ? `${input.retail.lender} ${input.retail.lenderTier} — ${(input.retail.apr * 100).toFixed(2)}% APR, ${input.retail.termMonths} months. Max payment $${input.retail.maxPayment.toLocaleString()}.`
      : input.retail.decisionReason,
  });

  if (retailEligible) {
    return buildResult("RETAIL", trace, input, iblEligible, retailEligible, false, false);
  }

  // ── Step 3: Lease ────────────────────────────────────────────────────────
  // Lease eligibility: credit >= 600, income >= $2,500, vehicle price <= $35K
  const leaseEligible =
    input.creditScore >= 600 &&
    input.monthlyIncome >= 2500 &&
    input.vehiclePrice <= 35000 &&
    input.vehiclePrice > 0;

  trace.push({
    program: "LEASE",
    evaluated: true,
    eligible: leaseEligible,
    reason: leaseEligible
      ? `Lease eligible — credit ${input.creditScore}, income $${input.monthlyIncome.toLocaleString()}/mo, vehicle $${input.vehiclePrice.toLocaleString()}.`
      : input.creditScore < 600
      ? `Credit score ${input.creditScore} below lease minimum (600).`
      : input.monthlyIncome < 2500
      ? `Income $${input.monthlyIncome.toLocaleString()}/mo below lease minimum ($2,500/mo).`
      : `Vehicle price $${input.vehiclePrice.toLocaleString()} exceeds lease maximum ($35,000).`,
  });

  if (leaseEligible) {
    return buildResult("LEASE", trace, input, iblEligible, retailEligible, leaseEligible, false);
  }

  // ── Step 4: Subscription ─────────────────────────────────────────────────
  // Subscription: income >= $1,500, vehicle price <= $15K — true last resort
  const subscriptionEligible =
    input.monthlyIncome >= 1500 &&
    input.vehiclePrice <= 15000 &&
    input.vehiclePrice > 0;

  trace.push({
    program: "SUBSCRIPTION",
    evaluated: true,
    eligible: subscriptionEligible,
    reason: subscriptionEligible
      ? `Subscription eligible — income $${input.monthlyIncome.toLocaleString()}/mo, vehicle $${input.vehiclePrice.toLocaleString()}.`
      : input.monthlyIncome < 1500
      ? `Income $${input.monthlyIncome.toLocaleString()}/mo below subscription minimum ($1,500/mo).`
      : `Vehicle price $${input.vehiclePrice.toLocaleString()} exceeds subscription maximum ($15,000).`,
  });

  if (subscriptionEligible) {
    return buildResult("SUBSCRIPTION", trace, input, iblEligible, retailEligible, leaseEligible, subscriptionEligible);
  }

  // ── Step 5: Full Decline ─────────────────────────────────────────────────
  trace.push({
    program: "DECLINED",
    evaluated: true,
    eligible: false,
    reason: "No eligible program found. Application does not meet minimum requirements for IBL, Retail, Lease, or Subscription.",
  });

  return buildResult("DECLINED", trace, input, false, false, false, false);
}

function buildResult(
  program: Program,
  trace: ProgramRouterResult["waterfallTrace"],
  input: RouterInput,
  iblEligible: boolean,
  retailEligible: boolean,
  leaseEligible: boolean,
  subscriptionEligible: boolean
): ProgramRouterResult {
  let finalMaxPayment = 0;
  let finalMaxVehicle = 0;
  let finalWeeklyPayment = 0;
  let finalBiweeklyPayment = 0;
  let finalTerm = "";
  let finalLender = "";
  let finalAPR = 0;
  let programReason = "";

  switch (program) {
    case "IBL":
      finalMaxPayment = input.ibl.maxMonthlyPayment;
      finalMaxVehicle = input.ibl.maxVehiclePrice;
      finalWeeklyPayment = input.ibl.maxWeeklyPayment;
      finalBiweeklyPayment = input.ibl.maxBiweeklyPayment;
      finalTerm = `${input.ibl.recommendedTerm} weeks (${Math.round(input.ibl.recommendedTerm / 52 * 10) / 10} years)`;
      finalLender = "In-House / BHPH";
      finalAPR = 0;
      programReason = `IBL assigned — Band ${input.ibl.riskBand}, score ${input.ibl.score}/100. Payment structured from verified income. Required down: $${input.ibl.requiredDown.toLocaleString()}.`;
      break;

    case "RETAIL":
      finalMaxPayment = input.retail.maxPayment;
      finalMaxVehicle = input.retail.maxVehicle;
      finalWeeklyPayment = Math.round(input.retail.maxPayment * 12 / 52);
      finalBiweeklyPayment = Math.round(input.retail.maxPayment * 12 / 26);
      finalTerm = `${input.retail.termMonths} months`;
      finalLender = input.retail.lender;
      finalAPR = input.retail.apr;
      programReason = `Retail assigned — ${input.retail.lender} ${input.retail.lenderTier} at ${(input.retail.apr * 100).toFixed(2)}% APR for ${input.retail.termMonths} months.`;
      break;

    case "LEASE":
      finalMaxPayment = Math.round(input.monthlyIncome * 0.15);
      finalMaxVehicle = Math.min(input.vehiclePrice, 35000);
      finalWeeklyPayment = Math.round(finalMaxPayment * 12 / 52);
      finalBiweeklyPayment = Math.round(finalMaxPayment * 12 / 26);
      finalTerm = "36 months";
      finalLender = "Lease Program";
      finalAPR = 0.0799;
      programReason = `Lease assigned — retail and IBL not available. 36-month lease structure at estimated $${finalMaxPayment.toLocaleString()}/mo.`;
      break;

    case "SUBSCRIPTION":
      finalMaxPayment = Math.round(input.monthlyIncome * 0.12);
      finalMaxVehicle = Math.min(input.vehiclePrice, 15000);
      finalWeeklyPayment = Math.round(finalMaxPayment * 12 / 52);
      finalBiweeklyPayment = Math.round(finalMaxPayment * 12 / 26);
      finalTerm = "Month-to-month";
      finalLender = "Subscription Program";
      finalAPR = 0;
      programReason = `Subscription assigned — last resort program. Month-to-month structure at estimated $${finalMaxPayment.toLocaleString()}/mo. Vehicle must be priced under $15,000.`;
      break;

    case "DECLINED":
      programReason = "Application declined across all programs — IBL, Retail, Lease, and Subscription.";
      break;
  }

  return {
    assignedProgram: program,
    programReason,
    iblEligible,
    retailEligible,
    leaseEligible,
    subscriptionEligible,
    waterfallTrace: trace,
    finalMaxPayment,
    finalMaxVehicle,
    finalWeeklyPayment,
    finalBiweeklyPayment,
    finalTerm,
    finalLender,
    finalAPR,
  };
}
