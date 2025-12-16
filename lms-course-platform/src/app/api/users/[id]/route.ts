import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
    const { firstName, lastName } = body

    const supabase = await createClient()

    // First, fetch the existing user
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

    // Update user in Supabase
    const { data: updatedUser, error: updateError } = await (supabase as any)
      .from('users')
      .update({
        first_name: firstName || typedExistingUser.first_name,
        last_name: lastName || typedExistingUser.last_name,
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

    // First, fetch the existing user
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

    // Delete from Supabase users table
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw new Error(`Database error: ${deleteError.message}`)
    }

    // Delete from Supabase Auth
    try {
      const adminClient = createAdminClient()
      await adminClient.auth.admin.deleteUser(id)
    } catch (authDeleteError) {
      // Log but don't fail if auth deletion fails (user might not have auth account)
      console.error('Error deleting auth user:', authDeleteError)
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
