import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { UserRole, User } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    // Verify the user has permission to create users
    const currentUser = await requireRole(['super_admin', 'admin'])

    const body = await request.json()
    const { firstName, lastName, email, password, role } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
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

    // Validate password length (Clerk requires at least 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Create user in Clerk
    const clerk = await clerkClient()
    let clerkUser
    try {
      clerkUser = await clerk.users.createUser({
        firstName,
        lastName,
        emailAddress: [email],
        password,
        skipPasswordChecks: true, // Skip additional password policy checks
        skipPasswordRequirement: false, // Still require password
      })

      // Mark the email as verified so password login works immediately
      if (clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
        const emailId = clerkUser.emailAddresses[0].id
        await clerk.emailAddresses.updateEmailAddress(emailId, {
          verified: true,
        })
      }
    } catch (clerkError: unknown) {
      console.error('Clerk error details:', clerkError)

      // Handle specific Clerk errors
      if (clerkError && typeof clerkError === 'object' && 'errors' in clerkError) {
        const errors = (clerkError as { errors: Array<{ message?: string; longMessage?: string; code?: string }> }).errors
        if (errors && errors.length > 0) {
          const firstError = errors[0]
          const message = firstError.longMessage || firstError.message || 'Failed to create user in Clerk'
          return NextResponse.json({ error: message }, { status: 422 })
        }
      }

      throw clerkError
    }

    // Create user in Supabase
    const supabase = await createClient()
    const { data: dbUser, error: dbError } = await (supabase as any)
      .from('users')
      .insert({
        clerk_id: clerkUser.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role: role as UserRole,
        created_by: currentUser.dbUser?.id,
      })
      .select()
      .single()

    if (dbError) {
      // If Supabase fails, delete the Clerk user to maintain consistency
      await clerk.users.deleteUser(clerkUser.id)
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
      }
    })

  } catch (error) {
    console.error('Error creating user:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Handle Clerk-specific errors
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
