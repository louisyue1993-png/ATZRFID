import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, Globe, Shield, Truck, Zap, Star, Award, TrendingUp, Users, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { productCategories } from '@/data/productCategories';
import { fetchProducts } from '@/lib/product-api';

function LocalBusinessJsonLd({ products = [] }: { products: any[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ATZ RFID',
    description: 'Leading manufacturer of RFID products including cards, tags, wristbands, labels, and NFC tags. ISO 9001 certified quality with competitive wholesale pricing and global shipping.',
    url: 'https://www.atzrfid.com',
    telephone: '+86 176 8896 4979',
    email: 'info@atzrfid.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Building 522, Bagualing Industrial Zone',
      addressLocality: 'Shenzhen',
      addressRegion: 'Guangdong',
      postalCode: '518000',
      addressCountry: 'CN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.5550',
      longitude: '114.1094',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      }
    ],
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
    },
    sameAs: [
      'https://www.facebook.com/atzrfid',
      'https://www.twitter.com/atzrfid',
      'https://www.linkedin.com/company/atzrfid',
      'https://www.instagram.com/atzrfid',
    ],
    areaServed: ['CN', 'US', 'CA', 'GB', 'DE', 'AU', 'JP', 'KR'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'RFID Products',
      itemListElement: products.slice(0, 10).map(product => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function Home() {
  // Fetch products from database
  const products = await fetchProducts({ limit: 10 });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LocalBusinessJsonLd products={products} />

      <main className="flex-1">
        {/* Hero Section - Premium Dark Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-24 md:py-32">
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
            <div className="max-w-4xl mx-auto text-center">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400"></div>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30 transition-all">
                  <Star className="w-3 h-3 mr-1 fill-amber-300" />
                  Leading RFID Supplier Worldwide
                </Badge>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400"></div>
              </div>

              {/* Main Heading with Gradient Text */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Premium RFID Cards, </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
                  Tags & Wristbands
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Premium <span className="text-amber-400 font-semibold">UHF tags</span>, 
                <span className="text-amber-400 font-semibold"> HF/NFC labels</span>, wristbands & cards. 
                Custom RFID solutions for apparel, warehouse, healthcare & retail. 
                Featuring <span className="text-amber-400 font-semibold">Impinj, NXP, Alien chips</span>.
              </p>

              {/* CTA Buttons with Premium Design */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-8 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all group">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-amber-400 hover:bg-amber-400/10 text-white hover:text-amber-300 font-semibold px-8 transition-all">
                    Get Quote
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span className="text-slate-300 font-medium">ISO 9001 Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-amber-400" />
                  <span className="text-slate-300 font-medium">10,000+ Customers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-amber-400" />
                  <span className="text-slate-300 font-medium">100+ Countries</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Premium Design */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Excellence in Every RFID Solution
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We deliver exceptional RFID products with superior quality and service
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-blue-600" />}
                title="ISO 9001 Certified"
                description="Quality assured products meeting international standards"
              />
              <FeatureCard
                icon={<Globe className="h-8 w-8 text-blue-600" />}
                title="Global Shipping"
                description="Fast and reliable delivery to over 100 countries"
              />
              <FeatureCard
                icon={<Truck className="h-8 w-8 text-blue-600" />}
                title="Wholesale Pricing"
                description="Competitive rates for bulk orders and distributors"
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-blue-600" />}
                title="Fast Production"
                description="Quick turnaround time with custom printing options"
              />
            </div>
          </div>
        </section>

        {/* Featured Products - Premium Design */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
                Best Sellers
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover our premium RFID products trusted by global enterprises
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group-hover:-translate-y-1">
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
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                          {product.price}
                        </span>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-semibold text-amber-700">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all group">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Projects / Case Studies - Premium Design */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover how our RFID solutions have transformed businesses worldwide
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project 1 - Warehouse */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-200 hover:border-blue-400 transition-all duration-500">
                <div className="h-64 overflow-hidden relative">
                  <img src="/project-warehouse.jpg" alt="Warehouse RFID System" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-600 text-white border-0">Warehousing</Badge>
                      <Badge className="bg-white/20 backdrop-blur text-white border-white/30">Inventory</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Large Warehouse RFID Inventory System
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    Implemented a comprehensive RFID tracking system for a 100,000 sq ft distribution center.
                  </p>
                  
                  {/* Challenge & Solution */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-blue-600" />
                        Challenge
                      </p>
                      <p className="text-xs text-slate-600">Manual inventory taking took 3 days with 85% accuracy</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-100">
                      <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                        <Target className="h-3 w-3 text-blue-600" />
                        Solution
                      </p>
                      <p className="text-xs text-blue-800">50,000+ RFID tags + handheld readers + cloud management</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">99.8%</p>
                      <p className="text-xs text-slate-600 font-medium">Accuracy</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">80%</p>
                      <p className="text-xs text-slate-600 font-medium">Time Saved</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$2M</p>
                      <p className="text-xs text-slate-600 font-medium">ROI/Year</p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs italic text-slate-600 mb-2 leading-relaxed">"The RFID system revolutionized our operations. We now have real-time visibility of all inventory."</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Global Logistics Inc.</p>
                        <p className="text-xs text-slate-500">Supply Chain Director</p>
                      </div>
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project 2 - Festival */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-500/10 border border-slate-200 hover:border-green-400 transition-all duration-500">
                <div className="h-64 overflow-hidden relative">
                  <img src="/project-festival.jpg" alt="Music Festival RFID System" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white border-0">Events</Badge>
                      <Badge className="bg-white/20 backdrop-blur text-white border-white/30">Access Control</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                    Music Festival Access Control System
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    Deployed RFID wristbands for a 3-day music festival with 50,000 attendees.
                  </p>
                  
                  {/* Challenge & Solution */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        Challenge
                      </p>
                      <p className="text-xs text-slate-600">Ticket fraud and 2+ hour entry wait times</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border border-green-100">
                      <p className="text-xs font-semibold text-green-900 mb-1 flex items-center gap-1">
                        <Target className="h-3 w-3 text-green-600" />
                        Solution
                      </p>
                      <p className="text-xs text-green-800">NFC wristbands + 50 gate readers + mobile app</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">75%</p>
                      <p className="text-xs text-slate-600 font-medium">Faster Entry</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">0</p>
                      <p className="text-xs text-slate-600 font-medium">Fraud Cases</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">4.9★</p>
                      <p className="text-xs text-slate-600 font-medium">Rating</p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs italic text-slate-600 mb-2 leading-relaxed">"Eliminated all counterfeit tickets and reduced entry times by 75%. Best investment we made."</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">SummerFest 2024</p>
                        <p className="text-xs text-slate-500">Event Organizer</p>
                      </div>
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project 3 - Hospital */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="h-56 overflow-hidden relative">
                  <img src="/project-hospital.jpg" alt="Hospital RFID System" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Healthcare</Badge>
                      <Badge variant="secondary">Patient Tracking</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Hospital Patient Identification System
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Developed a patient tracking system using RFID wristbands for a regional hospital.
                  </p>
                  
                  {/* Challenge & Solution */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Challenge</p>
                      <p className="text-xs text-blue-800">Medication errors and manual patient tracking</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-green-900 mb-1">Solution</p>
                      <p className="text-xs text-green-800">RFID wristbands + bed readers + medication cabinets</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">95%</p>
                      <p className="text-xs text-gray-500">Error Reduction</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">30%</p>
                      <p className="text-xs text-gray-500">Efficiency Gain</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">JCI</p>
                      <p className="text-xs text-gray-500">Certified</p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="border-t pt-4">
                    <p className="text-xs italic text-gray-600 mb-2">"Patient safety improved dramatically. RFID integration with our EMR system was seamless."</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Metro Regional Hospital</p>
                        <p className="text-xs text-gray-500">Chief Medical Officer</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project 4 - Manufacturing */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="h-56 overflow-hidden relative">
                  <img src="/project-manufacturing.jpg" alt="Manufacturing RFID System" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Manufacturing</Badge>
                      <Badge variant="secondary">Asset Management</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Automotive Manufacturing Line Tracking
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Implemented RFID tracking for automotive production line with real-time component tracking.
                  </p>
                  
                  {/* Challenge & Solution */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Challenge</p>
                      <p className="text-xs text-blue-800">Manual component tracking causing 12% defect rate</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-green-900 mb-1">Solution</p>
                      <p className="text-xs text-green-800">RFID tags on components + conveyor readers + quality control</p>
                    </div>
              </div>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">30%</p>
                      <p className="text-xs text-gray-500">Faster Assembly</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">12%</p>
                      <p className="text-xs text-gray-500">Defect Reduction</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">ISO</p>
                      <p className="text-xs text-gray-500">9001</p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="border-t pt-4">
                    <p className="text-xs italic text-gray-600 mb-2">"Production efficiency increased significantly. Real-time tracking is a game changer."</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">AutoTech Manufacturing</p>
                        <p className="text-xs text-gray-500">Production Manager</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project 5 - Retail */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="h-56 overflow-hidden relative">
                  <img src="/project-retail.jpg" alt="Retail RFID System" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Retail</Badge>
                      <Badge variant="secondary">Apparel</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Fashion Brand Retail Inventory System
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Deployed RFID garment tags for a global fashion retailer with 500 stores.
                  </p>
                  
                  {/* Challenge & Solution */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Challenge</p>
                      <p className="text-xs text-blue-800">No real-time inventory, 25% out-of-stock rate</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-green-900 mb-1">Solution</p>
                      <p className="text-xs text-green-800">RFID garment tags + smart shelves + central dashboard</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">60%</p>
                      <p className="text-xs text-gray-500">Stock Reduction</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">40%</p>
                      <p className="text-xs text-gray-500">Sales Increase</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">500+</p>
                      <p className="text-xs text-gray-500">Stores</p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="border-t pt-4">
                    <p className="text-xs italic text-gray-600 mb-2">"Inventory visibility across all 500 stores is now seamless. Sales increased 40%."</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">FashionStyle Co.</p>
                        <p className="text-xs text-gray-500">VP of Operations</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project 6 - Library */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="h-56 overflow-hidden relative">
                  <img src="/project-library.jpg" alt="Library RFID System" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Education</Badge>
                      <Badge variant="secondary">Library</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    University Library Book Management
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Implemented RFID library management system for a major university with 2M+ books.
                  </p>
                  
                  {/* Challenge & Solution */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Challenge</p>
                      <p className="text-xs text-blue-800">Manual checkout, 15-minute wait times, lost books</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-green-900 mb-1">Solution</p>
                      <p className="text-xs text-green-800">RFID book tags + self-service kiosks + security gates</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">85%</p>
                      <p className="text-xs text-gray-500">Faster Checkout</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">99%</p>
                      <p className="text-xs text-gray-500">Book Recovery</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">24/7</p>
                      <p className="text-xs text-gray-500">Access</p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="border-t pt-4">
                    <p className="text-xs italic text-gray-600 mb-2">"Students love the self-service kiosks. Book loss decreased by 90%."</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">State University</p>
                        <p className="text-xs text-gray-500">Library Director</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all group">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Industries Section - Premium Design */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                Our Expertise
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Industries We Serve
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Trusted by businesses across various sectors worldwide
              </p>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                'Access Control',
                'Event Management',
                'Retail & Supply Chain',
                'Healthcare',
                'Manufacturing',
                'Transportation',
              ].map((industry) => (
                <div
                  key={industry}
                  className="group bg-white p-6 rounded-xl text-center border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-default"
                >
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{industry}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Contact us for a custom quote or discuss your RFID project requirements
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Request Quote
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 border-white"
                  >
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group text-center bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
