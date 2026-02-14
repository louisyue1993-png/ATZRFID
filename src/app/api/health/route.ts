import { NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseCredentials } from '@/storage/database/supabase-client';

// GET /api/health - Check API health and database connection
export async function GET() {
  try {
    // Check environment variables
    let envStatus = 'unknown';
    let supabaseUrl = '';
    
    try {
      const credentials = getSupabaseCredentials();
      envStatus = 'configured';
      supabaseUrl = credentials.url;
    } catch (error: any) {
      envStatus = `error: ${error.message}`;
    }

    // Check database connection
    let dbStatus = 'unknown';
    let productCount = 0;
    
    try {
      const client = getSupabaseClient();
      const { count, error } = await client
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        dbStatus = `error: ${error.message}`;
      } else {
        dbStatus = 'connected';
        productCount = count || 0;
      }
    } catch (error: any) {
      dbStatus = `error: ${error.message}`;
    }

    return NextResponse.json({
      success: true,
      status: 'healthy',
      environment: {
        envStatus,
        supabaseUrl: supabaseUrl ? '***' : '',
      },
      database: {
        dbStatus,
        productCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
