import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/admin/products/bulk - Batch operations on products
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
    const { action, productIds, updates } = await request.json();

    if (!action || !productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Invalid request. Action and productIds array are required.' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    switch (action) {
      case 'delete':
        // Batch delete
        const { error: deleteError } = await client
          .from('products')
          .delete()
          .in('id', productIds);

        if (deleteError) throw deleteError;
        
        return NextResponse.json({
          success: true,
          message: `Deleted ${productIds.length} products`,
          deletedCount: productIds.length,
        });

      case 'update':
        // Batch update
        const { data: updatedProducts, error: updateError } = await client
          .from('products')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .in('id', productIds)
          .select();

        if (updateError) throw updateError;
        
        return NextResponse.json({
          success: true,
          message: `Updated ${updatedProducts.length} products`,
          updatedCount: updatedProducts.length,
          products: updatedProducts,
        });

      case 'publish':
        // Batch publish
        const { data: publishedProducts, error: publishError } = await client
          .from('products')
          .update({ stockStatus: 'InStock', updated_at: new Date().toISOString() })
          .in('id', productIds)
          .select();

        if (publishError) throw publishError;
        
        return NextResponse.json({
          success: true,
          message: `Published ${publishedProducts.length} products`,
          publishedCount: publishedProducts.length,
        });

      case 'unpublish':
        // Batch unpublish
        const { data: unpublishedProducts, error: unpublishError } = await client
          .from('products')
          .update({ stockStatus: 'OutOfStock', updated_at: new Date().toISOString() })
          .in('id', productIds)
          .select();

        if (unpublishError) throw unpublishError;
        
        return NextResponse.json({
          success: true,
          message: `Unpublished ${unpublishedProducts.length} products`,
          unpublishedCount: unpublishedProducts.length,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: delete, update, publish, unpublish.' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to perform batch operation' },
      { status: 500 }
    );
  }
}
