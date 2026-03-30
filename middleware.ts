export { auth as middleware } from "@/auth";
export const config = { matcher: ["/dashboard/:path*","/underwriting/:path*","/dealer/:path*","/applications/:path*","/funding/:path*","/portfolio/:path*","/early-warning/:path*","/executive/:path*","/audit/:path*","/settings/:path*","/exception-queue/:path*","/collections/:path*","/admin/:path*"] };
