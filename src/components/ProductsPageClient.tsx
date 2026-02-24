'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Menu, Tag, Filter, Star, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCategorySidebar from '@/components/ProductCategorySidebar';
import { productCategories } from '@/data/productCategories';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  priceRange: string;
  frequency: string;
  chip: string;
  memory: string;
  readRange: string;
  protocol: string;
  category: string;
  subCategory: string;
  badge?: string;
  moq: string;
  deliveryTime: string;
  specifications: Record<string, string>;
  features: string[];
  applications: string[];
  keywords: string[];
  seoKeywords: string[];
  stockStatus: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating: number;
  reviewCount: number;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProductsPageClient({
  initialCategory = '',
  initialSubCategory = '',
}: {
  initialCategory?: string;
  initialSubCategory?: string;
}) {
  const searchParams = useSearchParams();
  const productsGridRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchParams, setLocalSearchParams] = useState({
    category: initialCategory,
    subcategory: initialSubCategory,
    sort: 'popular',
    search: '',
  });

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        console.log('[ProductsPageClient] Fetching products from API...');
        const response = await fetch('/api/products?limit=1000');
        const data = await response.json();
        
        console.log('[ProductsPageClient] API response:', {
          success: data.success,
          count: data.count,
          products: data.products?.length
        });
        
        if (data.success && data.products) {
          console.log('[ProductsPageClient] Sample product:', data.products[0]);
          setProducts(data.products);
        }
      } catch (err) {
        console.error('[ProductsPageClient] Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Sync local state with URL parameters
  useEffect(() => {
    const newCategory = searchParams.get('category') || initialCategory;
    const newSubcategory = searchParams.get('subcategory') || initialSubCategory;
    
    console.log('[ProductsPageClient] Syncing localSearchParams:', {
      fromUrl: {
        category: searchParams.get('category'),
        subcategory: searchParams.get('subcategory')
      },
      fromInitial: {
        category: initialCategory,
        subcategory: initialSubCategory
      },
      result: { category: newCategory, subcategory: newSubcategory }
    });
    
    setLocalSearchParams(prev => ({
      ...prev,
      category: newCategory,
      subcategory: newSubcategory,
    }));
  }, [searchParams, initialCategory, initialSubCategory]);

  // Scroll to products grid when category or subcategory changes
  useEffect(() => {
    if (productsGridRef.current) {
      productsGridRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [localSearchParams.category, localSearchParams.subcategory]);

  const filteredProducts = filterProducts(
    products,
    localSearchParams.category,
    localSearchParams.subcategory,
    localSearchParams.sort,
    localSearchParams.search
  );
  
  // Log filtered products for debugging
  useEffect(() => {
    console.log('[ProductsPageClient] filteredProducts changed:', {
      length: filteredProducts.length,
      category: localSearchParams.category,
      subcategory: localSearchParams.subcategory
    });
  }, [filteredProducts, localSearchParams.category, localSearchParams.subcategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header - Premium Dark Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-16 lg:py-20">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyNGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTIgMjRjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')]"></div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Menu className="h-4 w-4 mr-2" />
                Categories
              </Button>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                Browse All Products
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              RFID Products
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
              Discover our complete RFID product portfolio featuring UHF (860-960MHz) and HF/NFC (13.56MHz) solutions across 7 major categories: industrial tags, wristbands, cards, hardware, and industry-specific solutions for apparel, assets, warehousing, laundry, and more. Engineered for durability, performance, and seamless integration with leading chip technologies from Impinj, NXP, and Alien Technology.
            </p>
          </div>
        </section>

        {/* Products Section with Sidebar */}
        <section className="py-8 lg:py-12 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Sidebar - Desktop */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                <ProductCategorySidebar
                  currentCategory={localSearchParams.category}
                  currentSubCategory={localSearchParams.subcategory}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-6">
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 hover:border-blue-400 hover:text-blue-600"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Products
                  </Button>
                </div>

                {/* Filters Bar - Premium Design */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 border-slate-300 focus:border-blue-400 focus:ring-blue-400"
                      value={localSearchParams.search}
                      onChange={(e) => setLocalSearchParams({ ...localSearchParams, search: e.target.value })}
                    />
                  </div>

                  <Select
                    value={localSearchParams.category || 'all'}
                    onValueChange={(value) =>
                      setLocalSearchParams({ ...localSearchParams, category: value === 'all' ? '' : value, subcategory: '' })
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {productCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={localSearchParams.sort}
                    onValueChange={(value) => setLocalSearchParams({ ...localSearchParams, sort: value })}
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Products Grid */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-sm text-slate-600 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">
                      {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                </div>

                <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center mb-6">
                      <Search className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                      Try adjusting your filters or search terms
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setLocalSearchParams({ category: '', subcategory: '', sort: 'popular', search: '' })}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile Sidebar Modal */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Categories</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  ✕
                </Button>
              </div>
            </div>
            <ProductCategorySidebar
              currentCategory={localSearchParams.category}
              currentSubCategory={localSearchParams.subcategory}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function filterProducts(
  products: Product[],
  category: string,
  subcategory: string,
  sort: string,
  search: string
): Product[] {
  console.log('[filterProducts] Called with:', {
    totalProducts: products.length,
    category,
    subcategory,
    sort,
    search
  });
  
  let filteredProducts = [...products];

  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
    console.log(`[filterProducts] After category filter: ${filteredProducts.length} products`);
  }

  // Filter by subcategory
  if (subcategory && subcategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.subCategory === subcategory);
    console.log(`[filterProducts] After subcategory filter: ${filteredProducts.length} products`);
    if (filteredProducts.length === 0) {
      console.log('[filterProducts] Available subCategories in remaining products:',
        products.filter(p => p.category === category).map(p => p.subCategory)
      );
    }
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.shortDescription.toLowerCase().includes(searchLower) ||
      (p.keywords && p.keywords.some((k: string) => k.toLowerCase().includes(searchLower))) ||
      (p.seoKeywords && p.seoKeywords.some((k: string) => k.toLowerCase().includes(searchLower)))
    );
  }

  // Sort products
  if (sort === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''))
    );
  } else if (sort === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, ''))
    );
  } else if (sort === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();
      return dateB - dateA;
    });
  } else if (sort === 'popular') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.reviewCount - a.reviewCount);
  }

  console.log(`[filterProducts] Final result: ${filteredProducts.length} products`);
  return filteredProducts;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col cursor-pointer group-hover:-translate-y-1">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {product.badge && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
            {product.badge}
          </Badge>
        )}
      </div>
      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            {product.price}
          </span>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-amber-700">{product.rating}</span>
            <span className="text-xs text-amber-600 ml-1">({product.reviewCount})</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
          View Details
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Link>
  );
}
