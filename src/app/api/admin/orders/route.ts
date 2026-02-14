// Orders Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/orders - Get all orders with filters
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
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const client = getSupabaseClient();
    let query = client.from('orders').select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus);
    }
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }
    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', new Date(endDate).toISOString());
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
      orders: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/admin/orders - Create new order
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

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const orderData = {
      order_number: orderNumber,
      customer_id: body.customerId || 'guest',
      customer_name: body.customerName,
      customer_email: body.customerEmail,
      customer_phone: body.customerPhone || '',
      shipping_address: body.shippingAddress,
      billing_address: body.billingAddress || body.shippingAddress,
      status: body.status || 'pending',
      subtotal: body.subtotal || 0,
      tax: body.tax || 0,
      shipping: body.shipping || 0,
      total: body.total || 0,
      currency: body.currency || 'USD',
      notes: body.notes || '',
      items: JSON.stringify(body.items || []),
      payment_method: body.paymentMethod,
      payment_status: body.paymentStatus || 'unpaid',
      tracking_number: body.trackingNumber || '',
    };

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      order: data,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/orders - Batch update orders
export async function PUT(request: NextRequest) {
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
    const { orderIds, updates } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Order IDs are required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('orders')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .in('id', orderIds)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Updated ${data.length} orders`,
      orders: data,
    });
  } catch (error: any) {
    console.error('Batch update orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update orders' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/orders - Batch delete orders
export async function DELETE(request: NextRequest) {
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
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Order IDs are required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('orders')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} order(s)`,
    });
  } catch (error: any) {
    console.error('Batch delete orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete orders' },
      { status: 500 }
    );
  }
}
