import { Suspense } from 'react';
import { use } from 'react';
import ProductsPageClient from '@/components/ProductsPageClient';

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
