import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check if user exists in database
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (dbError || !dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    // Check if user exists in auth
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const existingAuthUser = authUsers?.users?.find(u => u.email === email)

    if (existingAuthUser) {
      // User exists in auth, just update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(existingAuthUser.id, {
        password: password,
        email_confirm: true,
      })

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: `Password updated for ${email}`,
        action: 'updated',
      })
    }

    // User doesn't exist in auth, create with the existing DB user ID
    const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
      },
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    // Update the database user ID to match the new auth user ID
    if (newAuthUser.user && newAuthUser.user.id !== dbUser.id) {
      // Delete old DB record and create new one with correct ID
      await supabase.from('users').delete().eq('id', dbUser.id)

      const { error: insertError } = await supabase.from('users').insert({
        id: newAuthUser.user.id,
        email: dbUser.email,
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        role: dbUser.role,
        is_active: dbUser.is_active,
      })

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Auth user created for ${email}`,
      action: 'created',
      userId: newAuthUser.user?.id,
    })
  } catch (error) {
    console.error('Fix auth error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fix auth' },
      { status: 500 }
    )
  }
}
