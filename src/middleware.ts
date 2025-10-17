import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  FORGOT_PASSWORD_PATH,
  RESET_PASSWORD_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
} from "@/lib/auth/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // routes that require a session
  const protectedRoutes: string[] = [];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
    }
  }

  // routes that are only allowed without a session
  const noSessionRoutes: string[] = [
    SIGN_IN_PATH,
    SIGN_UP_PATH,
    FORGOT_PASSWORD_PATH,
    RESET_PASSWORD_PATH,
  ];
  if (noSessionRoutes.some((route) => pathname.startsWith(route))) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
