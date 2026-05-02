import { auth } from "@/convex/auth";
import { createRouteHandler } from "@convex-dev/auth/nextjs/server";

export const { GET, POST } = createRouteHandler(auth);
