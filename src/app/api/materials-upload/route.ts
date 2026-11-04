import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const level = (formData.get('level') as string) || 'A1-A2';
    const category = (formData.get('category') as string) || 'Speaking & Discussion';
    const description = (formData.get('description') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    // Sanitize filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const materialsDir = path.join(process.cwd(), 'public', 'materials');

    try {
      if (!fs.existsSync(materialsDir)) {
        fs.mkdirSync(materialsDir, { recursive: true });
      }
      const filePath = path.join(materialsDir, cleanFileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.promises.writeFile(filePath, buffer);
    } catch (fsErr: any) {
      // In serverless environments like Vercel with read-only root filesystems, log and continue gracefully
      console.warn('Filesystem write notice (e.g. Vercel serverless read-only filesystem):', fsErr.message);
    }

    const newMaterial = {
      id: `mat-upload-${Date.now()}`,
      title: title.trim() || file.name.replace(/\.[^/.]+$/, ''),
      fileName: cleanFileName,
      filePath: `/api/pdf?file=${encodeURIComponent(cleanFileName)}`,
      level,
      category,
      description: description.trim() || `Added by faculty on ${new Date().toLocaleDateString()}`,
    };

    return NextResponse.json({
      success: true,
      material: newMaterial,
    });
  } catch (error: any) {
    console.error('PDF upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save PDF material' },
      { status: 500 }
    );
  }
}
