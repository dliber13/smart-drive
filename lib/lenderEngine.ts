type LenderResult = {
  lenders: string[]
  maxVehicle: number
  maxPayment: number
}

export function getLenderOptions(input: {
  tier: string
  monthlyIncome?: number | null
}) : LenderResult {

  const income = input.monthlyIncome ?? 0

  let lenders: string[] = []
  let maxVehicle = 0
  let maxPayment = 0

  // Tier-based lender mapping
  if (input.tier === "A") {
    lenders = ["Ally", "Capital One", "Chase"]
    maxVehicle = income * 6
    maxPayment = income * 0.15
  }

  else if (input.tier === "B") {
    lenders = ["Westlake", "Exeter", "Santander"]
    maxVehicle = income * 5
    maxPayment = income * 0.18
  }

  else if (input.tier === "C") {
    lenders = ["Santander", "Credit Acceptance"]
    maxVehicle = income * 4
    maxPayment = income * 0.20
  }

  else {
    lenders = ["Credit Acceptance", "Regional Subprime"]
    maxVehicle = income * 3
    maxPayment = income * 0.22
  }

  return {
    lenders,
    maxVehicle: Math.round(maxVehicle),
    maxPayment: Math.round(maxPayment),
  }
}
