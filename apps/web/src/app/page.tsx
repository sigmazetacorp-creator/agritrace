import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#181A20] via-[#1e2410] to-[#181A20]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,213,72,0.08)_0%,_transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp">
            Feeding Africa,<br />
            <span className="text-[#F9D548]">Cultivating Prosperity</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeInUp animation-delay-100">
            Quantum Agro Light Farms bridges Nigerian farmers to global markets through
            IoT-enabled farming, commodity aggregation, and blockchain-backed traceability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-200">
            <Link
              href="/services"
              className="px-8 py-3.5 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors hover:shadow-lg hover:shadow-[#F9D548]/20 transform hover:scale-105 transition-transform"
            >
              Our Services
            </Link>
            <Link
              href="/agritrace"
              className="px-8 py-3.5 border border-white/20 text-white rounded font-semibold hover:border-[#F9D548] hover:text-[#F9D548] transition-colors hover:shadow-lg hover:shadow-[#F9D548]/10 transform hover:scale-105 transition-transform"
            >
              AgriTrace Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1e2028] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '5,000+', label: 'Farmers Supported' },
            { value: '12', label: 'Commodity Types' },
            { value: '3', label: 'Countries Active' },
            { value: '100%', label: 'Blockchain Verified' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-[#F9D548]">{s.value}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services overview */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-3 animate-fadeInUp">What We Do</p>
          <h2 className="text-4xl font-extrabold text-white animate-fadeInUp animation-delay-100">Integrated Agribusiness</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🌱',
              title: 'Primary Production',
              desc: 'IoT-enabled farms with drip irrigation, mechanized operations, and agronomic best practices.',
            },
            {
              icon: '🏪',
              title: 'Aggregation',
              desc: 'Collecting quality commodities from qualified farms across Nigeria and East Africa for export.',
            },
            {
              icon: '⚙️',
              title: 'Processing',
              desc: 'Rice milling, ginger powder production, and value-added processing for premium markets.',
            },
            {
              icon: '🚢',
              title: 'Exports',
              desc: 'Sesame, dried ginger, hibiscus and more — connecting African farmers to global buyers.',
            },
          ].map((s, i) => (
            <div
              key={s.title}
              className="bg-gradient-to-br from-[#1e2028] to-[#181A20] rounded-xl p-6 border border-white/10 hover:border-[#F9D548]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#F9D548]/10 transform hover:-translate-y-1 hover:scale-105 animate-fadeInUp cursor-pointer group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-300">{s.icon}</div>
              <h3 className="font-bold text-white mb-2 group-hover:text-[#F9D548] transition-colors">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services" className="text-[#F9D548] text-sm font-semibold hover:underline hover:text-yellow-300 transition-colors">
            View all services →
          </Link>
        </div>
      </section>

      {/* AgriTrace CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#F9D548]/10 to-[#1e2028] border border-[#F9D548]/20 p-10 md:p-16">
          <Image
            src="/Pattern 1 - Global Connection Theme.png"
            alt="Pattern"
            fill
            className="absolute inset-0 object-cover opacity-20"
          />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9D548]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-3">Powered by Blockchain</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                AgriTrace — Farm to Fork<br />Traceability
              </h2>
              <p className="text-gray-400 max-w-lg leading-relaxed">
                Every harvest logged via USSD from any feature phone. Every record hashed on Polygon.
                Buyers verify authenticity with a single QR scan.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                href="/agritrace"
                className="px-8 py-3.5 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors text-center whitespace-nowrap"
              >
                Open Dashboard
              </Link>
              <Link
                href="/agritrace/verify"
                className="px-8 py-3.5 border border-[#F9D548]/40 text-[#F9D548] rounded font-semibold hover:border-[#F9D548] transition-colors text-center whitespace-nowrap"
              >
                Verify a Harvest
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">Ready to work with us?</h2>
        <p className="text-gray-400 mb-8">Get in touch to discuss exports, partnerships, or farm registration.</p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3.5 border border-white/20 text-white rounded font-semibold hover:border-[#F9D548] hover:text-[#F9D548] transition-colors"
        >
          Contact QLF Group
        </Link>
      </section>
    </div>
  )
}
