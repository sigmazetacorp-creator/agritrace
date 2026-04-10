'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!credentials.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!credentials.password) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        router.push('/agritrace')
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Login failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Login error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">AgriTrace Portal</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="bg-[#1e2028] rounded-2xl border border-white/10 p-8">
          {message && (
            <div className={`p-3 rounded text-sm mb-4 ${
              message.type === 'error'
                ? 'bg-red-900/30 border border-red-600 text-red-100'
                : 'bg-green-900/30 border border-green-600 text-green-100'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email Address *</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Password *</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  errors.password ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
                }`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="border-t border-white/10 my-6"></div>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Don't have an account?
            </p>
            <Link href="/signup" className="text-[#F9D548] hover:text-yellow-300 text-sm font-semibold transition-colors">
              Create Account →
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          <Link href="/" className="hover:text-gray-400 transition-colors">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
