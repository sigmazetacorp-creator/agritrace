import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'QLF Group — Feeding Africa, Cultivating Prosperity',
  description: 'Quantum Agro Light Farms Ltd. Sustainable agriculture, commodity exports, and farm-to-fork traceability across Africa.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#181A20] min-h-screen text-gray-100">
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
