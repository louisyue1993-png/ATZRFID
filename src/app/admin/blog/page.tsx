'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Clock,
  Loader2
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  featured_image: string;
  tags: string[];
  published: boolean;
  language: string;
  read_time: number;
  date: string;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog?published=all&limit=100');
      const data = await response.json();

      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete post');
      }

      alert('Blog post deleted successfully!');
      await fetchPosts();
    } catch (error: any) {
      alert(error.message || 'Error deleting post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-slate-600 mt-1">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-3">
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
                <Badge variant="outline">{post.category}</Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.read_time}
                </span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Link href={`/admin/blog/edit/${post.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/blog/${post.slug}`} target="_blank" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(post.id, post.title)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search'
                : 'Get started by writing your first blog post'}
            </p>
            <Link href="/admin/blog/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
