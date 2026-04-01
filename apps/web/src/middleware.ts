import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedPaths = ['/agritrace']

  const pathname = request.nextUrl.pathname

  // Check if current path is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtected) {
    // Check for session cookie
    const sessionCookie = request.cookies.get('agritrace-session')

    if (!sessionCookie) {
      // Redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: ['/agritrace/:path*'],
}
