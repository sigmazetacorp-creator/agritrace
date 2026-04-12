import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, getResetTime } from '@/lib/rateLimiter'

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'
  return ip
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    const rateLimitKey = `contact:${clientIp}`

    // Check rate limit: 3 requests per hour (prevent spam)
    if (isRateLimited(rateLimitKey, { maxRequests: 3, windowMs: 60 * 60000 })) {
      const resetTime = getResetTime(rateLimitKey, { maxRequests: 3, windowMs: 60 * 60000 })

      return NextResponse.json(
        { error: 'Too many contact form submissions. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(resetTime / 1000).toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + resetTime).toISOString(),
          }
        }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // For now, log to console (in production, integrate with SendGrid, Mailgun, or similar)
    console.log('Contact form submission:', { name, email, subject, message })

    // TODO: Integrate with email service
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: 'aniekan@qlfgroup.ng',
    //   from: email,
    //   replyTo: email,
    //   subject: `Contact Form: ${subject}`,
    //   text: `${message}\n\nFrom: ${name} (${email})`,
    // });

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
