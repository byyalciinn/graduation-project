import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/", "/api/auth", "/api/register"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated, handle role-based routing
  if (session?.user) {
    const userRole = session.user.role

    // Admin role - redirect to admin-dashboard
    if (userRole === "admin") {
      // If trying to access buyer or seller dashboard, redirect to admin
      if (pathname.startsWith("/buyer-dashboard") || pathname.startsWith("/seller-dashboard")) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url))
      }
    }

    // Buyer role - redirect to buyer-dashboard
    if (userRole === "buyer") {
      // If trying to access admin or seller dashboard, redirect to buyer
      if (pathname.startsWith("/admin-dashboard") || pathname.startsWith("/seller-dashboard")) {
        return NextResponse.redirect(new URL("/buyer-dashboard", request.url))
      }
    }

    // Seller role - redirect to seller-dashboard
    if (userRole === "seller") {
      // If trying to access admin or buyer dashboard, redirect to seller
      if (pathname.startsWith("/admin-dashboard") || pathname.startsWith("/buyer-dashboard")) {
        return NextResponse.redirect(new URL("/seller-dashboard", request.url))
      }
    }

    // If logged in and trying to access login page, redirect based on role
    if (pathname === "/login") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url))
      } else if (userRole === "buyer") {
        return NextResponse.redirect(new URL("/buyer-dashboard", request.url))
      } else if (userRole === "seller") {
        return NextResponse.redirect(new URL("/seller-dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
