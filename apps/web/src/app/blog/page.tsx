'use client'

import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog'

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-96 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#181A20] via-[#1e2410] to-[#181A20]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,213,72,0.08)_0%,_transparent_60%)]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Insights & Updates
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore the latest news, tips, and stories from QLF Group about sustainable agriculture, technology, and export opportunities.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[#1e2028] rounded-xl overflow-hidden border border-white/10 hover:border-[#F9D548]/40 transition-all hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#F9D548] bg-[#F9D548]/10 px-3 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 hover:text-[#F9D548] transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#F9D548] text-sm font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-br from-[#F9D548]/10 to-[#1e2028] rounded-2xl border border-[#F9D548]/20 p-12">
          <h2 className="text-3xl font-extrabold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Subscribe to get the latest insights about farming innovation, market opportunities, and AgriTrace updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-[#13151a] border border-white/10 rounded text-white placeholder-gray-600 focus:outline-none focus:border-[#F9D548]/40"
            />
            <button className="px-6 py-3 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
