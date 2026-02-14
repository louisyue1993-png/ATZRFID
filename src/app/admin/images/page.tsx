'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Eye,
  Filter
} from 'lucide-react';

interface ImageFile {
  name: string;
  url: string;
  size: number;
  created: string;
  type: string;
  category?: string;
  tags?: string[];
}

const imageCategories = ['all', 'general', 'products', 'blog', 'banners', 'icons', 'backgrounds'];

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch images
  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/images?folder=uploads');
      const data = await response.json();

      if (data.success && data.files) {
        setImages(data.files);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'uploads');

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      alert('Images uploaded successfully!');
      await fetchImages();
    } catch (error: any) {
      alert(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleBatchDelete = async () => {
    if (selectedImages.size === 0) {
      alert('Please select at least one image to delete.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedImages.size} image(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch('/api/admin/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: Array.from(selectedImages),
          folder: 'uploads',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete images');
      }

      alert(`Successfully deleted ${selectedImages.size} image(s)!`);
      await fetchImages();
      setSelectedImages(new Set());
    } catch (error: any) {
      alert(error.message || 'Error deleting images. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleImageSelection = (url: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(url)) {
      newSelection.delete(url);
    } else {
      newSelection.add(url);
    }
    setSelectedImages(newSelection);
  };

  const toggleSelectAll = () => {
    const filteredImages = getFilteredImages();
    if (selectedImages.size === filteredImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredImages.map(img => img.url)));
    }
  };

  const getFilteredImages = () => {
    let filtered = images;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    // Filter by search term
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = filtered.filter(img =>
        img.name.toLowerCase().includes(lowerFilter) ||
        (img.tags && img.tags.some(tag => tag.toLowerCase().includes(lowerFilter)))
      );
    }

    return filtered;
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
    });
  };

  const getFilenameFromUrl = (url: string) => {
    return url.split('/').pop() || url;
  };

  const filteredImages = getFilteredImages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Image Library</h1>
          <p className="text-slate-600 mt-1">
            {images.length} image{images.length !== 1 ? 's' : ''}
            {selectedImages.size > 0 && ` (${selectedImages.size} selected)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedImages.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBatchDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete (${selectedImages.size})`}
            </Button>
          )}
          <Button
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </>
            )}
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search images..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {imageCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={fetchImages}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading images...</p>
          </CardContent>
        </Card>
      )}

      {/* Images Grid */}
      {!isLoading && (
        <>
          {/* Select All */}
          {filteredImages.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedImages.size === filteredImages.length && filteredImages.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Select all ({filteredImages.length})</span>
            </label>
          )}

          {/* Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.url}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImages.has(image.url)
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
                onClick={() => toggleImageSelection(image.url)}
              >
                <div className="aspect-square bg-slate-100 relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Checkbox overlay */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.url)}
                      onChange={() => toggleImageSelection(image.url)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {/* Category badge */}
                  {image.category && image.category !== 'general' && (
                    <div className="absolute top-2 right-2">
                      <Badge className="text-xs bg-black/70 text-white">
                        {image.category}
                      </Badge>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link
                      href={`/admin/images/${getFilenameFromUrl(image.url)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="secondary" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs text-slate-700 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatFileSize(image.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No images found</h3>
                <p className="text-slate-600 mb-4">
                  {filter || selectedCategory !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by uploading your first image'}
                </p>
                <Button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
