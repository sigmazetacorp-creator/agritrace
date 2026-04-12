import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, getResetTime } from '@/lib/rateLimiter'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

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

    // Log contact form submission
    console.log('Contact form submission:', { name, email, subject, message, timestamp: new Date().toISOString() })

    // Send email if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      try {
        await sgMail.send({
          to: process.env.SENDGRID_TO_EMAIL || 'aniekan@qlfgroup.ng',
          from: process.env.SENDGRID_FROM_EMAIL,
          replyTo: email,
          subject: `Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <h3>Message:</h3>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toISOString()}</small></p>
          `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Submitted at: ${new Date().toISOString()}
          `
        })
        console.log('Email sent successfully to:', process.env.SENDGRID_TO_EMAIL || 'aniekan@qlfgroup.ng')
      } catch (emailError) {
        console.error('SendGrid error:', emailError)
        // Don't fail the request if email fails - still return success to user
        // but log the error for debugging
      }
    }

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

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m: string) => map[m])
}
