-- FUZION ACADEMY LMS - COMPLETE MULTI-PORTAL AUTHENTICATION SCHEMA
-- Supports 4 Roles: Student, Teacher, Administrator, Parent
-- Includes Teacher Invitation/Approval, Parent-Child Linking, Password Reset, and Security Audit Logs

-- 1. Enum Types (Safe Creation)
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('student', 'teacher', 'admin', 'parent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE account_status_type AS ENUM ('active', 'pending_approval', 'disabled', 'unverified');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Enhanced User Profiles Table
CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT,
  password_hash TEXT NOT NULL,
  role user_role_type NOT NULL,
  status account_status_type NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY REFERENCES user_accounts(id) ON DELETE CASCADE,
  student_code TEXT UNIQUE NOT NULL, -- e.g. FA-STU-101
  age_or_dob TEXT,
  cefr_level TEXT DEFAULT 'Intermediate',
  course_selection TEXT DEFAULT 'Spoken English',
  batch TEXT DEFAULT 'B1-Evening',
  xp INTEGER DEFAULT 420,
  level INTEGER DEFAULT 4,
  streak INTEGER DEFAULT 7,
  attendance_rate INTEGER DEFAULT 92,
  parent_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Teacher Profiles
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id UUID PRIMARY KEY REFERENCES user_accounts(id) ON DELETE CASCADE,
  qualification TEXT NOT NULL,
  experience_years TEXT NOT NULL,
  specialisation TEXT NOT NULL,
  invitation_code_used TEXT,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Parent Profiles
CREATE TABLE IF NOT EXISTS parent_profiles (
  id UUID PRIMARY KEY REFERENCES user_accounts(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN ('Father', 'Mother', 'Guardian', 'Other authorised guardian')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Parent-Child Linking Relationships (Supports multiple children)
CREATE TABLE IF NOT EXISTS parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  student_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  relationship_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_by UUID REFERENCES user_accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- 7. Teacher Invitation Codes
CREATE TABLE IF NOT EXISTS teacher_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES user_accounts(id),
  is_used BOOLEAN DEFAULT false,
  used_by UUID,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Password Reset Requests
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Login & Security Audit Logs
CREATE TABLE IF NOT EXISTS auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL, -- 'login_success', 'login_failed', 'signup', 'password_reset', 'teacher_approved'
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Default Teacher Invitation Codes Seed
INSERT INTO teacher_invitations (code, is_used) 
VALUES 
  ('FA-TEACH-2026', false),
  ('FA-FACULTY-MASTER', false)
ON CONFLICT (code) DO NOTHING;
