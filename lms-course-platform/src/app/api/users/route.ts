import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireRole } from '@/lib/auth'
import { UserRole, User } from '@/lib/supabase/types'

// Generate a random temporary password
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function POST(request: NextRequest) {
  try {
    // Verify the user has permission to create users
    const currentUser = await requireRole(['super_admin', 'admin'])

    const body = await request.json()
    const { firstName, lastName, email, role, password: providedPassword } = body

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

    const supabase = await createClient()

    // Check if user with this email already exists in database
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

    // Use admin client to create auth user
    const adminClient = createAdminClient()

    // Use provided password or generate a temporary one
    const tempPassword = providedPassword || generateTempPassword()

    // Create the auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm so they can log in immediately
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      return NextResponse.json(
        { error: `Failed to create auth account: ${authError.message}` },
        { status: 422 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create auth user' },
        { status: 500 }
      )
    }

    // Create user record in database with the auth user's ID
    const { data: dbUser, error: dbError } = await (adminClient as any)
      .from('users')
      .insert({
        id: authData.user.id, // Use the same ID as the auth user
        email,
        first_name: firstName,
        last_name: lastName,
        role: role as UserRole,
        created_by: currentUser.dbUser?.id,
        is_active: true,
      })
      .select()
      .single()

    if (dbError) {
      // If database insert fails, delete the auth user to maintain consistency
      await adminClient.auth.admin.deleteUser(authData.user.id)
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
      // Only include temp password if we generated one (not if admin provided one)
      ...(providedPassword ? {} : { temporaryPassword: tempPassword }),
      message: providedPassword
        ? 'User created successfully. They can now sign in with the provided password.'
        : 'User created with temporary password. Please share the credentials securely.'
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
