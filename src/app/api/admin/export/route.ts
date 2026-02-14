import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/export - Export data
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
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'products'; // products, blog, all
    const format = searchParams.get('format') || 'json'; // json, csv

    const client = getSupabaseClient();

    let data: any[] = [];
    let filename = '';

    if (type === 'products' || type === 'all') {
      const { data: products, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      data = [...data, ...products];
    }

    if (type === 'blog' || type === 'all') {
      const { data: blogs, error } = await client
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      data = [...data, ...blogs];
    }

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        return NextResponse.json({ error: 'No data to export' }, { status: 400 });
      }

      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape CSV values
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        )
      ];

      const csvContent = csvRows.join('\n');
      filename = `${type}_export_${Date.now()}.csv`;

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } else {
      // JSON format
      filename = `${type}_export_${Date.now()}.json`;

      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Export failed' },
      { status: 500 }
    );
  }
}
