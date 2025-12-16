import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { User, UserRole } from '@/lib/supabase/types'

export interface AuthUser {
  clerkId: string
  supabaseId: string | null
  email: string
  firstName: string
  lastName: string
  role: UserRole
  dbUser: User | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const clerkUser = await currentUser()
  if (!clerkUser) {
    return null
  }

  const supabase = await createClient()

  // Try to find user by clerk_id first
  let { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  // If not found by clerk_id, try by email and update clerk_id
  if (!dbUser && clerkUser.emailAddresses[0]?.emailAddress) {
    const email = clerkUser.emailAddresses[0].emailAddress

    const { data: userByEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userByEmail) {
      const typedUserByEmail = userByEmail as User
      // Update the clerk_id for this user
      const { data: updatedUser } = await (supabase as any)
        .from('users')
        .update({ clerk_id: userId })
        .eq('id', typedUserByEmail.id)
        .select()
        .single()

      dbUser = updatedUser || typedUserByEmail
    }
  }

  // Default role is student if no database record exists
  const typedDbUser = dbUser as User | null
  const role: UserRole = typedDbUser?.role || 'student'

  return {
    clerkId: userId,
    supabaseId: typedDbUser?.id || null,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || typedDbUser?.first_name || '',
    lastName: clerkUser.lastName || typedDbUser?.last_name || '',
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
