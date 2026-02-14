'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  ArrowLeft,
  Package,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { productCategories } from '@/data/productCategories';
import ImagePicker from '@/components/admin/ImagePicker';

interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  priceRange: string;
  frequency: string;
  chip: string;
  memory: string;
  readRange: string;
  protocol: string;
  category: string;
  subCategory: string;
  badge?: string;
  moq: string;
  deliveryTime: string;
  specifications: Record<string, string>;
  features: string[];
  applications: string[];
  keywords: string[];
  seoKeywords: string[];
  stockStatus: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating: number;
  reviewCount: number;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    priceRange: '',
    category: '',
    subCategory: '',
    frequency: '',
    chip: '',
    memory: '',
    readRange: '',
    protocol: '',
    badge: '',
    moq: '',
    deliveryTime: '',
    stockStatus: 'InStock' as 'InStock' | 'OutOfStock' | 'PreOrder',
    rating: 4.5,
    reviewCount: 0,
    image: '',
  });

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products?id=${productId}`);
        const data = await response.json();
        
        if (data.success && data.products && data.products.length > 0) {
          const product = data.products[0];
          setFormData({
            name: product.name || '',
            description: product.description || '',
            shortDescription: product.shortDescription || '',
            fullDescription: product.fullDescription || '',
            price: product.price || '',
            priceRange: product.priceRange || '',
            category: product.category || '',
            subCategory: product.subCategory || '',
            frequency: product.frequency || '',
            chip: product.chip || '',
            memory: product.memory || '',
            readRange: product.readRange || '',
            protocol: product.protocol || '',
            badge: product.badge || '',
            moq: product.moq || '',
            deliveryTime: product.deliveryTime || '',
            stockStatus: product.stockStatus || 'InStock',
            rating: product.rating || 4.5,
            reviewCount: product.reviewCount || 0,
            image: product.image || '',
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    }
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Product name is required');
      }
      if (!formData.price.trim()) {
        throw new Error('Price is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }

      // Prepare data for API
      const apiData = {
        ...formData,
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

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(data.error || 'Failed to update product');
      }

      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      alert(error.message || 'Error updating product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
            <p className="text-slate-600 mt-1">Update product information</p>
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
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., UHF RFID Adhesive Label"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

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
              <Label htmlFor="fullDescription">Full Description *</Label>
              <Textarea
                id="fullDescription"
                placeholder="Detailed product description"
                value={formData.fullDescription}
                onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                rows={5}
                required
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="subCategory">Subcategory</Label>
                <Input
                  id="subCategory"
                  placeholder="e.g., adhesive-labels"
                  value={formData.subCategory}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="memory">Memory</Label>
                <Input
                  id="memory"
                  placeholder="e.g., 96-bit EPC"
                  value={formData.memory}
                  onChange={(e) => handleInputChange('memory', e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Input
                  id="protocol"
                  placeholder="e.g., ISO 18000-6C"
                  value={formData.protocol}
                  onChange={(e) => handleInputChange('protocol', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  placeholder="e.g., Popular"
                  value={formData.badge}
                  onChange={(e) => handleInputChange('badge', e.target.value)}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range</Label>
                <Input
                  id="priceRange"
                  placeholder="e.g., $0.05 - $0.15"
                  value={formData.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moq">MOQ</Label>
                <Input
                  id="moq"
                  placeholder="e.g., 100"
                  value={formData.moq}
                  onChange={(e) => handleInputChange('moq', e.target.value)}
                />
              </div>
            </div>

            {/* Image Upload */}
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
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
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
