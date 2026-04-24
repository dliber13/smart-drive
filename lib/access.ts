export type AppRole = "ADMIN" | "CONTROLLER" | "SALES";

export function normalizeRole(value: string | null | undefined): AppRole {
  if (value === "ADMIN") return "ADMIN";
  if (value === "CONTROLLER") return "CONTROLLER";
  return "SALES";
}

/**
 * Local testing override:
 * always treat the current user as CONTROLLER.
 * Later we will swap this back to real auth/session logic.
 */
export function getCurrentUserRole(_request?: Request): AppRole {
  return "CONTROLLER";
}

export function canPullCredit(role: AppRole): boolean {
  return role === "ADMIN" || role === "CONTROLLER";
}

export function canSubmitDeal(role: AppRole): boolean {
  return role === "ADMIN" || role === "CONTROLLER" || role === "SALES";
}