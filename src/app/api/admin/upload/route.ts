// File Upload API for Object Storage
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import sharp from 'sharp';

// POST /api/admin/upload - Upload file to object storage
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
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${random}.${extension}`;
    const filepath = `${folder}/${filename}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get image dimensions using sharp
    let width = 0;
    let height = 0;
    try {
      const metadata = await sharp(buffer).metadata();
      width = metadata.width || 0;
      height = metadata.height || 0;
    } catch (error) {
      console.error('Error getting image dimensions:', error);
    }

    // TODO: Upload to object storage (Supabase Storage or S3)
    // For now, save to public folder as fallback
    const fs = require('fs');
    const path = require('path');
    const publicPath = path.join(process.cwd(), 'public', folder);

    // Create directory if it doesn't exist
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }

    const filePath = path.join(publicPath, filename);
    fs.writeFileSync(filePath, buffer);

    const url = `/${filepath}`;

    // Save metadata to database
    try {
      const metadataResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/admin/images/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        body: JSON.stringify({
          filename,
          url,
          original_filename: file.name,
          size: file.size,
          width,
          height,
          mime_type: file.type,
          folder,
        }),
      });
    } catch (metadataError) {
      console.error('Error saving image metadata:', metadataError);
      // Don't fail the upload if metadata save fails
    }

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
      width,
      height,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
