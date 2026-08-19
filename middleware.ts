import { NextRequest, NextResponse } from "next/server";

export function middleware(
  request: NextRequest,
) {
  const { pathname } =
    request.nextUrl;

  const accessToken =
    request.cookies.get(
      "accessToken",
    )?.value;

  const role =
    request.cookies.get("role")?.value;

  const isDashboard =
    pathname.startsWith("/dashboard");

  const isPayment =
    pathname.startsWith("/payment");

  if (
    (isDashboard || isPayment) &&
    !accessToken
  ) {
    const loginUrl = new URL(
      "/auth/login",
      request.url,
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(
      loginUrl,
    );
  }

  if (
    pathname.startsWith(
      "/dashboard/tenant",
    ) &&
    role !== "TENANT"
  ) {
    return NextResponse.redirect(
      new URL("/", request.url),
    );
  }

  if (
    pathname.startsWith(
      "/dashboard/landlord",
    ) &&
    role !== "LANDLORD"
  ) {
    return NextResponse.redirect(
      new URL("/", request.url),
    );
  }

  if (
    pathname.startsWith(
      "/dashboard/admin",
    ) &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL("/", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment/:path*",
  ],
};