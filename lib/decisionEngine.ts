type DecisionInput = {
  creditScore?: number | null
  monthlyIncome?: number | null
  amountFinanced?: number | null
}

type DecisionOutput = {
  tier: string
  score: number
  decision: "APPROVE" | "REVIEW" | "DECLINE"
}

export function runDecisionEngine(input: DecisionInput): DecisionOutput {
  const credit = input.creditScore ?? 0
  const income = input.monthlyIncome ?? 0
  const financed = input.amountFinanced ?? 0

  let tier = "D"
  if (credit >= 720) tier = "A"
  else if (credit >= 660) tier = "B"
  else if (credit >= 600) tier = "C"

  let score = 0

  score += Math.min(credit / 850, 1) * 50
  score += Math.min(income / 8000, 1) * 30

  const ratio = financed && income ? financed / income : 0
  if (ratio > 0 && ratio < 10) score += 20
  else if (ratio >= 10 && ratio < 15) score += 10
  else if (ratio >= 15) score += 5

  score = Math.round(score)

  let decision: "APPROVE" | "REVIEW" | "DECLINE" = "REVIEW"
  if (score >= 75) decision = "APPROVE"
  else if (score < 50) decision = "DECLINE"

  return {
    tier,
    score,
    decision,
  }
}
