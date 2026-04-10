import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// In-memory user storage (temporary - should be replaced with database)
let registeredUsers: any[] = []

// For development: load from environment if available
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
    if (registeredUsers.some((u: any) => u.email === email)) {
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

    // Store user in memory
    registeredUsers.push(newUser)

    // Update environment variable (for persistence across restarts in dev)
    process.env.REGISTERED_USERS = JSON.stringify(registeredUsers)

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
