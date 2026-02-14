'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Download,
  Trash2,
  Loader2,
  Copy,
  Eye,
  Image as ImageIcon,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface ImageMetadata {
  id: string;
  filename: string;
  url: string;
  original_filename: string;
  size: number;
  width: number;
  height: number;
  mime_type: string;
  category: string;
  tags: string[];
  alt_text: string;
  description: string;
  language: string;
  usage_count: number;
  folder: string;
  created_at: string;
  updated_at: string;
}

const imageCategories = ['general', 'products', 'blog', 'banners', 'icons', 'backgrounds'];

export default function AdminImageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const filename = params.filename as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: 'general',
    tags: [] as string[],
    alt_text: '',
    description: '',
    language: 'en',
  });

  const [newTag, setNewTag] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    fetchImageMetadata();
  }, [filename]);

  const fetchImageMetadata = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/images/metadata?filename=${filename}`);
      const data = await response.json();

      if (data.success && data.metadata && data.metadata.length > 0) {
        const meta = data.metadata[0];
        setMetadata(meta);
        setFormData({
          category: meta.category || 'general',
          tags: Array.isArray(meta.tags) ? meta.tags : [],
          alt_text: meta.alt_text || '',
          description: meta.description || '',
          language: meta.language || 'en',
        });
      } else {
        setError('Image not found');
      }
    } catch (err) {
      console.error('Error fetching image metadata:', err);
      setError('Failed to load image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!metadata) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/images/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          url: metadata.url,
          category: formData.category,
          tags: formData.tags,
          alt_text: formData.alt_text,
          description: formData.description,
          language: formData.language,
          size: metadata.size,
          width: metadata.width,
          height: metadata.height,
          mime_type: metadata.mime_type,
          folder: metadata.folder,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save metadata');
      }

      await fetchImageMetadata();
      alert('Image metadata saved successfully!');
    } catch (error: any) {
      alert(error.message || 'Error saving metadata. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    if (metadata) {
      navigator.clipboard.writeText(metadata.url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleDownload = () => {
    if (metadata) {
      const link = document.createElement('a');
      link.href = metadata.url;
      link.download = metadata.original_filename;
      link.click();
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading image details...</p>
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error || 'Image not found'}</p>
          <Link href="/admin/images">
            <Button>Back to Image Library</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/images">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Image Details</h1>
            <p className="text-slate-600 mt-1">{metadata.original_filename}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleCopyUrl}
          >
            {copiedUrl ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
              <img
                src={metadata.url}
                alt={formData.alt_text || metadata.original_filename}
                className="max-w-full max-h-[600px] object-contain rounded"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Dimensions</p>
                <p className="font-medium">{metadata.width} × {metadata.height} px</p>
              </div>
              <div>
                <p className="text-slate-600">File Size</p>
                <p className="font-medium">{formatFileSize(metadata.size)}</p>
              </div>
              <div>
                <p className="text-slate-600">Type</p>
                <p className="font-medium">{metadata.mime_type}</p>
              </div>
              <div>
                <p className="text-slate-600">Usage</p>
                <p className="font-medium">{metadata.usage_count} times</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Image Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Info */}
            <div className="space-y-3 pb-4 border-b">
              <div>
                <Label>Filename</Label>
                <p className="text-sm text-slate-700 font-mono break-all">{metadata.filename}</p>
              </div>
              <div>
                <Label>Original Filename</Label>
                <p className="text-sm text-slate-700">{metadata.original_filename}</p>
              </div>
              <div>
                <Label>URL</Label>
                <p className="text-sm text-slate-700 font-mono break-all">{metadata.url}</p>
              </div>
              <div>
                <Label>Uploaded</Label>
                <p className="text-sm text-slate-700">{formatDate(metadata.created_at)}</p>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {imageCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text (Accessibility)</Label>
              <Input
                id="altText"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Describe the image for screen readers"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Image description for SEO and internal use"
              />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
