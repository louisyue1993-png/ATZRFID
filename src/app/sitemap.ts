import { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { productCategories } from '@/data/productCategories';
import { supportedLocales, withLocalePath } from '@/lib/i18n';
import { getSiteUrl } from '@/lib/site-url';

function withAllLocales(baseUrl: string, path: string) {
  return supportedLocales.map(locale => `${baseUrl}${withLocalePath(path, locale)}`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  // Static pages
  const staticPaths = ['/', '/about', '/contact', '/products', '/blog', '/privacy', '/terms', '/shipping'];
  const staticPages = staticPaths.flatMap(path =>
    withAllLocales(baseUrl, path).map(url => ({
      url,
      lastModified: new Date(),
      changeFrequency: path === '/' || path === '/products' ? ('daily' as const) : ('weekly' as const),
      priority: path === '/' ? 1 : path === '/products' ? 0.9 : 0.7,
    }))
  );

  // Product category pages
  const categoryPages = productCategories.flatMap((category) =>
    withAllLocales(baseUrl, `/products?category=${category.id}`).map(url => ({
      url,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // Product detail pages
  const productPages = products.flatMap((product) =>
    withAllLocales(baseUrl, `/products/${product.id}`).map(url => ({
      url,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...categoryPages, ...productPages];
}
