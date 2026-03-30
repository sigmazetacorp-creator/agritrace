'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#181A20]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-['Oxanium'] font-bold text-xl text-[#F9D548]">QLF</span>
          <span className="font-['Oxanium'] text-sm text-gray-400 hidden sm:block">Group</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/about" className="text-gray-300 hover:text-[#F9D548] transition-colors">About</Link>
          <Link href="/services" className="text-gray-300 hover:text-[#F9D548] transition-colors">Services</Link>
          <Link href="/agritrace" className="text-gray-300 hover:text-[#F9D548] transition-colors">AgriTrace</Link>
          <Link href="/contact" className="text-gray-300 hover:text-[#F9D548] transition-colors">Contact</Link>
          <Link
            href="/agritrace/verify"
            className="px-4 py-2 bg-[#F9D548] text-[#181A20] rounded font-semibold hover:bg-yellow-300 transition-colors text-xs"
          >
            Verify Harvest
          </Link>
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
          <Link href="/agritrace" className="text-gray-300 hover:text-[#F9D548]" onClick={() => setOpen(false)}>AgriTrace</Link>
          <Link href="/contact" className="text-gray-300 hover:text-[#F9D548]" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/agritrace/verify" className="text-[#F9D548] font-semibold" onClick={() => setOpen(false)}>Verify Harvest</Link>
        </div>
      )}
    </nav>
  )
}
