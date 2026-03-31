import Link from 'next/link'
import Image from 'next/image'

const executives = [
  {
    name: 'Aniekan Anthony Nyong',
    role: 'Chief Executive Officer',
    bio: 'Visionary leader driving Quantum Agro Light Farms\' mission to revolutionize African agriculture through technology and innovation.',
    image: '/aniekan.jpg',
    socials: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Zakariyya Jibril',
    role: 'Chief Operating Officer',
    bio: 'Operations expert ensuring seamless execution of our farm-to-market supply chain and blockchain infrastructure.',
    image: '/zakariyya.jpg',
    socials: {
      linkedin: '#',
      twitter: '#',
    },
  },
]

const teamMembers = [
  {
    name: 'Chioma Okafor',
    role: 'CTO',
    bio: 'Full-stack engineer leading blockchain & IoT integration for farm-to-fork traceability systems.',
    image: '💻',
    specialty: 'Technology',
  },
  {
    name: 'Kwame Mensah',
    role: 'Operations Director',
    bio: 'Former supply chain manager optimizing commodity aggregation and export logistics.',
    image: '📦',
    specialty: 'Operations',
  },
  {
    name: 'Amara Diallo',
    role: 'Head of Partnerships',
    bio: 'International trade specialist connecting African farmers to premium global markets.',
    image: '🤝',
    specialty: 'Partnerships',
  },
  {
    name: 'Samuel Kipchoge',
    role: 'Head of Farmer Relations',
    bio: 'Community leader ensuring farmer success through training, support, and fair pricing.',
    image: '🌾',
    specialty: 'Community',
  },
  {
    name: 'Grace Okonkwo',
    role: 'Product Lead',
    bio: 'Product strategist designing farmer-first solutions for USSD, mobile, and web platforms.',
    image: '🎯',
    specialty: 'Product',
  },
]

export const metadata = {
  title: 'Our Team | Quantum Agro Light Farms',
  description: 'Meet the innovators and leaders driving sustainable agriculture and farm-to-fork traceability across Africa.',
}

export default function TeamPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#181A20] via-[#1e2410] to-[#181A20]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,213,72,0.08)_0%,_transparent_60%)]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-4 animate-fadeInUp">
            Our Leadership
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animation-delay-100">
            Meet <span className="text-[#F9D548]">Our Team</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
            Experienced leaders in agriculture, technology, and international trade working together to revolutionize farm-to-fork traceability and empower African farmers.
          </p>
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-b border-white/10">
        <div className="text-center mb-16">
          <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-3 animate-fadeInUp">
            Executive Leadership
          </p>
          <h2 className="text-4xl font-extrabold text-white animate-fadeInUp animation-delay-100">
            Senior Management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {executives.map((exec, i) => (
            <div
              key={exec.name}
              className="group animate-fadeInUp"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Image Container */}
              <div className="relative mb-8 overflow-hidden rounded-xl border border-white/10 group-hover:border-[#F9D548]/40 transition-all duration-300 shadow-2xl">
                <div className="relative w-full aspect-square bg-gradient-to-br from-[#1e2028] to-[#181A20]">
                  <Image
                    src={exec.image}
                    alt={exec.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181A20] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                    <a
                      href={exec.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-[#F9D548] text-[#181A20] flex items-center justify-center hover:bg-yellow-300 transition-colors"
                      aria-label={`${exec.name} LinkedIn`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href={exec.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-[#F9D548] text-[#181A20] flex items-center justify-center hover:bg-yellow-300 transition-colors"
                      aria-label={`${exec.name} Twitter`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-1 9-5.64a4.47 4.47 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#F9D548] transition-colors">
                  {exec.name}
                </h3>
                <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-4">
                  {exec.role}
                </p>
                <p className="text-gray-400 leading-relaxed">
                  {exec.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Extended Leadership Team */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-3 animate-fadeInUp">
            Our Team
          </p>
          <h2 className="text-4xl font-extrabold text-white animate-fadeInUp animation-delay-100">
            Extended Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <div
              key={member.name}
              className="group relative animate-fadeInUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Card background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F9D548]/5 via-transparent to-[#1e2028] rounded-2xl border border-white/10 group-hover:border-[#F9D548]/60 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#F9D548]/20" />

              {/* Card content */}
              <div className="relative p-8 md:p-10 h-full flex flex-col">
                {/* Avatar */}
                <div className="text-6xl md:text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {member.image}
                </div>

                {/* Name & Role */}
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#F9D548] transition-colors">
                  {member.name}
                </h3>
                <p className="text-[#F9D548] font-semibold text-sm mb-4 uppercase tracking-wide">
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {member.bio}
                </p>

                {/* Specialty Badge */}
                <div className="inline-block">
                  <span className="px-4 py-2 bg-[#F9D548]/10 border border-[#F9D548]/30 text-[#F9D548] text-xs font-semibold rounded-lg group-hover:bg-[#F9D548] group-hover:text-[#181A20] transition-colors duration-300">
                    {member.specialty}
                  </span>
                </div>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F9D548] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Culture Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4 animate-fadeInUp">Our Culture & Values</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fadeInUp animation-delay-100">
            We're united by a mission to empower African farmers and transform agriculture through innovation, integrity, and measurable impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🌍',
              title: 'Global Impact',
              desc: 'Connecting African farmers to premium international markets while maintaining fair, sustainable practices.',
            },
            {
              icon: '🌱',
              title: 'Farmer First',
              desc: 'Every decision prioritizes farmer success, fair compensation, technology access, and long-term partnership.',
            },
            {
              icon: '🔗',
              title: 'Transparency & Trust',
              desc: 'Blockchain-backed traceability ensures every transaction, harvest, and step is verifiable and immutable.',
            },
          ].map((value, i) => (
            <div
              key={value.title}
              className="bg-gradient-to-br from-[#1e2028] to-[#181A20] rounded-xl p-8 border border-white/10 hover:border-[#F9D548]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#F9D548]/10 hover:shadow-xl hover:-translate-y-1 animate-fadeInUp group cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{value.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#F9D548] transition-colors">{value.title}</h3>
              <p className="text-gray-400 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24 text-center">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-4 animate-fadeInUp">Ready to Join Our Mission?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto animate-fadeInUp animation-delay-100">
            We're hiring passionate innovators, engineers, and operators to scale agricultural impact across Africa. Let's build the future of farming together.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-200">
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-all hover:shadow-lg hover:shadow-[#F9D548]/20 transform hover:scale-105"
          >
            Get In Touch
          </Link>
          <a
            href="mailto:careers@qlf.com"
            className="px-8 py-3.5 border border-white/20 text-white rounded font-semibold hover:border-[#F9D548] hover:text-[#F9D548] transition-colors hover:shadow-lg hover:shadow-[#F9D548]/10"
          >
            View Opportunities
          </a>
        </div>
      </section>
    </div>
  )
}
