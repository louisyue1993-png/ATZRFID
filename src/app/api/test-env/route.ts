import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseCredentials } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    protocol: request.nextUrl.protocol,
    timestamp: new Date().toISOString(),
    supabaseUrlConfigured: !!getSupabaseCredentials().url,
  });
}
