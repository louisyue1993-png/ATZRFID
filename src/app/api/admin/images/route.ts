// Image Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

interface FileInfo {
  name: string;
  url: string;
  size: number;
  created: string;
  type: string;
}

// GET /api/admin/images - List all uploaded images
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
    const folder = searchParams.get('folder') || 'products';
    
    const publicDir = join(process.cwd(), 'public', folder);
    const files: FileInfo[] = [];
    
    // Check if directory exists
    if (fs.existsSync(publicDir)) {
      const entries = await readdir(publicDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = join(publicDir, entry.name);
          const stats = await stat(filePath);
          
          // Get file extension to determine type
          const ext = entry.name.split('.').pop()?.toLowerCase() || '';
          const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
          
          if (isImage) {
            files.push({
              name: entry.name,
              url: `/${folder}/${entry.name}`,
              size: stats.size,
              created: stats.mtime.toISOString(),
              type: ext,
            });
          }
        }
      }
    }
    
    // Sort by created date (newest first)
    files.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    
    return NextResponse.json({
      success: true,
      files,
      count: files.length,
    });
  } catch (error: any) {
    console.error('List images error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list images' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/images - Delete images
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
    const { urls, folder } = body;
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Image URLs are required' },
        { status: 400 }
      );
    }
    
    let deletedCount = 0;
    
    for (const url of urls) {
      try {
        // Extract filename from URL
        const filename = url.split('/').pop();
        if (!filename) continue;
        
        const folderPath = folder || 'products';
        const filePath = join(process.cwd(), 'public', folderPath, filename);
        
        // Delete file
        await unlink(filePath);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete ${url}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} image(s)`,
    });
  } catch (error: any) {
    console.error('Delete images error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete images' },
      { status: 500 }
    );
  }
}
