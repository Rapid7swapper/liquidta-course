import { createClient } from '@/lib/supabase/server'
import { User, UserRole } from '@/lib/supabase/types'

export interface AuthUser {
  id: string
  supabaseId: string | null
  email: string
  firstName: string
  lastName: string
  role: UserRole
  dbUser: User | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Try to find user in the users table
  let { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // If not found by id, try by email
  if (!dbUser && user.email) {
    const { data: userByEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (userByEmail) {
      dbUser = userByEmail
    }
  }

  // Default role is student if no database record exists
  const typedDbUser = dbUser as User | null
  const role: UserRole = typedDbUser?.role || 'student'

  return {
    id: user.id,
    supabaseId: typedDbUser?.id || user.id,
    email: user.email || '',
    firstName: typedDbUser?.first_name || user.user_metadata?.first_name || '',
    lastName: typedDbUser?.last_name || user.user_metadata?.last_name || '',
    role,
    dbUser: typedDbUser,
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}
