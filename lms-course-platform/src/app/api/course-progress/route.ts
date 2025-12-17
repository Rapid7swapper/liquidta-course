import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET - Fetch progress for a user or all users (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('[course-progress] Auth user:', user?.id, user?.email)

    if (!user) {
      console.log('[course-progress] No auth user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    const adminClient = createAdminClient()

    // Check if user is admin/super_admin
    const { data: currentUser, error: userError } = await adminClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log('[course-progress] Current user role:', currentUser?.role, 'Error:', userError?.message)

    // If admin, can fetch all students' progress
    if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') {
      let query = adminClient.from('course_progress').select('*')

      if (userId) {
        query = query.eq('user_id', userId)
      }
      if (courseId) {
        query = query.eq('course_id', courseId)
      }

      // If admin (not super_admin), only show their students
      if (currentUser?.role === 'admin') {
        const { data: students, error: studentsError } = await adminClient
          .from('users')
          .select('id')
          .eq('created_by', user.id)

        console.log('[course-progress] Students created by admin:', students?.length, 'Error:', studentsError?.message)

        const studentIds = students?.map(s => s.id) || []
        if (studentIds.length > 0) {
          query = query.in('user_id', studentIds)
        } else {
          console.log('[course-progress] No students found for admin, returning empty')
          return NextResponse.json({ progress: [] })
        }
      }

      const { data: progress, error } = await query

      console.log('[course-progress] Progress records found:', progress?.length, 'Error:', error?.message)

      if (error) {
        console.error('Error fetching progress:', error)
        return NextResponse.json({ progress: [] })
      }

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
