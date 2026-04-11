type ApplicationLike = {
  id?: string
  firstName?: string | null
  lastName?: string | null
  identityType?: string | null
  identityValue?: string | null
  issuingCountry?: string | null
  identityStatus?: string | null
  status?: string | null
}

export function validateApplicationForSubmission(application: ApplicationLike) {
  const reasons: string[] = []

  if (!application.firstName) {
    reasons.push("Missing first name")
  }

  if (!application.lastName) {
    reasons.push("Missing last name")
  }

  if (!application.identityType) {
    reasons.push("Missing identity type")
  }

  if (!application.identityValue) {
    reasons.push("Missing identity value")
  }

  if (!application.issuingCountry) {
    reasons.push("Missing issuing country")
  }

  if (application.identityStatus !== "VERIFIED") {
    reasons.push("Identity must be VERIFIED before submission")
  }

  return {
    isValid: reasons.length === 0,
    reasons,
  }
}

export function getNextSubmittedStatus() {
  return "SUBMITTED"
}
