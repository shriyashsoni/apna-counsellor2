import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { convexAuthToken } = await convexAuthNextjsToken();
  if (convexAuthToken === null) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return new NextResponse(convexAuthToken);
}
