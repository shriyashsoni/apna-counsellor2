import { NextResponse } from "next/server";

export default async function middleware(req: any) {
  // Clerk is disabled for now to unblock local host
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
