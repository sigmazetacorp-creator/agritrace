'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'farmer',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    }
    else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*)'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Account created! Redirecting to login...' })
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Sign up failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Sign up error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Join AgriTrace</h1>
          <p className="text-gray-400">Create your account to access the portal</p>
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
              <label className="block text-xs text-gray-400 mb-1.5">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
                }`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Account Type *</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full bg-[#181A20] border border-white/10 focus:border-[#F9D548]/50 rounded px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="cooperative">Cooperative</option>
                <option value="partner">Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  errors.password ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
                }`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              <p className="text-gray-500 text-xs mt-2">Min 8 chars, 1 uppercase, 1 special char (!@#$%^&*)</p>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  errors.confirmPassword ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="border-t border-white/10 my-6"></div>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Already have an account?
            </p>
            <Link href="/login" className="text-[#F9D548] hover:text-yellow-300 text-sm font-semibold transition-colors">
              Sign In →
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
