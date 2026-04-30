import { NextRequest } from "next/server";

export async function GET(req: NextRequest, ctx: any) {
  const { convexAuthNextjsAction } = await import("@convex-dev/auth/nextjs/server");
  const { GET: handler } = convexAuthNextjsAction();
  return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  const { convexAuthNextjsAction } = await import("@convex-dev/auth/nextjs/server");
  const { POST: handler } = convexAuthNextjsAction();
  return handler(req, ctx);
}

export const dynamic = "force-dynamic";



