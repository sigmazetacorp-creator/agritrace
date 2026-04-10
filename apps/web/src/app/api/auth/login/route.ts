import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Mock admin user data
const ADMIN_USERS = [
  { email: 'aniekan@qlfgroup.ng', password: 'setMeSecure123!', role: 'admin', name: 'Aniekan Anthony Nyong' },
  { email: 'zakariyya@qlfgroup.ng', password: 'setMeSecure456!', role: 'admin', name: 'Zakariyya Jibril' },
]

// In-memory user storage (synchronizes with signup)
let registeredUsers: any[] = []

// Load from environment if available
if (process.env.REGISTERED_USERS) {
  try {
    registeredUsers = JSON.parse(process.env.REGISTERED_USERS)
  } catch (e) {
    registeredUsers = []
  }
}

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
