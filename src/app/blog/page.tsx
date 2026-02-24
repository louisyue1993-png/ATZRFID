'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Search, ArrowRight, Tag, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  published: boolean;
  tags: string[];
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/blog?limit=12');
        const data = await response.json();

        if (data.success && data.posts) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                RFID Insights & News
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Stay informed about the latest RFID technology trends, applications, and
                industry developments
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All Topics' : category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-3">Loading blog posts...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    {posts.length === 0
                      ? 'No blog posts available yet. Check back soon!'
                      : 'No articles match your search criteria.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Featured Post */}
                  {filteredPosts.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
                      <Link href={`/blog/${filteredPosts[0].slug}`}>
                        <Card className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div className="grid md:grid-cols-2">
                            <div className="aspect-video md:aspect-auto bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                              <img
                                src={filteredPosts[0].image}
                                alt={filteredPosts[0].title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/blog/default-blog.jpg';
                                }}
                              />
                            </div>
                            <div className="p-8 flex flex-col justify-center">
                              <div className="flex items-center gap-3 mb-4">
                                <Badge variant="secondary">{filteredPosts[0].category}</Badge>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {filteredPosts[0].readTime}
                                </span>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                                {filteredPosts[0].title}
                              </h3>
                              <p className="text-gray-600 mb-6 line-clamp-3">
                                {filteredPosts[0].excerpt}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(filteredPosts[0].createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  )}

                  {/* Article Grid */}
                  {filteredPosts.length > 1 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.slice(1).map((post) => (
                          <Link key={post.id} href={`/blog/${post.slug}`}>
                            <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/blog/default-blog.jpg';
                                  }}
                                />
                              </div>
                              <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {post.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {post.readTime}
                                  </span>
                                </div>
                                <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                                  {post.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <CardDescription className="line-clamp-3 mb-4">
                                  {post.excerpt}
                                </CardDescription>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(post.createdAt)}
                                  </span>
                                  <ArrowRight className="h-4 w-4 text-blue-600" />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-blue-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter for the latest RFID insights and industry news
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white"
                />
                <Button size="lg" variant="secondary" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
