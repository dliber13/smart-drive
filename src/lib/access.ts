export type AppRole = "ADMIN" | "CONTROLLER" | "SALES";

export function getCurrentUserRole(_request?: Request): AppRole {
  return "ADMIN";
}

export function requireAdmin(_request?: Request) {
  return true;
}

export function requireController(_request?: Request) {
  return true;
}

export function canPullCredit(role: AppRole) {
  return role === "ADMIN" || role === "CONTROLLER";
}