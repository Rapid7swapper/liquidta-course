import { User } from './supabase/types'

// Mock users for testing - in production these would come from Supabase
export const mockUsers: Record<string, User> = {
  'super_admin': {
    id: '11111111-1111-1111-1111-111111111111',
    clerk_id: 'user_super_admin',
    email: 'superadmin@liquidacapital.com',
    first_name: 'Super',
    last_name: 'Admin',
    role: 'super_admin',
    created_by: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  'admin': {
    id: '22222222-2222-2222-2222-222222222222',
    clerk_id: 'user_admin',
    email: 'admin@liquidacapital.com',
    first_name: 'John',
    last_name: 'Manager',
    role: 'admin',
    created_by: '11111111-1111-1111-1111-111111111111',
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  'student': {
    id: '33333333-3333-3333-3333-333333333333',
    clerk_id: 'user_student',
    email: 'student@liquidacapital.com',
    first_name: 'Jane',
    last_name: 'Learner',
    role: 'student',
    created_by: '22222222-2222-2222-2222-222222222222',
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
}

// Mock data for dashboards
export const mockCourses = [
  {
    id: '1',
    title: 'Financial Analysis Fundamentals',
    description: 'Learn the core concepts of financial analysis and reporting',
    image_url: '/course-finance.jpg',
    progress: 75,
    modules: 8,
    completedModules: 6,
    duration: '12 hours',
  },
  {
    id: '2',
    title: 'Risk Management Essentials',
    description: 'Master risk assessment and mitigation strategies',
    image_url: '/course-risk.jpg',
    progress: 30,
    modules: 6,
    completedModules: 2,
    duration: '8 hours',
  },
  {
    id: '3',
    title: 'Compliance & Regulations',
    description: 'Stay updated with industry compliance requirements',
    image_url: '/course-compliance.jpg',
    progress: 0,
    modules: 5,
    completedModules: 0,
    duration: '6 hours',
  },
]

export const mockStudents = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Jane Learner',
    email: 'student@liquidacapital.com',
    progress: 52,
    coursesEnrolled: 3,
    coursesCompleted: 1,
    lastActive: '2024-12-07',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Bob Smith',
    email: 'bob@liquidacapital.com',
    progress: 88,
    coursesEnrolled: 3,
    coursesCompleted: 2,
    lastActive: '2024-12-08',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Alice Johnson',
    email: 'alice@liquidacapital.com',
    progress: 15,
    coursesEnrolled: 2,
    coursesCompleted: 0,
    lastActive: '2024-12-05',
  },
]

export const mockAdmins = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'John Manager',
    email: 'admin@liquidacapital.com',
    studentsManaged: 3,
    activeStudents: 3,
    avgStudentProgress: 52,
    createdAt: '2024-01-15',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Sarah Director',
    email: 'sarah@liquidacapital.com',
    studentsManaged: 5,
    activeStudents: 4,
    avgStudentProgress: 67,
    createdAt: '2024-01-20',
  },
]
