// Customers Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/customers - Get all customers with filters
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const client = getSupabaseClient();
    let query = client.from('customers').select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      customers: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/admin/customers - Create new customer
export async function POST(request: NextRequest) {
  // Check authentication
  const isValidSession = getSessionFromCookies(request.cookies) || getSessionFromRequest(request.headers);

  if (!isValidSession) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Generate customer ID
    const customerId = `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const customerData = {
      id: customerId,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      company: body.company || '',
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      zip_code: body.zipCode || '',
      country: body.country || '',
      total_orders: body.totalOrders || 0,
      total_spent: body.totalSpent || 0,
      status: body.status || 'active',
      notes: body.notes || '',
    };

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('customers')
      .insert([customerData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      customer: data,
      message: 'Customer created successfully',
    });
  } catch (error: any) {
    console.error('Create customer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create customer' },
      { status: 500 }
    );
  }
}
