import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type DecisionTier = "A" | "B" | "C" | "D" | "E"
type DecisionStatus = "APPROVED" | "DECLINED"

type DecisionEngineInput = {
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

  downPayment?: number | null
  tradeIn?: number | null
  amountFinanced?: number | null

  creditScore?: number | null
  monthlyIncome?: number | null
}

type DecisionEngineOutput = {
  status: DecisionStatus
  tier: DecisionTier
  lender: string
  maxPayment: number
  maxVehicle: number
  dealStrength: number
  decisionReason: string
}

type TierConfig = {
  tier: DecisionTier
  apr: number
  termMonths: number
  paymentToIncomeRatio: number
  maxLoanToValue: number
  lender: string
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

function safeNumber(value: number | null | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0
  return value
}

function getTierConfig(creditScore: number): TierConfig {
  if (creditScore >= 750) {
    return {
      tier: "A",
      apr: 0.0799,
      termMonths: 72,
      paymentToIncomeRatio: 0.18,
      maxLoanToValue: 1.15,
      lender: "Prime Auto Financial",
    }
  }

  if (creditScore >= 680) {
    return {
      tier: "B",
      apr: 0.1099,
      termMonths: 72,
      paymentToIncomeRatio: 0.17,
      maxLoanToValue: 1.1,
      lender: "Summit Credit Union Auto",
    }
  }

  if (creditScore >= 620) {
    return {
      tier: "C",
      apr: 0.1499,
      termMonths: 66,
      paymentToIncomeRatio: 0.16,
      maxLoanToValue: 1.05,
      lender: "Regional Auto Finance",
    }
  }

  if (creditScore >= 560) {
    return {
      tier: "D",
      apr: 0.1899,
      termMonths: 60,
      paymentToIncomeRatio: 0.15,
      maxLoanToValue: 1.0,
      lender: "Second Chance Auto Credit",
    }
  }

  return {
    tier: "E",
    apr: 0.2499,
    termMonths: 48,
    paymentToIncomeRatio: 0.13,
    maxLoanToValue: 0.9,
    lender: "Subprime Mobility Finance",
  }
}

function calculatePresentValueFromPayment(
  monthlyPayment: number,
  annualRate: number,
  months: number
): number {
  if (monthlyPayment <= 0 || months <= 0) return 0

  const monthlyRate = annualRate / 12

  if (monthlyRate === 0) {
    return monthlyPayment * months
  }

  return monthlyPayment * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate)
}

function scoreIdentity(input: DecisionEngineInput): number {
  let points = 0

  if (hasValue(input.identityType)) points += 3
  if (hasValue(input.identityValue)) points += 3
  if (hasValue(input.issuingCountry)) points += 2

  const identityStatus = (input.identityStatus || "").toUpperCase()

  if (identityStatus === "VERIFIED") {
    points += 7
  } else if (identityStatus === "PENDING") {
    points += 3
  }

  return clamp(points, 0, 15)
}

function scoreApplicantBasics(input: DecisionEngineInput): number {
  let points = 0

  if (hasValue(input.firstName)) points += 2
  if (hasValue(input.lastName)) points += 2
  if (hasValue(input.phone)) points += 2
  if (hasValue(input.email)) points += 2

  return clamp(points, 0, 8)
}

function scoreCredit(creditScore: number): number {
  if (creditScore >= 800) return 30
  if (creditScore >= 750) return 28
  if (creditScore >= 700) return 24
  if (creditScore >= 660) return 20
  if (creditScore >= 620) return 16
  if (creditScore >= 580) return 12
  if (creditScore >= 540) return 8
  if (creditScore >= 500) return 5
  return 0
}

function scoreIncome(monthlyIncome: number): number {
  if (monthlyIncome >= 8000) return 20
  if (monthlyIncome >= 6000) return 18
  if (monthlyIncome >= 5000) return 16
  if (monthlyIncome >= 4000) return 14
  if (monthlyIncome >= 3200) return 11
  if (monthlyIncome >= 2500) return 8
  if (monthlyIncome >= 1800) return 5
  return 0
}

function scoreCashStructure(
  downPayment: number,
  tradeIn: number,
  vehiclePrice: number
): number {
  if (vehiclePrice <= 0) return 0

  const totalCashIn = downPayment + tradeIn
  const ratio = totalCashIn / vehiclePrice

  if (ratio >= 0.3) return 15
  if (ratio >= 0.2) return 12
  if (ratio >= 0.15) return 10
  if (ratio >= 0.1) return 8
  if (ratio >= 0.05) return 5
  if (ratio > 0) return 3
  return 0
}

function scoreVehicleFit(vehiclePrice: number, maxVehicle: number): number {
  if (vehiclePrice <= 0 || maxVehicle <= 0) return 0

  if (vehiclePrice <= maxVehicle * 0.85) return 12
  if (vehiclePrice <= maxVehicle * 0.95) return 10
  if (vehiclePrice <= maxVehicle) return 8
  if (vehiclePrice <= maxVehicle * 1.1) return 4
  return 0
}

