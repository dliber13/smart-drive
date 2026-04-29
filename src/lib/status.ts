export type ApplicationStatus =
  | "DRAFT"
  | "READY"
  | "SUBMITTED"
  | "APPROVED"
  | "FUNDED"

export function getInitialStatus(): ApplicationStatus {
  return "DRAFT"
}

export function canMoveToReady(application: any): boolean {
  return (
    !!application.firstName &&
    !!application.lastName &&
    !!application.identityType &&
    !!application.identityValue &&
    !!application.issuingCountry
  )
}

export function getNextStatus(currentStatus: string): ApplicationStatus {
  switch (currentStatus) {
    case "DRAFT":
      return "READY"
    case "READY":
      return "SUBMITTED"
    case "SUBMITTED":
      return "APPROVED"
    case "APPROVED":
      return "FUNDED"
    default:
      return "DRAFT"
  }
}
