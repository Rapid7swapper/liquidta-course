import { redirect } from 'next/navigation'

// Sign-up is disabled - this is an invite-only platform
// Redirect to sign-in page
export default function SignUpPage() {
  redirect('/sign-in')
}
