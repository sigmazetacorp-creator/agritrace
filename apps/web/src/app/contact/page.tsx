'use client'

export default function ContactPage() {
  return (
    <div className="pt-24">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-[#F9D548] text-sm font-semibold tracking-widest uppercase mb-4">Get In Touch</p>
          <h1 className="text-5xl font-extrabold text-white mb-6">Contact QLF Group</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Reach out for export inquiries, partnership opportunities, or farmer cooperative registration.
          </p>
        </div>

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
                    <p>Nigeria · Kenya · East Africa</p>
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
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-[#181A20] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#F9D548]/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full bg-[#181A20] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#F9D548]/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Subject</label>
                <select className="w-full bg-[#181A20] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F9D548]/50">
                  <option value="">Select a topic</option>
                  <option>Export Inquiry</option>
                  <option>Partnership</option>
                  <option>Farmer Registration</option>
                  <option>AgriTrace</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us how we can help..."
                  className="w-full bg-[#181A20] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#F9D548]/50 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
