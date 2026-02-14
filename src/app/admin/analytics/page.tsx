'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  DollarSign,
  Calendar,
  Loader2
} from 'lucide-react';

interface Stats {
  today?: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    productViews: number;
    ordersCount: number;
    revenue: number;
  };
  week?: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    productViews: number;
    ordersCount: number;
    revenue: number;
  };
  month?: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    productViews: number;
    ordersCount: number;
    revenue: number;
  };
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = 'blue',
    trend
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color?: string;
    trend?: string;
  }) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && (
                <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${colors[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          {trend && (
            <div className="mt-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-600 mt-1">Monitor your website performance and statistics</p>
      </div>

      {/* Today's Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Page Views"
            value={stats.today?.pageViews || 0}
            icon={Eye}
            color="blue"
          />
          <StatCard
            title="Unique Visitors"
            value={stats.today?.uniqueVisitors || 0}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Sessions"
            value={stats.today?.sessions || 0}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Bounce Rate"
            value={stats.today?.bounceRate ? formatPercent(stats.today.bounceRate) : '0%'}
            icon={TrendingUp}
            color="orange"
          />
        </div>
      </div>

      {/* Engagement Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Avg Session Duration"
            value={stats.today?.avgSessionDuration ? formatDuration(stats.today.avgSessionDuration) : '0:00'}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Product Views"
            value={stats.today?.productViews || 0}
            icon={Eye}
            color="purple"
          />
          <StatCard
            title="Pages per Session"
            value={(stats.today?.pageViews || 0) / (stats.today?.sessions || 1) || 0}
            icon={Eye}
            color="green"
          />
        </div>
      </div>

      {/* Business Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Business Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Orders"
            value={stats.today?.ordersCount || 0}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="Revenue"
            value={formatCurrency(stats.today?.revenue || 0)}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(
              stats.today?.ordersCount && stats.today?.ordersCount > 0
                ? (stats.today.revenue || 0) / stats.today.ordersCount
                : 0
            )}
            icon={DollarSign}
            color="purple"
          />
          <StatCard
            title="Conversion Rate"
            value={
              stats.today?.sessions && stats.today.sessions > 0
                ? formatPercent((stats.today.ordersCount || 0) / stats.today.sessions * 100)
                : '0%'
            }
            icon={TrendingUp}
            color="orange"
          />
        </div>
      </div>

      {/* Weekly Comparison */}
      {stats.week && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Total Page Views</p>
                <p className="text-2xl font-bold">{stats.week.pageViews}</p>
                <p className="text-sm text-green-600">Weekly total</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.week.revenue)}</p>
                <p className="text-sm text-green-600">Weekly total</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.week.ordersCount}</p>
                <p className="text-sm text-green-600">Weekly total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Comparison */}
      {stats.month && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Total Page Views</p>
                <p className="text-2xl font-bold">{stats.month.pageViews}</p>
                <p className="text-sm text-blue-600">Monthly total</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.month.revenue)}</p>
                <p className="text-sm text-blue-600">Monthly total</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.month.ordersCount}</p>
                <p className="text-sm text-blue-600">Monthly total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
