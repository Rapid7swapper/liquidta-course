import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// This endpoint creates the course_progress table if it doesn't exist
export async function POST() {
  try {
    const adminClient = createAdminClient()

    // Create the course_progress table using raw SQL
    const { error } = await adminClient.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS course_progress (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          course_id TEXT NOT NULL,
          module_progress JSONB DEFAULT '[]'::jsonb,
          current_module_index INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, course_id)
        );

        CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
      `
    })

    if (error) {
      // Try alternative approach - direct insert to test if table exists
      console.log('RPC not available, table may already exist or need manual creation')

      // Return SQL for manual execution
      return NextResponse.json({
        message: 'Please run this SQL in Supabase SQL Editor',
        sql: `
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  module_progress JSONB DEFAULT '[]'::jsonb,
  current_module_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);

-- Enable RLS
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own progress
CREATE POLICY "Users can view own progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own progress
CREATE POLICY "Users can insert own progress" ON course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own progress
CREATE POLICY "Users can update own progress" ON course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow service role full access
CREATE POLICY "Service role has full access" ON course_progress
  FOR ALL USING (auth.role() = 'service_role');
        `
      })
    }

    return NextResponse.json({ success: true, message: 'Table created successfully' })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({
      message: 'Please run this SQL in Supabase SQL Editor to create the progress table',
      sql: `
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  module_progress JSONB DEFAULT '[]'::jsonb,
  current_module_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
      `
    })
  }
}
