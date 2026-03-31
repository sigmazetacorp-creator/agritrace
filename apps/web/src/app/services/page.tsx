export default function ServicesPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-4">What We Offer</p>
        <h1 className="text-5xl font-extrabold text-white mb-6">Our Services</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          From seed to shipment, QLF Group provides integrated agribusiness services across
          the entire agricultural value chain.
        </p>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 pb-20 space-y-8">
        {[
          {
            number: '01',
            icon: '🌱',
            title: 'Primary Production',
            desc: 'We operate and support IoT-enabled farms with precision agriculture techniques — drip irrigation, soil sensors, mechanized planting and harvesting — to maximise yield and reduce waste.',
            bullets: [
              'IoT soil and weather monitoring',
              'Drip irrigation systems',
              'Mechanised planting & harvesting',
              'Agronomic training and advisory',
            ],
          },
          {
            number: '02',
            icon: '🏪',
            title: 'Aggregation',
            desc: 'We source and aggregate commodities from a network of verified farmers across Nigeria and East Africa, ensuring consistent quality for domestic processors and international exporters.',
            bullets: [
              'Farmer network across 3 countries',
              'Quality grading & sorting',
              'Cold chain & storage management',
              'USSD-enabled farmer registration',
            ],
          },
          {
            number: '03',
            icon: '⚙️',
            title: 'Processing & Value Addition',
            desc: 'Raw commodities are processed into higher-value products — increasing margins for farmers and meeting the quality standards required by premium buyers.',
            bullets: [
              'Rice processing & milling',
              'Ginger powder production',
              'Packaging for retail & export',
              'Quality certification support',
            ],
          },
          {
            number: '04',
            icon: '🚢',
            title: 'Exports',
            desc: 'We connect African farmers to global commodity buyers — exporting sesame, dried ginger, hibiscus, and other high-value crops with full traceability documentation.',
            bullets: [
              'Sesame seeds (white & brown)',
              'Dried ginger & ginger powder',
              'Hibiscus (zobo) flowers',
              'Phytosanitary & export documentation',
            ],
          },
          {
            number: '05',
            icon: '🔗',
            title: 'AgriTrace — Blockchain-Powered Traceability',
            desc: 'Every harvest logged via USSD from feature phones. Every record hashed on Polygon blockchain. Buyers verify authenticity with a single QR scan. Complete farm-to-fork transparency and immutability.',
            bullets: [
              'USSD farmer registration',
              'Polygon blockchain recording',
              'QR code verification',
              'Immutable harvest records',
            ],
          },
        ].map((s) => (
          <div key={s.title} className="bg-[#1e2028] rounded-2xl border border-white/10 p-8 md:p-10 flex flex-col md:flex-row gap-8">
            <div className="shrink-0">
              <p className="font-['Oxanium'] text-5xl font-extrabold text-[#F9D548]/20">{s.number}</p>
              <div className="text-4xl mt-2">{s.icon}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3">{s.title}</h2>
              <p className="text-gray-400 leading-relaxed mb-5">{s.desc}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F9D548] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Services Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">Our Operations In Action</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From farm fields to global markets — see how we transform African agriculture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Farm Technology',
              desc: 'IoT sensors and precision agriculture',
              placeholder: '🌾',
            },
            {
              title: 'Quality Control',
              desc: 'Rigorous testing and grading',
              placeholder: '✓',
            },
            {
              title: 'Supply Chain',
              desc: 'Cold storage and logistics',
              placeholder: '📦',
            },
            {
              title: 'Global Exports',
              desc: 'Connected to world markets',
              placeholder: '🌍',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative h-64 rounded-2xl border border-white/10 overflow-hidden group hover:border-[#F9D548]/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e2028] to-[#181A20] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-4">{item.placeholder}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#F9D548]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-br from-[#F9D548]/10 to-[#1e2028] rounded-2xl border border-[#F9D548]/20 p-12">
          <h2 className="text-3xl font-extrabold text-white mb-4">Interested in working with us?</h2>
          <p className="text-gray-400 mb-8">Whether you are a buyer, a cooperative, or a farmer — we want to hear from you.</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3.5 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}
