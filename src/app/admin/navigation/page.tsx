'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Layout,
  Plus,
  Trash2,
  Save,
  Loader2,
  Globe,
  Eye,
  EyeOff,
  ExternalLink,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface NavigationMenu {
  id: number;
  title: string;
  titleZh: string;
  slug: string;
  url: string;
  parentId: number | null;
  order: number;
  language: string;
  published: boolean;
  icon: string;
  openInNewTab: boolean;
}

export default function AdminNavigationPage() {
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showLanguage, setShowLanguage] = useState<'en' | 'zh'>('en');
  const [newMenu, setNewMenu] = useState({
    title: '',
    titleZh: '',
    slug: '',
    url: '',
    parentId: null as number | null,
    order: 0,
    published: true,
    icon: '',
    openInNewTab: false,
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/navigation');
      const data = await response.json();

      if (data.success) {
        setMenus(data.menus);
      }
    } catch (error) {
      console.error('Error fetching navigation menus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMenu = async () => {
    if (!newMenu.title || !newMenu.url) {
      alert('Title and URL are required');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMenu),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create menu');
      }

      alert('Menu created successfully!');
      setNewMenu({
        title: '',
        titleZh: '',
        slug: '',
        url: '',
        parentId: null,
        order: 0,
        published: true,
        icon: '',
        openInNewTab: false,
      });
      await fetchMenus();
    } catch (error: any) {
      alert(error.message || 'Error creating menu. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/navigation', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [id] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete menu');
      }

      alert('Menu deleted successfully!');
      await fetchMenus();
    } catch (error: any) {
      alert(error.message || 'Error deleting menu. Please try again.');
    }
  };

  const handleMoveUp = async (id: number, currentOrder: number) => {
    const menuAbove = menus.find(m => m.order === currentOrder - 1);
    if (!menuAbove) return;

    try {
      const response = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menus: [
            { id, order: currentOrder - 1 },
            { id: menuAbove.id, order: currentOrder },
          ],
        }),
      });

      if (response.ok) {
        await fetchMenus();
      }
    } catch (error) {
      console.error('Error reordering menu:', error);
    }
  };

  const handleMoveDown = async (id: number, currentOrder: number) => {
    const menuBelow = menus.find(m => m.order === currentOrder + 1);
    if (!menuBelow) return;

    try {
      const response = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menus: [
            { id, order: currentOrder + 1 },
            { id: menuBelow.id, order: currentOrder },
          ],
        }),
      });

      if (response.ok) {
        await fetchMenus();
      }
    } catch (error) {
      console.error('Error reordering menu:', error);
    }
  };

  const togglePublished = async (id: number, published: boolean) => {
    try {
      const response = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menus: [{ id, published: !published }],
        }),
      });

      if (response.ok) {
        await fetchMenus();
      }
    } catch (error) {
      console.error('Error updating menu:', error);
    }
  };

  const sortedMenus = [...menus].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Navigation Menu Management</h1>
          <p className="text-slate-600 mt-1">
            {menus.length} menu item{menus.length !== 1 ? 's' : ''}
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

      {/* Add New Menu */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Menu Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input
                value={newMenu.title}
                onChange={(e) => setNewMenu({ ...newMenu, title: e.target.value })}
                placeholder="Home"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (中文)</Label>
              <Input
                value={newMenu.titleZh}
                onChange={(e) => setNewMenu({ ...newMenu, titleZh: e.target.value })}
                placeholder="首页"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={newMenu.slug}
                onChange={(e) => setNewMenu({ ...newMenu, slug: e.target.value })}
                placeholder="home"
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={newMenu.url}
                onChange={(e) => setNewMenu({ ...newMenu, url: e.target.value })}
                placeholder="/"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={newMenu.order}
                onChange={(e) => setNewMenu({ ...newMenu, order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (optional)</Label>
              <Input
                value={newMenu.icon}
                onChange={(e) => setNewMenu({ ...newMenu, icon: e.target.value })}
                placeholder="Home"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="openInNewTab"
                  checked={newMenu.openInNewTab}
                  onChange={(e) => setNewMenu({ ...newMenu, openInNewTab: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="openInNewTab" className="cursor-pointer">Open in New Tab</Label>
              </label>
            </div>
          </div>

          <Button
            onClick={handleAddMenu}
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
                Add Menu Item
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Menu List */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : sortedMenus.length === 0 ? (
            <div className="text-center py-12">
              <Layout className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No menu items found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-blue-400 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(menu.id, menu.order)}
                      disabled={menu.order === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(menu.id, menu.order)}
                      disabled={menu.order === Math.max(...menus.map(m => m.order))}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {showLanguage === 'en' ? menu.title : menu.titleZh || menu.title}
                      </span>
                      {menu.openInNewTab && (
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      )}
                      {menu.icon && (
                        <Badge variant="outline">{menu.icon}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{menu.url}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(menu.id, menu.published)}
                    >
                      {menu.published ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
