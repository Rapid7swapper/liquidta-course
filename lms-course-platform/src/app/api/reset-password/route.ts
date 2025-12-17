import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and newPassword required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Find the user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 })
    }

    const user = users?.users?.find(u => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'User not found in auth' }, { status: 404 })
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
      email_confirm: true,
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Password updated for ${email}`,
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset password' },
      { status: 500 }
    )
  }
}
