// Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/analytics - Get website statistics
export async function GET(request: NextRequest) {
  // Check authentication
  const isValidSession = getSessionFromCookies(request.cookies) || getSessionFromRequest(request.headers);

  if (!isValidSession) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const client = getSupabaseClient();

    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Get start of week (7 days ago)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    // Get start of month (30 days ago)
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];

    // Fetch today's stats
    const { data: todayStats } = await client
      .from('website_statistics')
      .select('*')
      .eq('date', todayStr)
      .single();

    // Fetch week stats
    const { data: weekData } = await client
      .from('website_statistics')
      .select('*')
      .gte('date', weekAgoStr);

    // Fetch month stats
    const { data: monthData } = await client
      .from('website_statistics')
      .select('*')
      .gte('date', monthAgoStr);

    // Calculate aggregates
    const weekStats = weekData?.reduce(
      (acc: any, curr: any) => ({
        pageViews: (acc.pageViews || 0) + (curr.page_views || 0),
        uniqueVisitors: (acc.uniqueVisitors || 0) + (curr.unique_visitors || 0),
        sessions: (acc.sessions || 0) + (curr.sessions || 0),
        bounceRate: (acc.bounceRate || 0) + (curr.bounce_rate || 0),
        avgSessionDuration: (acc.avgSessionDuration || 0) + (curr.avg_session_duration || 0),
        productViews: (acc.productViews || 0) + (curr.product_views || 0),
        ordersCount: (acc.ordersCount || 0) + (curr.orders_count || 0),
        revenue: (acc.revenue || 0) + parseFloat(curr.revenue || 0),
      }),
      {}
    );

    // Calculate average for week stats
    if (weekData && weekData.length > 0) {
      weekStats.bounceRate = weekStats.bounceRate / weekData.length;
      weekStats.avgSessionDuration = weekStats.avgSessionDuration / weekData.length;
    }

    const monthStats = monthData?.reduce(
      (acc: any, curr: any) => ({
        pageViews: (acc.pageViews || 0) + (curr.page_views || 0),
        uniqueVisitors: (acc.uniqueVisitors || 0) + (curr.unique_visitors || 0),
        sessions: (acc.sessions || 0) + (curr.sessions || 0),
        bounceRate: (acc.bounceRate || 0) + (curr.bounce_rate || 0),
        avgSessionDuration: (acc.avgSessionDuration || 0) + (curr.avg_session_duration || 0),
        productViews: (acc.productViews || 0) + (curr.product_views || 0),
        ordersCount: (acc.ordersCount || 0) + (curr.orders_count || 0),
        revenue: (acc.revenue || 0) + parseFloat(curr.revenue || 0),
      }),
      {}
    );

    // Calculate average for month stats
    if (monthData && monthData.length > 0) {
      monthStats.bounceRate = monthStats.bounceRate / monthData.length;
      monthStats.avgSessionDuration = monthStats.avgSessionDuration / monthData.length;
    }

    return NextResponse.json({
      success: true,
      stats: {
        today: todayStats ? {
          pageViews: todayStats.page_views || 0,
          uniqueVisitors: todayStats.unique_visitors || 0,
          sessions: todayStats.sessions || 0,
          bounceRate: parseFloat(todayStats.bounce_rate || 0),
          avgSessionDuration: todayStats.avg_session_duration || 0,
          productViews: todayStats.product_views || 0,
          ordersCount: todayStats.orders_count || 0,
          revenue: parseFloat(todayStats.revenue || 0),
        } : {
          pageViews: 0,
          uniqueVisitors: 0,
          sessions: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          productViews: 0,
          ordersCount: 0,
          revenue: 0,
        },
        week: weekStats,
        month: monthStats,
      },
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
