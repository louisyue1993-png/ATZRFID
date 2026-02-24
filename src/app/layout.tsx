import type { Metadata } from 'next';
import { headers } from 'next/headers';
import ContactButtonsWrapper from '@/components/ContactButtonsWrapper';
import {
  defaultLocale,
  getLocaleTexts,
  getRequestLocale,
  productKeywords,
  supportedLocales,
  withLocalePath,
} from '@/lib/i18n';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale((await headers()).get('x-locale'));
  const texts = getLocaleTexts(locale);
  const keywords = [
    'RFID',
    'RFID cards',
    'RFID tags',
    'RFID wristbands',
    'RFID labels',
    'NFC tags',
    'RFID manufacturer',
    'RFID supplier',
    ...productKeywords,
  ];

  const languageAlternates = Object.fromEntries(
    supportedLocales.map(item => [item, withLocalePath('/', item)])
  );

  return {
    title: {
      default: texts.seo.siteTitle,
      template: '%s | ATZ RFID',
    },
    description: texts.seo.siteDescription,
    keywords,
    authors: [{ name: 'ATZ RFID Team', url: 'https://www.atzrfid.com' }],
    creator: 'ATZ RFID',
    publisher: 'ATZ RFID',
    generator: 'Next.js',
    metadataBase: new URL('https://www.atzrfid.com'),
    alternates: {
      canonical: withLocalePath('/', locale),
      languages: {
        ...languageAlternates,
        'x-default': withLocalePath('/', defaultLocale),
      },
    },
    openGraph: {
      title: texts.seo.ogTitle,
      description: texts.seo.ogDescription,
      url: `https://www.atzrfid.com${withLocalePath('/', locale)}`,
      siteName: 'ATZ RFID',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
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
      title: texts.seo.ogTitle,
      description: texts.seo.ogDescription,
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
      apple: [{ url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
    },
    manifest: '/manifest.json',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getRequestLocale((await headers()).get('x-locale'));

  return (
    <html lang={locale}>
      <body className={`antialiased`}>
        {children}
        <ContactButtonsWrapper />
      </body>
    </html>
  );
}
