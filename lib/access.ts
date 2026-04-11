export type AppRole = "ADMIN" | "CONTROLLER" | "SALES"

export function normalizeRole(value: string | null | undefined): AppRole {
  if (value === "ADMIN") return "ADMIN"
  if (value === "CONTROLLER") return "CONTROLLER"
  return "SALES"
}

/**
 * Temporary role source for testing.
 * For now, the role comes from request header: x-user-role
 * If no header is sent, it defaults to SALES.
 *
 * Later, we will replace this with real session/auth lookup.
 */
export function getCurrentUserRole(request: Request): AppRole {
  const headerRole = request.headers.get("x-user-role")
  return normalizeRole(headerRole)
}

export function canPullCredit(role: AppRole): boolean {
  return role === "ADMIN" || role === "CONTROLLER"
}

export function canSubmitDeal(role: AppRole): boolean {
  return role === "ADMIN" || role === "CONTROLLER" || role === "SALES"
}
