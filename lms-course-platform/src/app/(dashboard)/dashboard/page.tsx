import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import StudentDashboard from '@/components/dashboards/StudentDashboard'
import AdminDashboard from '@/components/dashboards/AdminDashboard'
import SuperAdminDashboard from '@/components/dashboards/SuperAdminDashboard'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Render the appropriate dashboard based on user role
  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard user={user} />
    case 'admin':
      return <AdminDashboard user={user} />
    case 'student':
    default:
      return <StudentDashboard user={user} />
  }
}
