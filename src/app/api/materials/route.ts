import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('study_materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase study_materials GET notice:', error.message);
      return NextResponse.json({ materials: [] });
    }

    const mapped = (data || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      fileName: m.file_name,
      filePath: m.file_url,
      level: m.cefr_level || 'A1-A2',
      category: m.category || 'Speaking & Discussion',
      description: m.description,
      isCustom: true,
    }));

    return NextResponse.json({ materials: mapped });
  } catch (err: any) {
    console.error('Materials fetch error:', err);
    return NextResponse.json({ materials: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // A. Direct JSON Metadata Registration (Used when client uploads directly to Supabase Storage, bypassing Vercel 4.5MB limit)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { title, fileName, fileUrl, level, category, description } = body;

      if (!fileUrl) {
        return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
      }

      const timestamp = Date.now();
      const materialId = `mat-upload-${timestamp}`;
      const cleanTitle = (title || '').trim() || (fileName || 'study_material.pdf').replace(/\.[^/.]+$/, '');
      const cleanFileName = (fileName || `${cleanTitle}.pdf`).replace(/[^a-zA-Z0-9._-]/g, '_');

      const { error: dbError } = await supabaseServer.from('study_materials').insert([
        {
          id: materialId,
          title: cleanTitle,
          file_name: cleanFileName,
          file_url: fileUrl,
          category: category || 'Speaking & Discussion',
          cefr_level: level || 'A1-A2',
          description: description?.trim() || `Uploaded by faculty on ${new Date().toLocaleDateString()}`,
        },
      ]);

      if (dbError) {
        console.warn('Supabase study_materials insert notice:', dbError.message);
      }

      const newMaterial = {
        id: materialId,
        title: cleanTitle,
        fileName: cleanFileName,
        filePath: fileUrl,
        level: level || 'A1-A2',
        category: category || 'Speaking & Discussion',
        description: description?.trim() || `Uploaded by faculty on ${new Date().toLocaleDateString()}`,
        isCustom: true,
      };

      return NextResponse.json({
        success: true,
        material: newMaterial,
        message: 'PDF successfully registered and synchronized across all devices!',
      });
    }

    // B. Fallback: FormData Upload via Server
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

    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${timestamp}_${cleanName}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Upload to Supabase Cloud Storage (bucket: 'study-materials')
    const { error: uploadError } = await supabaseServer.storage
      .from('study-materials')
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase PDF upload error:', uploadError);
      return NextResponse.json(
        { error: `Cloud storage upload failed: ${uploadError.message}. Ensure the 'study-materials' bucket is created in Supabase.` },
        { status: 500 }
      );
    }

    // 2. Get permanent public HTTPS URL
    const { data: publicUrlData } = supabaseServer.storage
      .from('study-materials')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;
    const materialId = `mat-upload-${timestamp}`;
    const cleanTitle = title.trim() || file.name.replace(/\.[^/.]+$/, '');

    // 3. Save to Supabase 'study_materials' table
    const { error: dbError } = await supabaseServer.from('study_materials').insert([
      {
        id: materialId,
        title: cleanTitle,
        file_name: cleanName,
        file_url: publicUrl,
        category,
        cefr_level: level,
        description: description.trim() || `Uploaded by faculty on ${new Date().toLocaleDateString()}`,
      },
    ]);

    if (dbError) {
      console.warn('Supabase study_materials insert notice:', dbError.message);
    }

    const newMaterial = {
      id: materialId,
      title: cleanTitle,
      fileName: cleanName,
      filePath: publicUrl,
      level,
      category,
      description: description.trim() || `Uploaded by faculty on ${new Date().toLocaleDateString()}`,
      isCustom: true,
    };

    return NextResponse.json({
      success: true,
      material: newMaterial,
      message: 'PDF successfully uploaded to cloud storage and accessible across all devices!',
    });
  } catch (error: any) {
    console.error('PDF upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save PDF material' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Material ID required' }, { status: 400 });
    }

    const { error } = await supabaseServer.from('study_materials').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Material removed from cloud catalog' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
