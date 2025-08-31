import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect the signup route
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Read role from cookies (set after role selection)
  const role = req.cookies.get("role")?.value || null;

  if (url.pathname.startsWith("/auth/signup") && !role) {
    url.pathname = "/authrole";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signup"], // only runs for /signup
};
