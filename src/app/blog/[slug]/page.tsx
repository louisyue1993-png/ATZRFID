import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { getSupabaseAdminClient } from '@/storage/database/supabase-client';
import { blogPosts as staticBlogPosts } from '@/lib/blog-data';

export const revalidate = 300;

function parseReadTime(value: unknown): string {
  if (typeof value === 'number') {
    return `${value} min read`;
  }
  if (typeof value === 'string' && value.trim()) {
    return value.includes('min') ? value : `${value} min read`;
  }
  return '5 min read';
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item));
      }
    } catch {
      return value
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    });
}

function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

function normalizeText(input: string): string {
  return decodeHtmlEntities(stripHtmlTags(input)).replace(/\s+/g, ' ').trim();
}

function parseHtmlContent(value: string): Array<{ heading?: string; paragraphs?: string[]; list?: string[] }> {
  if (!/<\/?(h2|h3|p|ul|ol|li)\b/i.test(value)) {
    return [];
  }

  const sections: Array<{ heading?: string; paragraphs?: string[]; list?: string[] }> = [];
  let current: { heading?: string; paragraphs?: string[]; list?: string[] } = { paragraphs: [] };

  const pushCurrentIfHasContent = () => {
    if (current.heading || current.paragraphs?.length || current.list?.length) {
      sections.push(current);
    }
  };

  const content = value.replace(/<br\s*\/?\s*>/gi, '\n');
  const tokenRegex = /<(h2|h3|p|li)[^>]*>([\s\S]*?)<\/\1>/gi;

  for (const match of content.matchAll(tokenRegex)) {
    const tag = (match[1] || '').toLowerCase();
    const text = normalizeText(match[2] || '');
    if (!text) continue;

    if (tag === 'h2' || tag === 'h3') {
      pushCurrentIfHasContent();
      current = { heading: text, paragraphs: [] };
      continue;
    }

    if (tag === 'p') {
      current.paragraphs = current.paragraphs || [];
      current.paragraphs.push(text);
      continue;
    }

    if (tag === 'li') {
      current.list = current.list || [];
      current.list.push(text);
    }
  }

  pushCurrentIfHasContent();
  return sections;
}

function parseContent(value: unknown): Array<{ heading?: string; paragraphs?: string[]; list?: string[] }> {
  if (Array.isArray(value)) {
    return value as Array<{ heading?: string; paragraphs?: string[]; list?: string[] }>;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed as Array<{ heading?: string; paragraphs?: string[]; list?: string[] }>;
      }
    } catch {
      const htmlSections = parseHtmlContent(value);
      if (htmlSections.length > 0) {
        return htmlSections;
      }

      const paragraphs = value
        .split(/\n{2,}/)
        .map(item => item.trim())
        .filter(Boolean);
      return [{ paragraphs }];
    }
  }

  return [];
}

