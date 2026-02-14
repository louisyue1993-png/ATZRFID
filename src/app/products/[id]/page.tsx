import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Shield, Truck, Clock, ArrowLeft, Star, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactButtonsWrapper from '@/components/ContactButtonsWrapper';
import ProductCTA from '@/components/ProductCTA';
import Link from 'next/link';
import { getProductByIdFromDB, getRelatedProductsFromDB } from '@/lib/product-db';
import type { Product } from '@/data/products';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdFromDB(id);

  if (!product) {
    return {
      title: 'Product Not Found | ATZ RFID',
      description: 'The product you are looking for could not be found.',
    };
  }

  return {
    title: `${product.title} | ATZ RFID`,
    description: product.shortDescription,
    keywords: product.seoKeywords,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      type: 'website',
      siteName: 'ATZ RFID',
      url: `https://www.atzrfid.com/products/${product.id}`,
      images: [
        {
          url: `https://www.atzrfid.com/products/${product.id}.jpg`,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
    },
  };
}

function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    title: product.title,
    description: product.shortDescription,
    image: `https://www.atzrfid.com/products/${product.id}.jpg`,
    brand: {
      '@type': 'Brand',
      name: 'ATZ RFID',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'ATZ RFID',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.atzrfid.com/products/${product.id}`,
      priceCurrency: 'USD',
      price: parseFloat(product.price.replace('From $', '')),
      priceValidUntil: '2025-12-31',
      availability: product.stockStatus === 'InStock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ATZ RFID',
      },
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Frequency',
        value: product.frequency,
      },
      {
        '@type': 'PropertyValue',
        name: 'Chip',
        value: product.chip,
      },
      {
        '@type': 'PropertyValue',
        name: 'Memory',
        value: product.memory,
      },
      {
        '@type': 'PropertyValue',
        name: 'Read Range',
        value: product.readRange,
      },
      {
        '@type': 'PropertyValue',
        name: 'Protocol',
        value: product.protocol,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.atzrfid.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://www.atzrfid.com/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        item: `https://www.atzrfid.com/products?category=${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `https://www.atzrfid.com/products/${product.id}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdFromDB(id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you are looking for could not be found.</p>
            <Link href="/products">
              <Button>Return to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = await getRelatedProductsFromDB(product.category, product.id, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd product={product} />
      <Header />
      <ContactButtonsWrapper />
      <main className="flex-1">
        {/* Breadcrumb - Premium Design */}
        <div className="bg-gradient-to-r from-slate-50 to-white py-4 border-b border-slate-200">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <span className="text-slate-400">/</span>
              <Link href="/products" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                Products
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900 font-semibold">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <section className="py-8 md:py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <Link href="/products" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors font-medium group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Link>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent"></div>
                {product.badge && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-sm font-medium">
                    {product.category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Badge>
                  {product.badge && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">{product.badge}</Badge>}
                  {product.stockStatus === 'InStock' && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1 fill-green-700" />
                      In Stock
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-lg text-slate-600 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 text-lg">{product.rating}</span>
                  <span className="text-slate-600">({product.reviewCount} verified reviews)</span>
                </div>

                {/* Price */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {product.price}
                  </span>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">{product.frequency}</Badge>
                  {product.priceRange !== product.price && (
                    <span className="text-sm text-slate-500">{product.priceRange}</span>
                  )}
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-4">
                  <SpecItem icon={<Package className="h-5 w-5 text-blue-600" />} label="Chip" value={product.chip} />
                  <SpecItem icon={<Shield className="h-5 w-5 text-blue-600" />} label="Memory" value={product.memory} />
                  <SpecItem icon={<Truck className="h-5 w-5 text-blue-600" />} label="Read Range" value={product.readRange} />
                  <SpecItem icon={<Clock className="h-5 w-5 text-blue-600" />} label="Protocol" value={product.protocol} />
                </div>

                {/* MOQ & Delivery */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Minimum Order Quantity</p>
                      <p className="font-bold text-slate-900 text-lg">{product.moq} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Delivery Time</p>
                      <p className="font-bold text-slate-900 text-lg">{product.deliveryTime}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <ProductCTA productName={product.name} productSku={product.id} />

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>ISO 9001 Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span>Global Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span>Quality Assured</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-12 lg:mt-16">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Description</CardTitle>
                      <CardDescription>Detailed information about this product</CardDescription>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="text-lg mb-6 leading-relaxed">{product.fullDescription}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Specifications</CardTitle>
                      <CardDescription>Complete technical details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-0">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-4 border-b border-slate-100 last:border-0"
                          >
                            <span className="font-medium text-slate-600">{key}</span>
                            <span className="font-semibold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="applications" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Applications</CardTitle>
                      <CardDescription>Common use cases for this product</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {product.applications.map((app, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-800 font-medium">{app}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                      <CardDescription>What makes this product special</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-800 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-12 lg:mt-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">You May Also Like</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                          <img 
                            src={relatedProduct.image} 
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {relatedProduct.badge && (
                            <Badge className="absolute top-3 right-3">{relatedProduct.badge}</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{relatedProduct.shortDescription}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-600">{relatedProduct.price}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                              <span className="text-xs text-slate-600">{relatedProduct.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-blue-50/30 p-3 rounded-lg border border-slate-100">
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-600 font-medium">{label}</p>
        <p className="font-semibold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );
}
