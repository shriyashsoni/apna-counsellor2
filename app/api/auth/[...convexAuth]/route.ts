import { auth } from "@/convex/auth";
import { createRouteHandler } from "@convex-dev/auth/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return createRouteHandler(auth).GET(request);
}

export async function POST(request: Request) {
  return createRouteHandler(auth).POST(request);
}
