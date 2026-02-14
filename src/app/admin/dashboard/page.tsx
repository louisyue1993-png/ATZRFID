import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/lib/blog-data';
import { getDashboardStats } from './dashboard-stats';

export default async function AdminDashboard() {
  // Get real stats from database
  const statsData = await getDashboardStats();
  const totalProducts = statsData.products || 0;
  const recentProducts = statsData.recentProducts || [];
  const totalBlogPosts = getBlogPosts().length;

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/products',
    },
    {
      title: 'Blog Posts',
      value: totalBlogPosts,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/blog',
    },
    {
      title: 'Total Views',
      value: '1,234',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '#',
    },
    {
      title: 'This Month',
      value: '+15%',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      href: '#',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      icon: Package,
      href: '/admin/products/new',
      color: 'bg-blue-600',
    },
    {
      title: 'Write Blog Post',
      description: 'Create a new blog article',
      icon: FileText,
      href: '/admin/blog/new',
      color: 'bg-green-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${action.color} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Products</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-600">{product.category}</p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-600">
                  <p>No products yet. Add your first product to get started!</p>
                  <Link href="/admin/products/new" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block">
                    Add Product →
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Link href="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all products →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
