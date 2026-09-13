import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Taj Traders Fsd | Paint Store in Faisalabad',
  description: 'Quality paints, colors and finishing solutions in Faisalabad. Visit Taj Traders for trusted products, expert guidance and local delivery.',
  keywords: ['paint store Faisalabad', 'paint dealers Faisalabad', 'Nippon Paint Faisalabad', 'wall paints', 'Taj Traders Fsd'],
  generator: 'v0.app',
  openGraph: {
    title: 'Taj Traders Fsd | Paint Store in Faisalabad',
    description: 'Bring your walls to life with trusted paints and local expertise.',
    type: 'website',
    locale: 'en_PK',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#102A43',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
