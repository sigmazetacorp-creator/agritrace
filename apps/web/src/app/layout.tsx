import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'AgriTrace',
  description: 'Farm-to-fork traceability for African agriculture',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-green-50 min-h-screen">
        <Providers>
          <Nav />
          <main className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
