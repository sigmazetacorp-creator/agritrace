import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#13151a] border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <p className="font-['Oxanium'] font-bold text-2xl text-[#F9D548] mb-3">QLF Group</p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Quantum Agro Light Farms Ltd — feeding Africa through sustainable agriculture,
            technology-enabled farming, and transparent supply chains.
          </p>
          <div className="flex gap-4 mt-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#F9D548] transition-colors text-sm">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#F9D548] transition-colors text-sm">LinkedIn</a>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Company</p>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link href="/about" className="hover:text-[#F9D548] transition-colors">About Us</Link>
            <Link href="/services" className="hover:text-[#F9D548] transition-colors">Services</Link>
            <Link href="/contact" className="hover:text-[#F9D548] transition-colors">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">AgriTrace</p>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link href="/agritrace" className="hover:text-[#F9D548] transition-colors">Dashboard</Link>
            <Link href="/agritrace/farmers" className="hover:text-[#F9D548] transition-colors">Farmers</Link>
            <Link href="/agritrace/harvests" className="hover:text-[#F9D548] transition-colors">Harvests</Link>
            <Link href="/agritrace/verify" className="hover:text-[#F9D548] transition-colors">Verify Harvest</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Quantum Agro Light Farms Ltd. All rights reserved.</p>
        <p className="text-gray-600 text-xs">Nigeria · Kenya · East Africa</p>
      </div>
    </footer>
  )
}
