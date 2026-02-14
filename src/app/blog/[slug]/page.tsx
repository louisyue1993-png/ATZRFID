import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | RFID Blog`,
    description: post.excerpt,
    keywords: ['RFID', post.category, 'blog', post.title],
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>

              {/* Header */}
              <div className="mb-8">
                <Badge className="mb-4">{post.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-8 flex items-center justify-center">
                <Share2 className="h-20 w-20 text-blue-400" />
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
                {post.content.map((section, index) => (
                  <div key={index} className="mb-8">
                    {section.heading && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {section.heading}
                      </h2>
                    )}
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-700 mb-4">
                        {paragraph}
                      </p>
                    ))}
                    {section.list && (
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        {section.list.map((item, iIndex) => (
                          <li key={iIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Share */}
              <div className="mt-8 pt-8 border-t">
                <p className="text-sm font-medium text-gray-900 mb-4">Share this article:</p>
                <div className="flex gap-3">
                  <Button size="sm" variant="outline">
                    <Facebook className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <Twitter className="h-4 w-4 mr-2" />
                    Tweet
                  </Button>
                  <Button size="sm" variant="outline">
                    <Linkedin className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Author Bio */}
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{post.author}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {post.authorRole}
                      </p>
                      <p className="text-sm text-gray-600">
                        {post.authorBio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {getRelatedPosts(post.id).map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Share2 className="h-8 w-8 text-gray-400" />
                      </div>
                      <CardContent className="pt-4">
                        <Badge className="mb-3 text-xs">{relatedPost.category}</Badge>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function getBlogPost(slug: string): BlogPost | null {
  const posts: Record<string, BlogPost> = {
    'future-of-rfid-technology-2025': {
      id: 1,
      slug: 'future-of-rfid-technology-2025',
      title: 'The Future of RFID Technology: Trends to Watch in 2025',
      excerpt: 'Explore the emerging trends and innovations that will shape the RFID industry in the coming years, from enhanced security to IoT integration.',
      category: 'Technology',
      date: 'January 15, 2025',
      readTime: '8 min read',
      author: 'Dr. Sarah Chen',
      authorRole: 'Chief Technology Officer',
      authorBio: 'Dr. Chen has over 15 years of experience in RFID technology and leads our R&D team in developing next-generation solutions.',
      tags: ['RFID Trends', 'Technology', 'IoT', 'Innovation'],
      content: [
        {
          heading: 'Introduction',
          paragraphs: [
            'Radio Frequency Identification (RFID) technology continues to evolve at a rapid pace, driven by advancements in chip design, antenna technology, and IoT integration. As we move into 2025, several key trends are emerging that will shape the future of RFID across industries.',
            'This article explores the most significant developments in RFID technology and their potential impact on businesses worldwide.',
          ],
        },
        {
          heading: 'Enhanced Security Features',
          paragraphs: [
            'Security remains a top priority for RFID applications, particularly in access control and payment systems. New encryption standards and authentication protocols are being developed to protect against cloning and unauthorized access.',
            'The latest RFID chips now feature advanced cryptographic capabilities, including dynamic key exchange and challenge-response authentication, making them significantly more secure than previous generations.',
          ],
        },
        {
          heading: 'IoT Integration',
          paragraphs: [
            'RFID is increasingly being integrated with the Internet of Things (IoT) ecosystem, enabling real-time tracking and data analytics across entire supply chains. Smart RFID tags with built-in sensors can monitor temperature, humidity, and other environmental factors.',
          ],
        },
        {
          heading: 'Key Trends to Watch',
          paragraphs: [],
          list: [
            'AI-powered data analytics for RFID systems',
            'Smaller and more energy-efficient tags',
            'Enhanced read range and accuracy',
            'Lower production costs enabling widespread adoption',
            'Integration with blockchain for secure supply chain tracking',
          ],
        },
      ],
    },
  };

  return posts[slug] || null;
}

function getRelatedPosts(currentId: number): RelatedPost[] {
  const allPosts = [
    {
      id: 2,
      slug: 'rfid-vs-barcodes-comparison',
      title: 'RFID vs Barcodes: A Comprehensive Comparison',
      excerpt: 'Understanding the key differences between RFID and barcode technologies.',
      category: 'Technology',
    },
    {
      id: 3,
      slug: 'rfid-in-retail-inventory-management',
      title: 'How RFID is Revolutionizing Retail Inventory Management',
      excerpt: 'Discover how retailers leverage RFID to improve inventory accuracy.',
      category: 'Applications',
    },
    {
      id: 4,
      slug: 'choosing-right-rfid-tags',
      title: 'Choosing the Right RFID Tags for Your Application',
      excerpt: 'A comprehensive guide to selecting appropriate RFID tags.',
      category: 'Applications',
    },
  ];

  return allPosts.filter((post) => post.id !== currentId).slice(0, 3);
}

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  authorBio: string;
  tags: string[];
  content: Array<{
    heading?: string;
    paragraphs: string[];
    list?: string[];
  }>;
};

type RelatedPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
};
