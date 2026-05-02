import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)", "/settings(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  try {
    // The middleware handles /api/auth automatically by proxying to Convex
    
    if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/login");
    }
  } catch (error) {
    console.error("Middleware authentication check failed:", error);
    // Fallback: allow request to proceed if auth check fails to avoid blocking the whole site
    return;
  }
});


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
