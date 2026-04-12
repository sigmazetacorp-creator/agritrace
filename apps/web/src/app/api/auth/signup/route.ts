import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getRegisteredUsers, userExists, addUser } from '@/lib/userStore'
import { isRateLimited, getRemainingRequests, getResetTime } from '@/lib/rateLimiter'

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'
  return ip
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    const rateLimitKey = `signup:${clientIp}`

    // Check rate limit: 5 requests per 15 minutes
    if (isRateLimited(rateLimitKey, { maxRequests: 5, windowMs: 15 * 60000 })) {
      const remaining = getRemainingRequests(rateLimitKey)
      const resetTime = getResetTime(rateLimitKey, { maxRequests: 5, windowMs: 15 * 60000 })

      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(resetTime / 1000).toString(),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(Date.now() + resetTime).toISOString(),
          }
        }
      )
    }

    const body = await request.json()
    const { name, email, password, userType } = body

    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      )
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character' },
        { status: 400 }
      )
    }

    // Check if email already exists
    if (userExists(email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword, // Store hashed password
      userType,
      createdAt: new Date().toISOString(),
    }

    // Store user
    addUser(newUser)

    return NextResponse.json(
      { success: true, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Sign up failed. Please try again.' },
      { status: 500 }
    )
  }
}
