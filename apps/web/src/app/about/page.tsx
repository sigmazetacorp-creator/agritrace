import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-4">Who We Are</p>
        <h1 className="text-5xl font-extrabold text-white mb-6">About QLF Group</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Quantum Agro Light Farms Ltd is a Nigerian agribusiness company combining modern technology
          with entrepreneurship to drive food security and prosperity across Africa.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#1e2028] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-[#F9D548] text-xs font-semibold tracking-widest uppercase mb-3">Our Mission</p>
            <h2 className="text-2xl font-bold text-white mb-4">Feeding Africa, Cultivating Prosperity</h2>
            <p className="text-gray-400 leading-relaxed">
              We exist to bridge the gap between smallholder farmers and global commodity markets —
              providing trade, technology, aggregation, and production so that African agriculture
              can compete on the world stage.
            </p>
          </div>
          <div>
            <p className="text-[#F9D548] text-xs font-semibold tracking-widest uppercase mb-3">Our Vision</p>
            <h2 className="text-2xl font-bold text-white mb-4">A Transparent, Prosperous Agricultural Africa</h2>
            <p className="text-gray-400 leading-relaxed">
              We envision a continent where every farmer has access to fair markets, every buyer can verify
              the provenance of what they purchase, and technology closes the gap between field and fork.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-3">What Drives Us</p>
          <h2 className="text-3xl font-extrabold text-white">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🔍', title: 'Transparency', desc: 'Every harvest, every shipment — recorded on the blockchain and verifiable by anyone.' },
            { icon: '🤝', title: 'Partnership', desc: 'We grow with our farmers, cooperatives, and buyers — success is shared.' },
            { icon: '🌍', title: 'Sustainability', desc: 'Farming practices that preserve the land for the next generation.' },
            { icon: '⚡', title: 'Innovation', desc: 'IoT sensors, USSD registration, blockchain records — technology at every step.' },
            { icon: '📈', title: 'Impact', desc: 'Measurable outcomes for farmers: better prices, better records, better lives.' },
            { icon: '🛡️', title: 'Integrity', desc: 'We do what we say. Our data is accurate, our commitments are kept.' },
          ].map((v) => (
            <div key={v.title} className="bg-[#1e2028] rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-white mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-3">Leadership</p>
          <h2 className="text-4xl font-extrabold text-white mb-4">Meet Our Executives</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Guided by visionary leadership committed to transforming agriculture across Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {[
            {
              name: 'Aniekan Anthony Nyong',
              role: 'Chief Executive Officer',
              bio: 'Visionary leader driving Quantum Agro Light Farms\' mission to revolutionize African agriculture through technology and innovation.',
              image: '/Aniekan.png',
            },
            {
              name: 'Zakariyya Jibril',
              role: 'Chief Operating Officer',
              bio: 'Operations expert ensuring seamless execution of our farm-to-market supply chain and blockchain infrastructure.',
              image: '/Zakariayya.png',
            },
          ].map((exec, i) => (
            <div key={exec.name} className="group">
              <div className="relative mb-8 overflow-hidden rounded-xl border border-white/10 group-hover:border-[#F9D548]/40 transition-all duration-300">
                <div className="relative w-full aspect-square bg-gradient-to-br from-[#1e2028] to-[#181A20]">
                  <Image
                    src={exec.image}
                    alt={exec.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#F9D548] transition-colors">
                {exec.name}
              </h3>
              <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-3">
                {exec.role}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {exec.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
