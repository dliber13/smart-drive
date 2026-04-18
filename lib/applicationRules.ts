type ApplicationForSubmission = {
  firstName?: string | null;
  lastName?: string | null;
  identityType?: string | null;
  identityValue?: string | null;
  issuingCountry?: string | null;
  identityStatus?: string | null;
  status?: string | null;
};

type SubmissionValidationResult = {
  isValid: boolean;
  reasons: string[];
};

function hasValue(value: string | null | undefined) {
  return Boolean(String(value ?? "").trim());
}

export function validateApplicationForSubmission(
  application: ApplicationForSubmission | null | undefined
): SubmissionValidationResult {
  const reasons: string[] = [];

  if (!application) {
    return {
      isValid: false,
      reasons: ["Application record was not found."],
    };
  }

  if (!hasValue(application.firstName)) {
    reasons.push("First name is required.");
  }

  if (!hasValue(application.lastName)) {
    reasons.push("Last name is required.");
  }

  if (!hasValue(application.identityType)) {
    reasons.push("Identity type is required.");
  }

  if (!hasValue(application.identityValue)) {
    reasons.push("Identity value is required.");
  }

  if (!hasValue(application.issuingCountry)) {
    reasons.push("Issuing country is required.");
  }

  const identityStatus = String(application.identityStatus ?? "")
    .trim()
    .toUpperCase();

  if (identityStatus !== "VERIFIED") {
    reasons.push("Identity must be VERIFIED before submission.");
  }

  const currentStatus = String(application.status ?? "")
    .trim()
    .toUpperCase();

  if (currentStatus && currentStatus !== "DRAFT") {
    reasons.push(`Only DRAFT applications can be submitted. Current status: ${currentStatus}.`);
  }

  return {
    isValid: reasons.length === 0,
    reasons,
  };
}

export function getNextSubmittedStatus() {
  return "SUBMITTED";
}
