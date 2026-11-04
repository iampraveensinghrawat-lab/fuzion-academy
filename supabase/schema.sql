-- FUZION ACADEMY LMS - SUPABASE POSTGRESQL SCHEMA
-- Execute this script in your Supabase SQL Editor to set up all tables and security policies.

-- 1. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  cefr_level TEXT DEFAULT 'B1 Intermediate',
  batch TEXT DEFAULT 'B1-Evening',
  xp INTEGER DEFAULT 420,
  level INTEGER DEFAULT 4,
  streak INTEGER DEFAULT 7,
  attendance_rate INTEGER DEFAULT 92,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Batches
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  timing TEXT,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Game Catalog
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  cefr_level TEXT DEFAULT 'A1 Beginner',
  description TEXT,
  questions_count INTEGER DEFAULT 50,
  xp_reward INTEGER DEFAULT 50,
  file_path TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Game Attempts / Play History
CREATE TABLE IF NOT EXISTS game_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Speaking Assessments
CREATE TABLE IF NOT EXISTS speaking_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id TEXT NOT NULL,
  prompt_title TEXT NOT NULL,
  category TEXT NOT NULL,
  transcript TEXT NOT NULL,
  grammar_score INTEGER CHECK (grammar_score BETWEEN 0 AND 100),
  fluency_score INTEGER CHECK (fluency_score BETWEEN 0 AND 100),
  vocabulary_score INTEGER CHECK (vocabulary_score BETWEEN 0 AND 100),
  pronunciation_score INTEGER CHECK (pronunciation_score BETWEEN 0 AND 100),
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  word_count INTEGER DEFAULT 0,
  wpm INTEGER DEFAULT 0,
  feedback_strengths TEXT[],
  feedback_corrections JSONB,
  teacher_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Study Materials
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  category TEXT NOT NULL,
  cefr_level TEXT DEFAULT 'A1-A2',
  description TEXT,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Quizzes & Tests
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  external_url TEXT,
  source_platform TEXT DEFAULT 'Google Gemini',
  questions_count INTEGER DEFAULT 10,
  passing_score INTEGER DEFAULT 70,
  assigned_batch TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Homework / Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  batch TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Student Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late')),
  batch TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 11. Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  grade TEXT DEFAULT 'Distinction',
  issued_by TEXT DEFAULT 'Praveen Singh Rawat (Founder, Fuzion Academy)',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Standard Policies: Users can read own profile & public content
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users view own game attempts" ON game_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own game attempts" ON game_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own speaking assessments" ON speaking_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own speaking assessments" ON speaking_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
