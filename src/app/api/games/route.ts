import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase games GET notice:', error.message);
      return NextResponse.json({ games: [] });
    }

    const mappedGames = (data || []).map((g: any) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      cefrLevel: g.cefr_level || 'B1 Intermediate',
      description: g.description,
      questionsCount: g.questions_count || 50,
      xpReward: g.xp_reward || 50,
      filePath: g.file_url,
      isCustom: true,
      isPopular: true,
    }));

    return NextResponse.json({ games: mappedGames });
  } catch (err: any) {
    console.error('Games fetch error:', err);
    return NextResponse.json({ games: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // A. Direct JSON Metadata Registration (Used when client uploads directly to Supabase Storage, bypassing Vercel 4.5MB limit)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { title, category, cefrLevel, description, questionsCount, xpReward, fileUrl } = body;

      if (!fileUrl) {
        return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
      }

      const timestamp = Date.now();
      const gameId = `game-${timestamp}`;
      const cleanTitle = (title || '').trim() || 'Custom ESL Game';

      const { error: dbError } = await supabaseServer.from('games').insert([
        {
          id: gameId,
          title: cleanTitle,
          category: category || 'Speaking',
          cefr_level: cefrLevel || 'B1 Intermediate',
          description: description?.trim() || `Custom interactive game added by faculty: ${cleanTitle}`,
          questions_count: parseInt(questionsCount, 10) || 50,
          xp_reward: parseInt(xpReward, 10) || 50,
          file_url: fileUrl,
          is_custom: true,
        },
      ]);

      if (dbError) {
        console.warn('Supabase games insert notice:', dbError.message);
      }

      const newGame = {
        id: gameId,
        title: cleanTitle,
        category: category || 'Speaking',
        cefrLevel: cefrLevel || 'B1 Intermediate',
        description: description?.trim() || `Custom interactive game added by faculty: ${cleanTitle}`,
        questionsCount: parseInt(questionsCount, 10) || 50,
        xpReward: parseInt(xpReward, 10) || 50,
        filePath: fileUrl,
        isCustom: true,
        isPopular: true,
      };

      return NextResponse.json({
        success: true,
        game: newGame,
        message: 'Game successfully registered in cloud catalog!',
      });
    }

    // B. Fallback: FormData Upload via Server
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const category = (formData.get('category') as string) || 'Speaking';
    const cefrLevel = (formData.get('cefrLevel') as string) || 'B1 Intermediate';
    const description = (formData.get('description') as string) || '';
    const xpReward = parseInt((formData.get('xpReward') as string) || '50', 10);
    const questionsCount = parseInt((formData.get('questionsCount') as string) || '50', 10);

    if (!file) {
      return NextResponse.json({ error: 'No HTML file provided' }, { status: 400 });
    }

    const lower = file.name.toLowerCase();
    if (!lower.endsWith('.html') && !lower.endsWith('.htm')) {
      return NextResponse.json({ error: 'Only .html or .htm files are supported' }, { status: 400 });
    }

    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${timestamp}_${cleanName}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Upload file to Supabase Cloud Storage (bucket: 'games')
    const { error: uploadError } = await supabaseServer.storage
      .from('games')
      .upload(storagePath, buffer, {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return NextResponse.json(
        { error: `Cloud storage upload failed: ${uploadError.message}. Ensure the 'games' bucket is created in Supabase.` },
        { status: 500 }
      );
    }

    // 2. Get permanent public HTTPS URL
    const { data: publicUrlData } = supabaseServer.storage
      .from('games')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;
    const gameId = `game-${timestamp}`;
    const cleanTitle = title.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    // 3. Save metadata into Supabase 'games' table
    const { error: dbError } = await supabaseServer.from('games').insert([
      {
        id: gameId,
        title: cleanTitle,
        category,
        cefr_level: cefrLevel,
        description: description.trim() || `Custom interactive game added by faculty: ${cleanTitle}`,
        questions_count: isNaN(questionsCount) ? 50 : questionsCount,
        xp_reward: isNaN(xpReward) ? 50 : xpReward,
        file_url: publicUrl,
        is_custom: true,
      },
    ]);

    if (dbError) {
      console.warn('Supabase DB insert notice:', dbError.message);
    }

    const newGame = {
      id: gameId,
      title: cleanTitle,
      category,
      cefrLevel,
      description: description.trim() || `Custom interactive game added by faculty: ${cleanTitle}`,
      questionsCount: isNaN(questionsCount) ? 50 : questionsCount,
      xpReward: isNaN(xpReward) ? 50 : xpReward,
      filePath: publicUrl,
      isCustom: true,
      isPopular: true,
    };

    return NextResponse.json({
      success: true,
      game: newGame,
      message: 'HTML Game successfully uploaded to cloud storage and registered across all devices!',
    });
  } catch (error: any) {
    console.error('HTML Game upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process HTML game upload' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Game ID required' }, { status: 400 });
    }

    const { error } = await supabaseServer.from('games').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Game removed from cloud catalog' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
