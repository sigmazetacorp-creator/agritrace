'use client'

import Link from 'next/link'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const allPosts = getAllBlogPosts()
  const currentIndex = allPosts.findIndex(p => p.slug === params.slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  return (
    <div>
      {/* Article Header */}
      <section className="bg-gradient-to-br from-[#181A20] via-[#1e2410] to-[#181A20] border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link href="/blog" className="text-[#F9D548] text-sm font-semibold hover:underline mb-6 inline-block">
            ← Back to Blog
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#F9D548] bg-[#F9D548]/10 px-3 py-1 rounded">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-gray-400 mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>By</span>
            <span className="text-white font-semibold">{post.author}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-invert max-w-none [&>p]:text-gray-300 [&>p]:leading-relaxed [&>p]:mb-6">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <div key={idx}>
              {paragraph.startsWith('-') ? (
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                  {paragraph.split('\n').map((item, itemIdx) => (
                    <li key={itemIdx} className="text-gray-300">
                      {item.replace(/^- /, '')}
                    </li>
                  ))}
                </ul>
              ) : paragraph.includes('**') ? (
                <p className="text-gray-300 leading-relaxed mb-6">
                  {paragraph.split('**').map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-white font-semibold">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              ) : (
                <p className="text-gray-300 leading-relaxed mb-6">{paragraph}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      {(prevPost || nextPost) && (
        <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group bg-[#1e2028] rounded-lg p-6 border border-white/10 hover:border-[#F9D548]/40 transition-all"
              >
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">← Previous Post</p>
                <h3 className="text-lg font-bold text-white group-hover:text-[#F9D548] transition-colors">
                  {prevPost.title}
                </h3>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group bg-[#1e2028] rounded-lg p-6 border border-white/10 hover:border-[#F9D548]/40 transition-all md:text-right"
              >
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Next Post →</p>
                <h3 className="text-lg font-bold text-white group-hover:text-[#F9D548] transition-colors">
                  {nextPost.title}
                </h3>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}

      {/* Related Posts */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-white mb-10">More Articles</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allPosts
            .filter(p => p.slug !== post.slug)
            .slice(0, 3)
            .map((relatedPost) => (
              <article
                key={relatedPost.id}
                className="bg-[#1e2028] rounded-lg overflow-hidden border border-white/10 hover:border-[#F9D548]/40 transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#F9D548] bg-[#F9D548]/10 px-3 py-1 rounded">
                      {relatedPost.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>

                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="text-[#F9D548] text-sm font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  )
}
