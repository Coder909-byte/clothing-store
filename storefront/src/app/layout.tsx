import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Don't Tell Mama — Quiet Luxury",
    template: "%s | Don't Tell Mama",
  },
  description:
    "Don't Tell Mama is a curated slow-fashion label for women who know exactly who they are. Timeless pieces, intentionally made.",
  keywords: ["slow fashion", "women's clothing", "luxury", "India", "sustainable"],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: "Don't Tell Mama",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-ivory font-sans text-stone-800 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
