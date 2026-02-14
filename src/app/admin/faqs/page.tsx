'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  HelpCircle,
  Plus,
  Trash2,
  Save,
  Loader2,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  questionZh: string;
  answer: string;
  answerZh: string;
  category: string;
  language: string;
  order: number;
  published: boolean;
}

const faqCategories = ['General', 'Products', 'Orders', 'Shipping', 'Payments', 'Returns', 'Technical'];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLanguage, setShowLanguage] = useState<'en' | 'zh'>('en');
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    questionZh: '',
    answer: '',
    answerZh: '',
    category: 'General',
    order: 0,
    published: true,
  });

  useEffect(() => {
    fetchFAQs();
  }, [selectedCategory]);

  const fetchFAQs = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
      });

      const response = await fetch(`/api/admin/faqs?${params}`);
      const data = await response.json();

      if (data.success) {
        setFaqs(data.faqs);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFAQ = async () => {
    if (!newFAQ.question || !newFAQ.answer) {
      alert('Question and answer are required');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newFAQ.question,
          questionZh: newFAQ.questionZh,
          answer: newFAQ.answer,
          answerZh: newFAQ.answerZh,
          category: newFAQ.category,
          order: newFAQ.order,
          published: newFAQ.published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create FAQ');
      }

      alert('FAQ created successfully!');
      setNewFAQ({
        question: '',
        questionZh: '',
        answer: '',
        answerZh: '',
        category: 'General',
        order: 0,
        published: true,
      });
      await fetchFAQs();
    } catch (error: any) {
      alert(error.message || 'Error creating FAQ. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/faqs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [id] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete FAQ');
      }

      alert('FAQ deleted successfully!');
      await fetchFAQs();
    } catch (error: any) {
      alert(error.message || 'Error deleting FAQ. Please try again.');
    }
  };

  const handleTogglePublished = async (id: number, published: boolean) => {
    try {
      const response = await fetch('/api/admin/faqs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faqs: [{ id, published: !published }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update FAQ');
      }

      await fetchFAQs();
    } catch (error: any) {
      alert(error.message || 'Error updating FAQ. Please try again.');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      General: 'bg-gray-100 text-gray-800',
      Products: 'bg-blue-100 text-blue-800',
      Orders: 'bg-green-100 text-green-800',
      Shipping: 'bg-purple-100 text-purple-800',
      Payments: 'bg-yellow-100 text-yellow-800',
      Returns: 'bg-orange-100 text-orange-800',
      Technical: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">FAQ Management</h1>
          <p className="text-slate-600 mt-1">
            {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <Globe className="h-3 w-3 mr-1" />
            {showLanguage === 'en' ? 'English' : '中文'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLanguage(showLanguage === 'en' ? 'zh' : 'en')}
          >
            Switch to {showLanguage === 'en' ? '中文' : 'English'}
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {faqCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Add New FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={newFAQ.category}
                onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {faqCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={newFAQ.order}
                onChange={(e) => setNewFAQ({ ...newFAQ, order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Question (English)</Label>
            <Input
              value={newFAQ.question}
              onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
              placeholder="Enter question in English"
            />
          </div>

          <div className="space-y-2">
            <Label>Question (中文)</Label>
            <Input
              value={newFAQ.questionZh}
              onChange={(e) => setNewFAQ({ ...newFAQ, questionZh: e.target.value })}
              placeholder="输入中文问题"
            />
          </div>

          <div className="space-y-2">
            <Label>Answer (English)</Label>
            <Textarea
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
              rows={4}
              placeholder="Enter answer in English"
            />
          </div>

          <div className="space-y-2">
            <Label>Answer (中文)</Label>
            <Textarea
              value={newFAQ.answerZh}
              onChange={(e) => setNewFAQ({ ...newFAQ, answerZh: e.target.value })}
              rows={4}
              placeholder="输入中文答案"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={newFAQ.published}
              onChange={(e) => setNewFAQ({ ...newFAQ, published: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <Button
            onClick={handleAddFAQ}
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
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* FAQs List */}
      <Card>
        <CardHeader>
          <CardTitle>FAQs List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No FAQs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(faq.category)}>
                          {faq.category}
                        </Badge>
                        <Badge variant="outline">
                          Order: {faq.order}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublished(faq.id, faq.published)}
                        >
                          {faq.published ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                      <h3 className="font-semibold text-lg">
                        {showLanguage === 'en' ? faq.question : faq.questionZh || faq.question}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-slate-600">
                    {showLanguage === 'en' ? faq.answer : faq.answerZh || faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
