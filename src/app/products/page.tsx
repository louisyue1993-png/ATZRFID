import { Suspense } from 'react';
import { use } from 'react';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import ProductsPageClient from '@/components/ProductsPageClient';
import {
  defaultLocale,
  getLocaleTexts,
  getRequestLocale,
  productKeywords,
  supportedLocales,
  withLocalePath,
} from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale((await headers()).get('x-locale'));
  const texts = getLocaleTexts(locale);

  return {
    title: `${texts.nav.products} | ATZ RFID`,
    description: texts.seo.siteDescription,
    keywords: productKeywords,
    alternates: {
      canonical: withLocalePath('/products', locale),
      languages: {
        ...Object.fromEntries(supportedLocales.map(item => [item, withLocalePath('/products', item)])),
        'x-default': withLocalePath('/products', defaultLocale),
      },
    },
    openGraph: {
      title: `${texts.nav.products} | ATZ RFID`,
      description: texts.seo.siteDescription,
      url: `https://www.atzrfid.com${withLocalePath('/products', locale)}`,
      type: 'website',
    },
  };
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string; sort?: string; search?: string }>;
}) {
  const params = use(searchParams);
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading products...</div>}>
      <ProductsPageClient
        initialCategory={params.category || ''}
        initialSubCategory={params.subcategory || ''}
      />
    </Suspense>
  );
}
