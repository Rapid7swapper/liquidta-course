import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET - Fetch progress for a user or all users (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ progress: [] })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')
    const fetchAll = searchParams.get('all') === 'true'

    const adminClient = createAdminClient()

    // Check if user is admin/super_admin
    const { data: currentUser } = await adminClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // Super admin with all=true - fetch all progress
    if (currentUser?.role === 'super_admin' && fetchAll) {
      const { data: progress } = await adminClient.from('course_progress').select('*')
      return NextResponse.json({ progress: progress || [] })
    }

    // If admin, can fetch their students' progress
    if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') {
      // For admin, get students they created
      if (currentUser?.role === 'admin') {
        const { data: students } = await adminClient
          .from('users')
          .select('id')
          .eq('created_by', user.id)

        const studentIds = students?.map(s => s.id) || []
        if (studentIds.length === 0) {
          return NextResponse.json({ progress: [] })
        }

        let query = adminClient.from('course_progress').select('*').in('user_id', studentIds)

        if (courseId) {
          query = query.eq('course_id', courseId)
        }

        const { data: progress } = await query
        return NextResponse.json({ progress: progress || [] })
      }

      // Super admin without all=true - fetch all
      const { data: progress } = await adminClient.from('course_progress').select('*')
      return NextResponse.json({ progress: progress || [] })
    }

    // Regular user - can only fetch their own progress
    let query = adminClient
      .from('course_progress')
      .select('*')
      .eq('user_id', user.id)

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data: progress, error } = await query

    if (error) {
      console.error('Error fetching progress:', error)
      return NextResponse.json({ progress: [] })
    }

    return NextResponse.json({ progress: progress || [] })
  } catch (error) {
    console.error('Error in GET course-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Save progress
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, moduleProgress, currentModuleIndex } = body

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Check if progress record exists
    const { data: existing } = await adminClient
      .from('course_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    const progressData = {
      user_id: user.id,
      course_id: courseId,
      module_progress: moduleProgress || [],
      current_module_index: currentModuleIndex || 0,
      updated_at: new Date().toISOString()
    }

    if (existing) {
      // Update existing record
      const { error } = await adminClient
        .from('course_progress')
        .update(progressData)
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating progress:', error)
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
      }
    } else {
      // Insert new record
      const { error } = await adminClient
        .from('course_progress')
        .insert(progressData)

      if (error) {
        console.error('Error inserting progress:', error)
        return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST course-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
