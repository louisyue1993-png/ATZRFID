'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Upload, X, Search, Check } from 'lucide-react';

interface ImagePickerProps {
  value: string;
  onChange: (imageUrl: string) => void;
  folder?: string;
}

interface StoredImage {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
}

export default function ImagePicker({ value, onChange, folder = 'products' }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<StoredImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch images when dialog opens
  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  // Filter images based on search term
  useEffect(() => {
    const filtered = images.filter(img =>
      img.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredImages(filtered);
  }, [searchTerm, images]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/images?folder=${folder}`);
      const data = await response.json();

      if (data.success && data.files) {
        // Transform files to images format
        const transformedImages = data.files.map((file: any) => ({
          id: file.name,
          name: file.name,
          url: file.url,
          size: file.size,
          created_at: file.created,
        }));
        setImages(transformedImages);
      } else if (data.error === 'Unauthorized') {
        setError('Please login to access image library');
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Refresh images list
        await fetchImages();
        // Select the newly uploaded image
        onChange(data.url);
        setOpen(false);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onChange(imageUrl);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>Product Image</Label>
      <div className="flex gap-3">
        {/* Image Preview */}
        <div className="flex-1">
          {value ? (
            <div className="relative group">
              <img
                src={value}
                alt="Product preview"
                className="w-full h-32 object-cover rounded-lg border border-slate-300"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onChange('')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-slate-400" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Upload Button */}
          <div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>

          {/* Select from Library Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="w-full">
                <ImageIcon className="h-4 w-4 mr-2" />
                Library
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Select from Image Library</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Upload New Button */}
                <div>
                  <input
                    type="file"
                    id="library-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('library-upload')?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Image
                  </Button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="text-slate-600 mt-2">Loading images...</p>
                  </div>
                )}

                {/* Images Grid */}
                {!loading && filteredImages.length === 0 && !error && (
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">
                      {searchTerm ? 'No images match your search' : 'No images in library'}
                    </p>
                  </div>
                )}

                {!loading && filteredImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
                    {filteredImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          value === image.url
                            ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                            : 'border-slate-300 hover:border-blue-400'
                        }`}
                        onClick={() => handleImageSelect(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          {value === image.url && (
                            <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 truncate">
                            {image.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

// Import Label
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}