function isActionableSupabaseError(error: any): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const normalizeText = (value: unknown): string => {
    if (typeof value !== 'string') return '';
    return value.replace(/\s+/g, ' ').trim();
  };

  const code = normalizeText(error.code);
  const message = normalizeText(error.message);
  const details = normalizeText(error.details);
  const hint = normalizeText(error.hint);

  const isNoRowsError = code === 'PGRST116' || /no rows returned|json object requested, multiple \(or no\) rows returned/i.test(message);
  if (isNoRowsError) {
    return false;
  }

  const meaninglessValues = new Set(['{}', '[]', 'null', 'undefined']);
  const hasMeaningfulCode = Boolean(code) && !meaninglessValues.has(code.toLowerCase());
  const hasMeaningfulMessage = Boolean(message) && !meaninglessValues.has(message.toLowerCase());
  const hasMeaningfulDetails = Boolean(details) && !meaninglessValues.has(details.toLowerCase());
  const hasMeaningfulHint = Boolean(hint) && !meaninglessValues.has(hint.toLowerCase());

  return hasMeaningfulCode || hasMeaningfulMessage || hasMeaningfulDetails || hasMeaningfulHint;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabaseAdminClient();

  let data: Record<string, any> | null = null;
  let error: any = null;

  const primary = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, content, category, created_at, read_time, author, tags, published')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  data = primary.data as any;
  error = primary.error;

  if (error && (error.code === '42703' || /column .* does not exist/i.test(String(error.message || '')))) {
    const fallback = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, content, category, created_at, readTime, author, tags, isPublished')
      .eq('slug', slug)
      .eq('isPublished', true)
      .maybeSingle();

    data = fallback.data as any;
    error = fallback.error;
  }

  if (error || !data) {
    if (isActionableSupabaseError(error)) {
      console.error('Error fetching blog post:', error);
    }

    const fallbackPost = staticBlogPosts.find(post => post.slug === slug && post.published);
    if (!fallbackPost) {
      return null;
    }

    return {
      id: String(fallbackPost.id),
      slug: fallbackPost.slug,
      title: fallbackPost.title,
      excerpt: fallbackPost.excerpt || '',
      category: fallbackPost.category || 'RFID',
      date: fallbackPost.date,
      readTime: fallbackPost.readTime || '5 min read',
      author: fallbackPost.author || 'ATZ Team',
      authorRole: 'RFID Specialist',
      authorBio: 'Focuses on RFID technology insights and real-world implementation best practices.',
      tags: Array.isArray(fallbackPost.tags) ? fallbackPost.tags : [],
      content: parseContent(fallbackPost.content),
    };
  }

  return {
    id: String(data.id),
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt || '',
    category: data.category || 'RFID',
    date: new Date(data.created_at).toLocaleDateString(),
    readTime: parseReadTime(data.read_time || data.readTime),
    author: data.author || 'ATZ Team',
    authorRole: 'RFID Specialist',
    authorBio: 'Focuses on RFID technology insights and real-world implementation best practices.',
    tags: parseTags(data.tags),
    content: parseContent(data.content),
  };
}

async function getRelatedPosts(currentId: string): Promise<RelatedPost[]> {
  const supabase = getSupabaseAdminClient();

  let data: RelatedPost[] | null = null;
  let error: any = null;

  const primary = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, category')
    .eq('published', true)
    .neq('id', currentId)
    .order('created_at', { ascending: false })
    .limit(3);

  data = primary.data as any;
  error = primary.error;

  if (error && (error.code === '42703' || /column .* does not exist/i.test(String(error.message || '')))) {
    const fallback = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, category')
      .eq('isPublished', true)
      .neq('id', currentId)
      .order('created_at', { ascending: false })
      .limit(3);

    data = fallback.data as any;
    error = fallback.error;
  }

  if (error || !data) {
    return staticBlogPosts
      .filter(post => post.published)
      .filter(post => String(post.id) !== currentId)
      .slice(0, 3)
      .map(post => ({
        id: String(post.id),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
      }));
  }

  return data;
}

const getCachedBlogPost = (slug: string) =>
  unstable_cache(
    async () => getBlogPost(slug),
    ['blog-post', slug],
    { revalidate: 300, tags: ['blog-posts', `blog-post-${slug}`] }
  )();

const getCachedRelatedPosts = (currentId: string) =>
  unstable_cache(
    async () => getRelatedPosts(currentId),
    ['blog-related', currentId],
    { revalidate: 300, tags: ['blog-posts', `blog-related-${currentId}`] }
  )();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCachedBlogPost(slug);

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
  const post = await getCachedBlogPost(slug);

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

  const relatedPosts = await getCachedRelatedPosts(post.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
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

        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>

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

              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-8 flex items-center justify-center">
                <Share2 className="h-20 w-20 text-blue-400" />
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
                {post.content.map((section, index) => (
                  <div key={index} className="mb-8">
                    {section.heading && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {section.heading}
                      </h2>
                    )}
                    {section.paragraphs && section.paragraphs.map((paragraph, pIndex) => (
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

              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

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

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
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
    paragraphs?: string[];
    list?: string[];
  }>;
};

type RelatedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
};
