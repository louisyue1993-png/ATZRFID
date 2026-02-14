'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Home, Package, FileText, Eye, Globe, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface PageMeta {
  updated_at?: string;
  [key: string]: any;
}

interface PageContent {
  heroTitle?: string;
  heroDescription?: string;
  features?: string[];
  stats?: Array<{ label: string; value: string }>;
  pageTitle?: string;
  pageDescription?: string;
  [key: string]: any;
}

interface PageData {
  content: PageContent;
  meta: PageMeta;
  isNew: boolean;
}

export default function AdminPagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'zh'>('en');
  const [showPreview, setShowPreview] = useState(false);

  // Page content state
  const [pages, setPages] = useState<Record<string, PageData>>({
    home: { content: {}, meta: {}, isNew: false },
    products: { content: {}, meta: {}, isNew: false },
    blog: { content: {}, meta: {}, isNew: false },
  });

  // Fetch page content on mount and language change
  useEffect(() => {
    fetchPageContent();
  }, [selectedLanguage]);

  const fetchPageContent = async () => {
    try {
      const pageKeys = ['home', 'products', 'blog'];
      const responses = await Promise.all(
        pageKeys.map(key =>
          fetch(`/api/admin/pages/content?pageKey=${key}&language=${selectedLanguage}`)
        )
      );

      const pagesData: any = {};
      for (let i = 0; i < pageKeys.length; i++) {
        const response = await responses[i].json();
        pagesData[pageKeys[i]] = response;
      }

      setPages(pagesData);
    } catch (error) {
      console.error('Error fetching page content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (pageKey: string, content: any, meta: any = {}) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/pages/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageKey,
          language: selectedLanguage,
          content,
          meta,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      alert(`${pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} page content saved successfully!`);

      // Refresh to get updated data
      await fetchPageContent();
    } catch (error: any) {
      alert(error.message || 'Error saving content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePageContent = (pageKey: string, content: any) => {
    setPages(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey as keyof typeof prev],
        content,
      },
    }));
  };

  const renderEditor = (pageKey: string, icon: any) => {
    const page = pages[pageKey as keyof typeof pages];
    const content = page.content || {};

    return (
      <div className="space-y-4">
        {/* Page Metadata */}
        <div className="flex items-center gap-3">
          {icon}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} Page
            </h3>
            <p className="text-sm text-slate-500">
              {page.isNew ? 'Using default content' : 'Last edited: ' + (page.meta?.updated_at || 'Unknown')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {page.isNew && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                New Content
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        {showPreview ? (
          // Preview Mode
          <Card className="bg-slate-50">
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold mb-4">
                  {content.heroTitle || content.pageTitle}
                </h1>
                <p className="text-lg text-slate-600 mb-6">
                  {content.heroDescription || content.pageDescription}
                </p>
                {content.features && content.features.length > 0 && (
                  <ul className="list-disc pl-6 space-y-2">
                    {content.features.map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                )}
                {content.stats && content.stats.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {content.stats.map((stat: any, idx: number) => (
                      <div key={idx} className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                        <div className="text-sm text-slate-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Edit Mode
          <>
            {pageKey === 'home' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hero Title</label>
                  <Input
                    value={content.heroTitle || ''}
                    onChange={(e) => updatePageContent('home', { ...content, heroTitle: e.target.value })}
                    placeholder="Enter hero title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hero Description</label>
                  <Textarea
                    value={content.heroDescription || ''}
                    onChange={(e) => updatePageContent('home', { ...content, heroDescription: e.target.value })}
                    rows={3}
                    placeholder="Enter hero description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Features (one per line)</label>
                  <Textarea
                    value={(content.features || []).join('\n')}
                    onChange={(e) => updatePageContent('home', {
                      ...content,
                      features: e.target.value.split('\n').filter(f => f.trim())
                    })}
                    rows={5}
                    placeholder="Enter features, one per line"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stats (JSON format)</label>
                  <Textarea
                    value={JSON.stringify(content.stats || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        updatePageContent('home', { ...content, stats: parsed });
                      } catch (err) {
                        // Ignore JSON parse errors during typing
                      }
                    }}
                    rows={6}
                    placeholder='[{"label": "Years", "value": "10+"}]'
                    className="font-mono text-sm"
                  />
                </div>
              </>
            )}

            {pageKey === 'products' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Title</label>
                  <Input
                    value={content.pageTitle || ''}
                    onChange={(e) => updatePageContent('products', { ...content, pageTitle: e.target.value })}
                    placeholder="Enter page title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Description</label>
                  <Textarea
                    value={content.pageDescription || ''}
                    onChange={(e) => updatePageContent('products', { ...content, pageDescription: e.target.value })}
                    rows={3}
                    placeholder="Enter page description"
                  />
                </div>
              </>
            )}

            {pageKey === 'blog' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Title</label>
                  <Input
                    value={content.pageTitle || ''}
                    onChange={(e) => updatePageContent('blog', { ...content, pageTitle: e.target.value })}
                    placeholder="Enter page title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Description</label>
                  <Textarea
                    value={content.pageDescription || ''}
                    onChange={(e) => updatePageContent('blog', { ...content, pageDescription: e.target.value })}
                    rows={3}
                    placeholder="Enter page description"
                  />
                </div>
              </>
            )}

            <Button
              onClick={() => handleSave(pageKey, content, page.meta)}
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
                  Save {pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} Page
                </>
              )}
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Page Content</h1>
          <p className="text-slate-600 mt-1">Edit and manage content for your website pages</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            <Globe className="h-3 w-3 mr-1" />
            {selectedLanguage === 'en' ? 'English' : '中文'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPageContent}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedLanguage(selectedLanguage === 'en' ? 'zh' : 'en')}
          >
            {selectedLanguage === 'en' ? 'Switch to 中文' : 'Switch to English'}
          </Button>
        </div>
      </div>

      {/* Language indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <Globe className="h-5 w-5" />
          <span className="font-medium">
            Editing in: <strong>{selectedLanguage === 'en' ? 'English' : '中文 (Chinese)'}</strong>
          </span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          You are currently editing the {selectedLanguage === 'en' ? 'English' : 'Chinese'} version of the content.
          Use the language switch button above to edit other languages.
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading page content...</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {renderEditor('home', <Home className="h-5 w-5 text-blue-600" />)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {renderEditor('products', <Package className="h-5 w-5 text-blue-600" />)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {renderEditor('blog', <FileText className="h-5 w-5 text-blue-600" />)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
