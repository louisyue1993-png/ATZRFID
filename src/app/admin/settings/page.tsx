'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Lock, Globe, Layout, Search, Loader2, CheckCircle2 } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string;
  is_sensitive: boolean;
}

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success && data.settings) {
        setSettings(data.settings);
        setFormData(data.settingsObject);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updates = {
        site_name: formData.site_name,
        site_url: formData.site_url,
        site_description: formData.site_description,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        default_language: formData.default_language,
        languages_enabled: formData.languages_enabled,
      };

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message || 'Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSEO = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updates = {
        seo_default_title: formData.seo_default_title,
        seo_default_description: formData.seo_default_description,
        seo_default_keywords: formData.seo_default_keywords,
      };

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message || 'Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validate passwords
    if (!passwordForm.currentPassword) {
      alert('Please enter your current password');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updates = {
        admin_password: passwordForm.newPassword,
      };

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates,
          currentPassword: passwordForm.currentPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setSaveSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message || 'Error changing password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your admin account and site settings</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Settings saved successfully</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={formData.site_name || ''}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={formData.site_url || ''}
                  onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.site_description || ''}
                  onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contact_email || ''}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contact_phone || ''}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <select
                  id="defaultLanguage"
                  value={formData.default_language || 'en'}
                  onChange={(e) => setFormData({ ...formData, default_language: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Enabled Languages</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(formData.languages_enabled || []).includes('en')}
                      onChange={(e) => {
                        const langs = formData.languages_enabled || ['en'];
                        setFormData({
                          ...formData,
                          languages_enabled: e.target.checked
                            ? [...langs, 'en']
                            : langs.filter((l: string) => l !== 'en'),
                        });
                      }}
                      className="rounded border-slate-300"
                    />
                    <span>English</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(formData.languages_enabled || []).includes('zh')}
                      onChange={(e) => {
                        const langs = formData.languages_enabled || ['en'];
                        setFormData({
                          ...formData,
                          languages_enabled: e.target.checked
                            ? [...langs, 'zh']
                            : langs.filter((l: string) => l !== 'zh'),
                        });
                      }}
                      className="rounded border-slate-300"
                    />
                    <span>中文</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSaveGeneral}
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
                Save General Settings
              </>
            )}
          </Button>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Admin Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Version:</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Framework:</span>
                <span className="font-mono">Next.js 16</span>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <span className="font-mono">{process.env.NODE_ENV || 'development'}</span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="font-mono">Supabase PostgreSQL</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Default Page Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seo_default_title || ''}
                  onChange={(e) => setFormData({ ...formData, seo_default_title: e.target.value })}
                  placeholder="Default title for all pages"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">Default Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seo_default_description || ''}
                  onChange={(e) => setFormData({ ...formData, seo_default_description: e.target.value })}
                  rows={3}
                  placeholder="Default description for search results"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Default Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={Array.isArray(formData.seo_default_keywords)
                    ? formData.seo_default_keywords.join(', ')
                    : formData.seo_default_keywords || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo_default_keywords: e.target.value.split(',').map(k => k.trim())
                  })}
                  placeholder="Comma-separated keywords"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSaveSEO}
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
                Save SEO Settings
              </>
            )}
          </Button>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Appearance customization options coming soon. This will include theme colors, logo upload, favicon settings, and more.
              </p>

              <div className="space-y-2">
                <Label>Theme Preview</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Layout className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Theme customization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
