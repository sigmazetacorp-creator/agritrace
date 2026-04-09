'use client'

import { useState } from 'react'
import Image from 'next/image'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.subject) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus({ type: 'error', message: 'Failed to send message. Please try again.' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error sending message. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {status && (
        <div className={`p-3 rounded text-sm ${
          status.type === 'success'
            ? 'bg-green-900/30 border border-green-600 text-green-100'
            : 'bg-red-900/30 border border-red-600 text-red-100'
        }`}>
          {status.message}
        </div>
      )}

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
            errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
          }`}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@company.com"
          className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
            errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
          }`}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Subject *</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
            errors.subject ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
          }`}
        >
          <option value="">Select a topic</option>
          <option value="Export Inquiry">Export Inquiry</option>
          <option value="Partnership">Partnership</option>
          <option value="Farmer Registration">Farmer Registration</option>
          <option value="AgriTrace">AgriTrace</option>
          <option value="Other">Other</option>
        </select>
        {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us how we can help..."
          className={`w-full bg-[#181A20] border rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none resize-none transition-colors ${
            errors.message ? 'border-red-500/50' : 'border-white/10 focus:border-[#F9D548]/50'
          }`}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-96 flex items-center justify-center overflow-hidden pt-24">
        <Image
          src="/hero-contact.png"
          alt="Contact header"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#181A20]/50 via-[#181A20]/80 to-[#181A20]/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Reach out for export inquiries, partnership opportunities, or farmer cooperative registration.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <p className="text-[#F9D548] text-xs font-semibold tracking-widest uppercase mb-4">Contact Details</p>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <a href="mailto:aniekan@qlfgroup.ng" className="hover:text-[#F9D548] transition-colors">aniekan@qlfgroup.ng</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🌍</span>
                  <div>
                    <p className="text-white font-medium">Headquarters</p>
                    <p>Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-white font-medium">Operations</p>
                    <p>Nigeria · Africa</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[#F9D548] text-xs font-semibold tracking-widest uppercase mb-4">Export Commodities</p>
              <div className="flex flex-wrap gap-2">
                {['Sesame Seeds', 'Dried Ginger', 'Ginger Powder', 'Hibiscus', 'Rice'].map((c) => (
                  <span key={c} className="px-3 py-1 bg-[#1e2028] border border-white/10 rounded-full text-xs text-gray-300">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-[#1e2028] rounded-2xl border border-white/10 p-8">
            <p className="font-bold text-white text-lg mb-6">Send us a message</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
