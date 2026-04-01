'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        // Not authenticated
      }
    }

    checkSession()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    setOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#181A20]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Quantum Agro Light Farms" width={40} height={40} className="w-10 h-10" />
          <span className="font-oxanium font-bold text-sm text-white hidden sm:block">Quantum Agro Light Farms</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/about" className="text-gray-300 hover:text-[#F9D548] transition-colors">About</Link>
          <Link href="/services" className="text-gray-300 hover:text-[#F9D548] transition-colors">Services</Link>
          <Link href="/team" className="text-gray-300 hover:text-[#F9D548] transition-colors">Team</Link>
          <Link href="/blog" className="text-gray-300 hover:text-[#F9D548] transition-colors">Blog</Link>
          <Link href="/agritrace" className="text-gray-300 hover:text-[#F9D548] transition-colors">AgriTrace</Link>
          <Link href="/contact" className="text-gray-300 hover:text-[#F9D548] transition-colors">Contact</Link>
          <Link
            href="/agritrace/verify"
            className="px-4 py-2 bg-[#F9D548] text-[#181A20] rounded font-semibold hover:bg-yellow-300 transition-colors text-xs"
          >
            Verify Harvest
          </Link>
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <span className="text-xs text-gray-400">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs border border-gray-400 text-gray-400 rounded hover:border-red-500 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-[#F9D548] rounded font-semibold hover:text-yellow-300 transition-colors text-xs border border-[#F9D548] hover:border-yellow-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1e2028] border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/about" className="text-gray-300 hover:text-[#F9D548]" onClick={() => setOpen(false)}>About</Link>
          <Link href="/services" className="text-gray-300 hover:text-[#F9D548]" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/team" className="text-gray-300 hover:text-[#F9D548]" onClick={() => setOpen(false)}>Team</Link>
          <Link href="/blog" className="text-gray-300 hover:text-[#F9D548]" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/agritrace" className="text-gray-300 hover:text-[#F9D548]" onClick={() => setOpen(false)}>AgriTrace</Link>
          <Link href="/contact" className="text-gray-300 hover:text-[#F9D548]" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/agritrace/verify" className="text-[#F9D548] font-semibold" onClick={() => setOpen(false)}>Verify Harvest</Link>
          {user ? (
            <>
              <div className="border-t border-white/10 py-2 text-gray-400 text-xs">
                Signed in as: {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500/10 transition-colors text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-[#F9D548] font-semibold" onClick={() => setOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}
