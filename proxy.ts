import {
  NextRequest,
  NextResponse,
} from "next/server";

export function proxy(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;

  const accessToken =
    request.cookies.get("accessToken")?.value;

  const role =
    request.cookies.get("role")?.value;

  const isDashboard =
    pathname.startsWith("/dashboard");

  const isPayment =
    pathname.startsWith("/payment");

  // Not authenticated
  if (
    (isDashboard || isPayment) &&
    !accessToken
  ) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url),
    );
  }

  // Tenant
  if (
    pathname.startsWith("/dashboard/tenant") &&
    role !== "TENANT"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  // Landlord
  if (
    pathname.startsWith(
      "/dashboard/landlord",
    ) &&
    role !== "LANDLORD"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  // Admin
  if (
    pathname.startsWith("/dashboard/admin") &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
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