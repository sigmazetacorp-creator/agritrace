import Link from 'next/link'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function AgriTraceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="pt-16">
        {/* Portal sub-nav */}
        <div className="bg-[#1e2028] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-6 text-sm">
            <span className="text-[#F9D548] font-semibold font-['Oxanium']">AgriTrace</span>
            <span className="text-white/20">|</span>
            <Link href="/agritrace" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/agritrace/farmers" className="text-gray-400 hover:text-white transition-colors">Farmers</Link>
            <Link href="/agritrace/harvests" className="text-gray-400 hover:text-white transition-colors">Harvests</Link>
            <Link href="/agritrace/verify" className="text-gray-400 hover:text-[#F9D548] transition-colors ml-auto">Verify QR</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  )
}
