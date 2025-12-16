import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { UserRole, User } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    // Verify the user has permission to create users
    const currentUser = await requireRole(['super_admin', 'admin'])

    const body = await request.json()
    const { firstName, lastName, email, role } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate role permissions
    // Admins can only create students
    // Super admins can create admins and students
    if (currentUser.role === 'admin' && role !== 'student') {
      return NextResponse.json(
        { error: 'Admins can only create student accounts' },
        { status: 403 }
      )
    }

    if (role === 'super_admin') {
      return NextResponse.json(
        { error: 'Cannot create super admin accounts' },
        { status: 403 }
      )
    }

    // Create user in Supabase users table
    // Note: The user will need to sign up via the auth flow to get authentication
    const supabase = await createClient()

    // Check if user with this email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 422 }
      )
    }

    const { data: dbUser, error: dbError } = await (supabase as any)
      .from('users')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        role: role as UserRole,
        created_by: currentUser.dbUser?.id,
      })
      .select()
      .single()

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    const typedDbUser = dbUser as User

    return NextResponse.json({
      success: true,
      user: {
        id: typedDbUser.id,
        email: typedDbUser.email,
        firstName: typedDbUser.first_name,
        lastName: typedDbUser.last_name,
        role: typedDbUser.role,
      },
      message: 'User created. They will need to sign up to set their password.'
    })

  } catch (error) {
    console.error('Error creating user:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create user'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// GET endpoint to fetch users
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireRole(['super_admin', 'admin'])

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    let query = supabase.from('users').select('*')

    // Filter by role if specified
    if (role) {
      query = query.eq('role', role)
    }

    // Admins can only see students they created
    if (currentUser.role === 'admin' && currentUser.dbUser?.id) {
      query = query.eq('created_by', currentUser.dbUser.id).eq('role', 'student')
    }

    const { data: users, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Error fetching users:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
