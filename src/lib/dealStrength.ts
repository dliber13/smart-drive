export function calculateDealStrength(app: any) {
  let score = 0

  if (app.creditScore >= 700) score += 30
  else if (app.creditScore >= 600) score += 20
  else score += 10

  if (app.monthlyIncome >= 5000) score += 25
  else if (app.monthlyIncome >= 3000) score += 15
  else score += 5

  if (app.ltv <= 80) score += 25
  else if (app.ltv <= 100) score += 15
  else score += 5

  if (app.employmentMonths >= 24) score += 20
  else if (app.employmentMonths >= 12) score += 10
  else score += 5

  return {
    score,
    tier:
      score >= 80 ? "A" :
      score >= 60 ? "B" :
      score >= 40 ? "C" : "D",
  }
}
