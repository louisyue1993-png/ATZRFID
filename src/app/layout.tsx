import type { Metadata } from 'next';
import ContactButtonsWrapper from '@/components/ContactButtonsWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ATZ RFID | RFID Cards, Tags & Wristbands Manufacturer',
    template: '%s | ATZ RFID',
  },
  description:
    'Leading RFID manufacturer offering premium RFID cards, tags, wristbands and accessories. ISO 9001 certified quality with competitive wholesale pricing and global shipping.',
  keywords: [
    'RFID',
    'RFID cards',
    'RFID tags',
    'RFID wristbands',
    'RFID labels',
    'RFID inlay',
    'RFID reader',
    'RFID solutions',
    'RFID supplier',
    'RFID manufacturer',
    'NFC tags',
    'RFID access control',
    'RFID inventory management',
    'wholesale RFID',
    'bulk RFID',
    'ATZ RFID',
  ],
  authors: [{ name: 'ATZ RFID Team', url: 'https://www.atzrfid.com' }],
  creator: 'ATZ RFID',
  publisher: 'ATZ RFID',
  generator: 'Next.js',
  metadataBase: new URL('https://www.atzrfid.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ATZ RFID | Your Trusted RFID Products Manufacturer',
    description:
      'Premium RFID cards, tags, wristbands and accessories. ISO 9001 certified quality with competitive wholesale pricing and global shipping.',
    url: 'https://www.atzrfid.com',
    siteName: 'ATZ RFID',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 300,
        height: 80,
        alt: 'ATZ RFID Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATZ RFID | Your Trusted RFID Products Manufacturer',
    description:
      'Premium RFID cards, tags, wristbands and accessories. ISO 9001 certified quality with competitive wholesale pricing and global shipping.',
    images: ['/logo.svg'],
    creator: '@ATZRFID',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'Business',
  classification: 'Manufacturing',
  other: {
    'format-detection': 'telephone=no',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <ContactButtonsWrapper />
      </body>
    </html>
  );
}
