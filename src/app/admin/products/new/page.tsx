'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  ArrowLeft,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { productCategories } from '@/data/productCategories';
import ImagePicker from '@/components/admin/ImagePicker';

export default function AdminProductNewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    fullDescription: '',
    shortDescription: '',
    price: '',
    priceRange: '',
    category: '',
    subCategory: '',
    frequency: '',
    chip: '',
    readRange: '',
    image: '',
    stockStatus: 'InStock' as 'InStock' | 'OutOfStock' | 'PreOrder',
    rating: 4.5,
    reviewCount: 0,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.id.trim()) {
        throw new Error('Product ID is required');
      }
      if (!formData.name.trim()) {
        throw new Error('Product name is required');
      }
      if (!formData.price.trim()) {
        throw new Error('Price is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }
      if (!formData.image) {
        throw new Error('Product image is required');
      }

      // Prepare data for API
      const apiData = {
        ...formData,
        id: formData.id.trim(),
        name: formData.name.trim(),
        title: formData.name.trim(),
        description: formData.description || formData.fullDescription || '',
        shortDescription: formData.shortDescription?.trim() || '',
        fullDescription: formData.fullDescription?.trim() || formData.description?.trim() || '',
        price: formData.price.trim(),
        priceRange: formData.priceRange?.trim() || '',
        category: formData.category,
        subCategory: formData.subCategory?.trim() || '',
        specifications: {},
        features: [],
        applications: [],
        keywords: [],
        seoKeywords: [],
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      alert(error.message || 'Error saving product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
            <p className="text-slate-600 mt-1">Create a new product listing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Product ID *</Label>
                <Input
                  id="id"
                  placeholder="e.g., uhf-001"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., UHF RFID Adhesive Label"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                placeholder="Brief description for listing cards"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed product description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                required
              />
            </div>

            {/* Pricing & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  placeholder="e.g., From $0.08"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  {productCategories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  placeholder="e.g., UHF 860-960MHz"
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chip">Chip</Label>
                <Input
                  id="chip"
                  placeholder="e.g., Impinj Monza R6"
                  value={formData.chip}
                  onChange={(e) => handleInputChange('chip', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readRange">Read Range</Label>
                <Input
                  id="readRange"
                  placeholder="e.g., 3-5 meters"
                  value={formData.readRange}
                  onChange={(e) => handleInputChange('readRange', e.target.value)}
                />
              </div>
            </div>

            {/* Image */}
            <ImagePicker
              value={formData.image}
              onChange={(url) => handleInputChange('image', url)}
              folder="products"
            />

            {/* Stock Status */}
            <div className="space-y-2">
              <Label htmlFor="stockStatus">Stock Status</Label>
              <select
                id="stockStatus"
                value={formData.stockStatus}
                onChange={(e) => handleInputChange('stockStatus', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="InStock">In Stock</option>
                <option value="OutOfStock">Out of Stock</option>
                <option value="PreOrder">Pre-Order</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Product'}
          </Button>
          <Link href="/admin/products">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
