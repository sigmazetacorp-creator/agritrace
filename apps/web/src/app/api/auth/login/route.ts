import { NextRequest, NextResponse } from 'next/server'

// Mock user data - in production, query database
const VALID_USERS = [
  { email: 'aniekan@qlfgroup.ng', password: 'setMeSecure123!', role: 'admin', name: 'Aniekan Anthony Nyong' },
  { email: 'zakariyya@qlfgroup.ng', password: 'setMeSecure456!', role: 'admin', name: 'Zakariyya Jibril' },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Find user
    const user = VALID_USERS.find(u => u.email === email && u.password === password)

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
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
