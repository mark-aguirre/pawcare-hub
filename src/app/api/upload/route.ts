import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const path = join(process.cwd(), 'public', 'uploads', filename);

      await writeFile(path, buffer);
      uploadedFiles.push({
        originalName: file.name,
        filename: filename,
        path: `/uploads/${filename}`,
        size: file.size
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}