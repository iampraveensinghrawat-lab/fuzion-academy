import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const category = (formData.get('category') as any) || 'Grammar';
    const cefrLevel = (formData.get('cefrLevel') as any) || 'B1 Intermediate';
    const description = (formData.get('description') as string) || '';
    const xpReward = parseInt((formData.get('xpReward') as string) || '50', 10);
    const questionsCount = parseInt((formData.get('questionsCount') as string) || '50', 10);

    if (!file) {
      return NextResponse.json({ error: 'No HTML file provided' }, { status: 400 });
    }

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.html') && !lowerName.endsWith('.htm')) {
      return NextResponse.json({ error: 'Only .html or .htm game files are supported' }, { status: 400 });
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:text/html;charset=utf-8;base64,${base64Data}`;

    let savedPath = `/games/${cleanFileName}`;
    let diskSaved = false;

    // Attempt to persist in public/games for local/traditional hosting environments
    try {
      const gamesDir = path.join(process.cwd(), 'public', 'games');
      if (!fs.existsSync(gamesDir)) {
        fs.mkdirSync(gamesDir, { recursive: true });
      }
      const fullPath = path.join(gamesDir, cleanFileName);
      await fs.promises.writeFile(fullPath, buffer);
      diskSaved = true;
    } catch (fsErr: any) {
      // In serverless environments like Vercel with read-only root filesystems, use the Data URL
      console.warn('Filesystem write notice (e.g. Vercel serverless read-only filesystem):', fsErr.message);
      savedPath = dataUrl;
    }

    const gameId = `custom-game-${Date.now()}`;
    const cleanTitle = title.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    const newGame = {
      id: gameId,
      title: cleanTitle,
      category,
      cefrLevel,
      description: description.trim() || `Custom interactive game added by faculty: ${cleanTitle}`,
      questionsCount: isNaN(questionsCount) ? 50 : questionsCount,
      xpReward: isNaN(xpReward) ? 50 : xpReward,
      filePath: diskSaved ? `/games/${cleanFileName}` : dataUrl,
      dataUrl,
      isCustom: true,
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      game: newGame,
      message: 'HTML Game successfully uploaded and registered into the Arcade catalog!',
    });
  } catch (error: any) {
    console.error('HTML Game upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process HTML game upload' },
      { status: 500 }
    );
  }
}
