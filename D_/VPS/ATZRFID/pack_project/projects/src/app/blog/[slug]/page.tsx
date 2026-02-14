import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 直接从数据库获取博客文章
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('[Blog Post] Database error:', error);
      return null;
    }

    if (!data) {
      console.error('[Blog Post] No post found with slug:', slug);
      return null;
    }

    // 解析内容
    let content: Array<{
      heading?: string;
      paragraphs: string[];
      list?: string[];
    }> = [];

    // 尝试解析 content 字段
    if (typeof data.content === 'string') {
      // 将 Markdown 格式的文本转换为结构化内容
      const lines = data.content.split('\n');
      let currentSection: typeof content[0] = { paragraphs: [] };

      for (const line of lines) {
        if (line.startsWith('## ')) {
          if (currentSection.paragraphs.length > 0 || currentSection.list) {
            content.push(currentSection);
          }
          currentSection = {
            heading: line.replace('## ', ''),
            paragraphs: [],
          };
        } else if (line.startsWith('- ')) {
          if (!currentSection.list) {
            currentSection.list = [];
          }
          currentSection.list.push(line.replace('- ', ''));
        } else if (line.trim()) {
          currentSection.paragraphs.push(line.trim());
        }
      }

      if (currentSection.paragraphs.length > 0 || currentSection.list) {
        content.push(currentSection);
      }
    }

    // 解析 tags 和 seo_keywords
    const tags = typeof data.tags === 'string' ? JSON.parse(data.tags) : (data.tags || []);
    const seoKeywords = typeof data.seo_keywords === 'string' ? JSON.parse(data.seo_keywords) : (data.seo_keywords || []);

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt || '',
      category: data.category || 'Uncategorized',
      date: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) : new Date().toLocaleDateString(),
      readTime: data.read_time || '5 min read',
      author: data.author || 'ATZ Team',
      authorRole: 'RFID Expert',
      authorBio: 'ATZ RFID team member with extensive experience in RFID technology and solutions.',
      tags: tags,
      content: content.length > 0 ? content : [
        {
          paragraphs: [data.content || data.excerpt || ''],
        },
      ],
      image: data.image || data.featuredimage || null,
    };
  } catch (error) {
    console.error('[Blog Post] Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | RFID Blog`,
    description: post.excerpt,
    keywords: ['RFID', post.category, 'blog', post.title, ...(post.tags || [])],
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-4">The blog post you are looking for does not exist.</p>
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
              {post.image && (
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-8 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {post.excerpt && (
                  <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
                )}
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
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

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
      </main>

      <Footer />
    </div>
  );
}

type BlogPost = {
  id: string;
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
  image?: string | null;
};
