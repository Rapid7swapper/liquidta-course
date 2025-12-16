import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Sample accounts to create
const sampleAccounts = [
  {
    email: 'superadmin@liquidacapital.com',
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin' as const,
  },
  {
    email: 'admin@liquidacapital.com',
    password: 'Admin123!',
    firstName: 'John',
    lastName: 'Manager',
    role: 'admin' as const,
  },
  {
    email: 'student@liquidacapital.com',
    password: 'Student123!',
    firstName: 'Jane',
    lastName: 'Learner',
    role: 'student' as const,
  },
]

export async function POST(request: Request) {
  try {
    // Check for seed secret to prevent unauthorized access
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== process.env.SEED_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const results: Array<{ email: string; success: boolean; error?: string }> = []

    for (const account of sampleAccounts) {
      try {
        // Check if user already exists in auth
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const userExists = existingUsers?.users?.some(u => u.email === account.email)

        if (userExists) {
          results.push({ email: account.email, success: false, error: 'User already exists' })
          continue
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            first_name: account.firstName,
            last_name: account.lastName,
          },
        })

        if (authError) {
          results.push({ email: account.email, success: false, error: authError.message })
          continue
        }

        if (!authData.user) {
          results.push({ email: account.email, success: false, error: 'Failed to create auth user' })
          continue
        }

        // Create user record in database
        const { error: dbError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: account.email,
          first_name: account.firstName,
          last_name: account.lastName,
          role: account.role,
          is_active: true,
        })

        if (dbError) {
          // If DB insert fails, delete the auth user
          await supabase.auth.admin.deleteUser(authData.user.id)
          results.push({ email: account.email, success: false, error: dbError.message })
          continue
        }

        results.push({ email: account.email, success: true })
      } catch (err) {
        results.push({
          email: account.email,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      message: 'Seed completed',
      results,
      credentials: sampleAccounts.map(a => ({
        email: a.email,
        password: a.password,
        role: a.role,
      })),
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to seed accounts' },
      { status: 500 }
    )
  }
}

// GET endpoint to check if accounts exist
export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: users, error } = await supabase
      .from('users')
      .select('email, role, first_name, last_name')
      .in('email', sampleAccounts.map(a => a.email))

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      existingAccounts: users,
      allAccountsExist: users?.length === sampleAccounts.length,
    })
  } catch (error) {
    console.error('Check seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check accounts' },
      { status: 500 }
    )
  }
}
