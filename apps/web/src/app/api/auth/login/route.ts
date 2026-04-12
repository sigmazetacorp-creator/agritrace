import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getRegisteredUsers } from '@/lib/userStore'
import { isRateLimited, getRemainingRequests, getResetTime } from '@/lib/rateLimiter'

// Mock admin user data
const ADMIN_USERS = [
  { email: 'aniekan@qlfgroup.ng', password: 'setMeSecure123!', role: 'admin', name: 'Aniekan Anthony Nyong' },
  { email: 'zakariyya@qlfgroup.ng', password: 'setMeSecure456!', role: 'admin', name: 'Zakariyya Jibril' },
]

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'
  return ip
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    const clientIp = getClientIp(request)

    // Rate limit by IP: 8 requests per 15 minutes
    const ipRateLimitKey = `login:ip:${clientIp}`
    if (isRateLimited(ipRateLimitKey, { maxRequests: 8, windowMs: 15 * 60000 })) {
      const resetTime = getResetTime(ipRateLimitKey, { maxRequests: 8, windowMs: 15 * 60000 })

      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(resetTime / 1000).toString(),
            'X-RateLimit-Limit': '8',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + resetTime).toISOString(),
          }
        }
      )
    }

    // Rate limit by email: 5 requests per 15 minutes (stricter for account enumeration)
    if (email) {
      const emailRateLimitKey = `login:email:${email}`
      if (isRateLimited(emailRateLimitKey, { maxRequests: 5, windowMs: 15 * 60000 })) {
        const resetTime = getResetTime(emailRateLimitKey, { maxRequests: 5, windowMs: 15 * 60000 })

        return NextResponse.json(
          { error: 'Too many login attempts for this email. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil(resetTime / 1000).toString(),
              'X-RateLimit-Limit': '5',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(Date.now() + resetTime).toISOString(),
            }
          }
        )
      }
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Check admin users first
    const adminUser = ADMIN_USERS.find(u => u.email === email && u.password === password)

    let user: any = null

    if (adminUser) {
      user = {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      }
    } else {
      // Check registered users (hashed password comparison)
      const registeredUsers = getRegisteredUsers()
      const registeredUserFound = registeredUsers.find((u: any) => u.email === email)

      if (registeredUserFound) {
        // Compare password with hash
        const passwordMatch = await bcrypt.compare(password, registeredUserFound.password)

        if (passwordMatch) {
          user = {
            email: registeredUserFound.email,
            name: registeredUserFound.name,
            role: 'user',
          }
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create response with session cookie
    const response = NextResponse.json(
      { success: true, user: { email: user.email, name: user.name, role: user.role } },
      { status: 200 }
    )

    // Set secure session cookie
    response.cookies.set('agritrace-session', JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      timestamp: Date.now(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
