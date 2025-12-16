import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { User } from '@/lib/supabase/types'

// GET - Fetch a single user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['super_admin', 'admin'])
    const { id } = await params

    const supabase = await createClient()
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const typedUser = user as User

    // Admins can only view students they created
    if (currentUser.role === 'admin' && typedUser.created_by !== currentUser.dbUser?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PUT - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['super_admin', 'admin'])
    const { id } = await params
    const body = await request.json()
    const { firstName, lastName, email } = body

    const supabase = await createClient()

    // First, fetch the existing user to get their clerk_id
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const typedExistingUser = existingUser as User

    // Admins can only edit students they created
    if (currentUser.role === 'admin') {
      if (typedExistingUser.role !== 'student' || typedExistingUser.created_by !== currentUser.dbUser?.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Super admins cannot edit other super admins
    if (typedExistingUser.role === 'super_admin' && currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Cannot edit super admin accounts' }, { status: 403 })
    }

    // Update user in Clerk
    const clerk = await clerkClient()
    try {
      await clerk.users.updateUser(typedExistingUser.clerk_id!, {
        firstName: firstName || typedExistingUser.first_name,
        lastName: lastName || typedExistingUser.last_name,
      })

      // Update email if changed
      if (email && email !== typedExistingUser.email) {
        // Create new email address
        await clerk.emailAddresses.createEmailAddress({
          userId: typedExistingUser.clerk_id!,
          emailAddress: email,
          verified: true,
          primary: true,
        })
      }
    } catch (clerkError: unknown) {
      console.error('Clerk update error:', clerkError)

      if (clerkError && typeof clerkError === 'object' && 'errors' in clerkError) {
        const errors = (clerkError as { errors: Array<{ message?: string; longMessage?: string }> }).errors
        if (errors && errors.length > 0) {
          const message = errors[0].longMessage || errors[0].message || 'Failed to update user in Clerk'
          return NextResponse.json({ error: message }, { status: 422 })
        }
      }

      throw clerkError
    }

    // Update user in Supabase
    const { data: updatedUser, error: updateError } = await (supabase as any)
      .from('users')
      .update({
        first_name: firstName || typedExistingUser.first_name,
        last_name: lastName || typedExistingUser.last_name,
        email: email || typedExistingUser.email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Database error: ${updateError.message}`)
    }

    const typedUpdatedUser = updatedUser as User

    return NextResponse.json({
      success: true,
      user: {
        id: typedUpdatedUser.id,
        email: typedUpdatedUser.email,
        firstName: typedUpdatedUser.first_name,
        lastName: typedUpdatedUser.last_name,
        role: typedUpdatedUser.role,
      }
    })

  } catch (error) {
    console.error('Error updating user:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to update user'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(['super_admin', 'admin'])
    const { id } = await params

    const supabase = await createClient()

    // First, fetch the existing user to get their clerk_id
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const typedExistingUserDel = existingUser as User

    // Prevent deleting super admin accounts
    if (typedExistingUserDel.role === 'super_admin') {
      return NextResponse.json({ error: 'Cannot delete super admin accounts' }, { status: 403 })
    }

    // Admins can only delete students they created
    if (currentUser.role === 'admin') {
      if (typedExistingUserDel.role !== 'student' || typedExistingUserDel.created_by !== currentUser.dbUser?.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // If deleting an admin, first update any students they created to remove the foreign key reference
    if (typedExistingUserDel.role === 'admin') {
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({ created_by: null })
        .eq('created_by', id)

      if (updateError) {
        console.error('Error updating students created_by:', updateError)
        throw new Error(`Failed to update related students: ${updateError.message}`)
      }
    }

    // Delete from Clerk first
    const clerk = await clerkClient()
    try {
      await clerk.users.deleteUser(typedExistingUserDel.clerk_id!)
    } catch (clerkError: unknown) {
      console.error('Clerk delete error:', clerkError)
      // If the user doesn't exist in Clerk, continue with database deletion
      if (clerkError && typeof clerkError === 'object' && 'status' in clerkError) {
        if ((clerkError as { status: number }).status !== 404) {
          throw clerkError
        }
      }
    }

    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw new Error(`Database error: ${deleteError.message}`)
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' })

  } catch (error) {
    console.error('Error deleting user:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
