import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import bcrypt from 'bcryptjs'

// Mock admin user data (with hashed passwords)
const ADMIN_USERS = [
  { email: 'aniekan@qlfgroup.ng', password: 'setMeSecure123!', role: 'admin', name: 'Aniekan Anthony Nyong' },
  { email: 'zakariyya@qlfgroup.ng', password: 'setMeSecure456!', role: 'admin', name: 'Zakariyya Jibril' },
]

// Path to users storage file
const USERS_FILE = path.join(process.cwd(), 'apps', 'web', '.data', 'users.json')

// Get registered users
function getRegisteredUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return []
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
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

    // Check admin users first (plaintext comparison for demo accounts)
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
