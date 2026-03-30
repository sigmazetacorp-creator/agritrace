import type { Metadata } from 'next'
import { Oxanium, Mulish } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  weight: ['400', '600', '700', '800'],
})

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-mulish',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Quantum Agro Light Farms — Feeding Africa, Cultivating Prosperity',
  description: 'QLF Group. Sustainable agriculture, commodity exports, and farm-to-fork traceability across Africa.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oxanium.variable} ${mulish.variable}`}>
      <body className="bg-[#181A20] min-h-screen text-gray-100 font-mulish">
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
