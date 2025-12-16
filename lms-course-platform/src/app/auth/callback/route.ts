import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if user already exists in the users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        // If user doesn't exist, create them with default 'student' role
        if (!existingUser) {
          const firstName = user.user_metadata?.first_name || ''
          const lastName = user.user_metadata?.last_name || ''

          await (supabase as any).from('users').insert({
            id: user.id,
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            role: 'student', // Default role for new sign-ups
            is_active: true,
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/sign-in?error=Could not authenticate`)
}
