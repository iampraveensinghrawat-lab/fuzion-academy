import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

const DEFAULT_QUIZZES = [
  {
    id: 'q-default-1',
    title: 'Tenses & Irregular Verbs Mastery Quiz',
    url: 'https://gemini.google.com',
    batch: 'All Batches',
    questions: 15,
  },
  {
    id: 'q-default-2',
    title: 'Business Idioms & Phrasal Verbs Challenge',
    url: 'https://gemini.google.com',
    batch: 'B1-Evening',
    questions: 20,
  },
];

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase quizzes GET notice:', error.message);
      return NextResponse.json({ quizzes: DEFAULT_QUIZZES });
    }

    const cloudQuizzes = (data || []).map((q: any) => ({
      id: q.id,
      title: q.title,
      url: q.external_url || 'https://gemini.google.com',
      batch: q.batch || 'All Batches',
      questions: q.questions_count || 15,
      isCustom: true,
    }));

    return NextResponse.json({
      quizzes: [...cloudQuizzes, ...DEFAULT_QUIZZES],
    });
  } catch (err: any) {
    console.error('Quizzes fetch error:', err);
    return NextResponse.json({ quizzes: DEFAULT_QUIZZES });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, url, batch, questions } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Quiz title is required' }, { status: 400 });
    }

    const quizId = `quiz-${Date.now()}`;
    const cleanTitle = title.trim();
    const cleanUrl = (url || '').trim() || 'https://gemini.google.com';
    const cleanBatch = batch || 'All Batches';
    const questionsCount = parseInt(questions, 10) || 15;

    const { error } = await supabaseServer.from('quizzes').insert([
      {
        id: quizId,
        title: cleanTitle,
        category: 'Spoken English & Grammar',
        external_url: cleanUrl,
        batch: cleanBatch,
        questions_count: questionsCount,
      },
    ]);

    if (error) {
      console.error('Supabase Quiz insert error:', error);
      return NextResponse.json(
        { error: `Database insert failed: ${error.message}. Ensure 'quizzes' table exists in Supabase.` },
        { status: 500 }
      );
    }

    const newQuiz = {
      id: quizId,
      title: cleanTitle,
      url: cleanUrl,
      batch: cleanBatch,
      questions: questionsCount,
      isCustom: true,
    };

    return NextResponse.json({
      success: true,
      quiz: newQuiz,
      message: 'Quiz successfully created in shared database and live across all student/faculty devices!',
    });
  } catch (err: any) {
    console.error('Quiz creation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create quiz' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quiz ID required' }, { status: 400 });
    }

    const { error } = await supabaseServer.from('quizzes').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Quiz deleted from cloud database' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