function buildDecisionReason(params: {
  status: DecisionStatus
  tier: DecisionTier
  creditScore: number
  monthlyIncome: number
  vehiclePrice: number
  maxVehicle: number
  maxPayment: number
  dealStrength: number
}): string {
  const {
    status,
    tier,
    creditScore,
    monthlyIncome,
    vehiclePrice,
    maxVehicle,
    maxPayment,
    dealStrength,
  } = params

  if (status === "DECLINED") {
    if (creditScore < 500) {
      return `Declined due to low credit score (${creditScore}) below minimum underwriting threshold.`
    }

    if (monthlyIncome < 1800) {
      return `Declined due to low monthly income (${roundCurrency(monthlyIncome)}) below minimum affordability threshold.`
    }

    if (vehiclePrice > maxVehicle) {
      return `Declined because selected vehicle price (${roundCurrency(vehiclePrice)}) exceeds calculated max vehicle amount (${roundCurrency(maxVehicle)}).`
    }

    return `Declined due to overall weak deal profile. Deal strength ${dealStrength}/100.`
  }

  return `Approved in Tier ${tier}. Deal strength ${dealStrength}/100. Max payment ${roundCurrency(maxPayment)} and max vehicle ${roundCurrency(maxVehicle)} support current structure.`
}

function runDecisionEngine(input: DecisionEngineInput): DecisionEngineOutput {
  const creditScore = safeNumber(input.creditScore)
  const monthlyIncome = safeNumber(input.monthlyIncome)
  const vehiclePrice = safeNumber(input.vehiclePrice)
  const downPayment = safeNumber(input.downPayment)
  const tradeIn = safeNumber(input.tradeIn)

  const tierConfig = getTierConfig(creditScore)

  const baseMaxPayment = monthlyIncome * tierConfig.paymentToIncomeRatio

  let adjustedMaxPayment = baseMaxPayment

  if ((input.identityStatus || "").toUpperCase() === "VERIFIED") {
    adjustedMaxPayment += 50
  }

  if (downPayment + tradeIn >= 3000) {
    adjustedMaxPayment += 35
  }

  if (creditScore < 560) {
    adjustedMaxPayment -= 50
  }

  adjustedMaxPayment = clamp(adjustedMaxPayment, 0, monthlyIncome * 0.2)

  const financeableAmount = calculatePresentValueFromPayment(
    adjustedMaxPayment,
    tierConfig.apr,
    tierConfig.termMonths
  )

  const maxVehicleRaw =
    financeableAmount / tierConfig.maxLoanToValue + downPayment + tradeIn

  const maxVehicle = Math.max(0, roundCurrency(maxVehicleRaw))
  const maxPayment = Math.max(0, roundCurrency(adjustedMaxPayment))

  const applicantPoints = scoreApplicantBasics(input)
  const identityPoints = scoreIdentity(input)
  const creditPoints = scoreCredit(creditScore)
  const incomePoints = scoreIncome(monthlyIncome)
  const cashPoints = scoreCashStructure(downPayment, tradeIn, vehiclePrice)
  const vehicleFitPoints = scoreVehicleFit(vehiclePrice, maxVehicle)

  const totalScore =
    applicantPoints +
    identityPoints +
    creditPoints +
    incomePoints +
    cashPoints +
    vehicleFitPoints

  const dealStrength = clamp(Math.round(totalScore), 0, 100)

  let status: DecisionStatus = "APPROVED"

  const missingCoreData =
    !hasValue(input.firstName) ||
    !hasValue(input.lastName) ||
    !hasValue(input.vehicleMake) ||
    !hasValue(input.vehicleModel) ||
    vehiclePrice <= 0 ||
    creditScore <= 0 ||
    monthlyIncome <= 0

  if (missingCoreData) {
    status = "DECLINED"
  }

  if (creditScore < 500) {
    status = "DECLINED"
  }

  if (monthlyIncome < 1800) {
    status = "DECLINED"
  }

  if (vehiclePrice > maxVehicle && maxVehicle > 0) {
    status = "DECLINED"
  }

  if (dealStrength < 35) {
    status = "DECLINED"
  }

  const decisionReason = buildDecisionReason({
    status,
    tier: tierConfig.tier,
    creditScore,
    monthlyIncome,
    vehiclePrice,
    maxVehicle,
    maxPayment,
    dealStrength,
  })

  return {
    status,
    tier: tierConfig.tier,
    lender: tierConfig.lender,
    maxPayment,
    maxVehicle,
    dealStrength,
    decisionReason,
  }
}

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const application = await prisma.application.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          reason: "Application not found",
        },
        { status: 404 }
      )
    }

    const decision = runDecisionEngine({
      firstName: application.firstName,
      lastName: application.lastName,
      phone: application.phone,
      email: application.email,

      identityType: application.identityType,
      identityValue: application.identityValue,
      issuingCountry: application.issuingCountry,
      identityStatus: application.identityStatus,

      stockNumber: application.stockNumber,
      vin: application.vin,
      vehicleYear: application.vehicleYear,
      vehicleMake: application.vehicleMake,
      vehicleModel: application.vehicleModel,
      vehiclePrice: application.vehiclePrice,

      downPayment: application.downPayment,
      tradeIn: application.tradeIn,
      amountFinanced: application.amountFinanced,

      creditScore: application.creditScore,
      monthlyIncome: application.monthlyIncome,
    })

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: decision.status,
        lender: decision.lender,
        tier: decision.tier,
        maxPayment: decision.maxPayment,
        maxVehicle: decision.maxVehicle,
        dealStrength: decision.dealStrength,
        decisionReason: decision.decisionReason,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Decision engine completed successfully",
      decision,
      application: updatedApplication,
    })
  } catch (error) {
    console.error("Decision engine error:", error)

    return NextResponse.json(
      {
        success: false,
        reason: "Failed to run decision engine",
      },
      { status: 500 }
    )
  }
}
