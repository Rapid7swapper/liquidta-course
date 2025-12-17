'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  UserPlus,
  Mail,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Activity,
  Clock,
  Loader2,
  AlertTriangle,
  Calendar,
  CalendarClock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DashboardHeader from './DashboardHeader'
import { AuthUser } from '@/lib/auth'
import { allCourses } from '@/lib/course-data'

interface DbUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
}

interface AdminDashboardProps {
  user: AuthUser
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Students from database
  const [students, setStudents] = useState<DbUser[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<DbUser | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editError, setEditError] = useState('')
  const [isEditLoading, setIsEditLoading] = useState(false)

  // Delete confirmation state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingStudent, setDeletingStudent] = useState<DbUser | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  // Deadline state
  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string } | null>(null)
  const [deadlineDate, setDeadlineDate] = useState('')
  const [courseDeadlines, setCourseDeadlines] = useState<Record<string, string>>({})

  // Fetch students and deadlines on mount
  useEffect(() => {
    fetchStudents()
    loadDeadlines()
  }, [])

  // Load deadlines from localStorage
  const loadDeadlines = () => {
    const stored = localStorage.getItem('course_deadlines')
    if (stored) {
      try {
        setCourseDeadlines(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading deadlines:', e)
      }
    }
  }

  // Save deadline
  const handleSaveDeadline = () => {
    if (!selectedCourse || !deadlineDate) return

    const newDeadlines = {
      ...courseDeadlines,
      [selectedCourse.id]: deadlineDate
    }

    localStorage.setItem('course_deadlines', JSON.stringify(newDeadlines))
    setCourseDeadlines(newDeadlines)
    setIsDeadlineOpen(false)
    setSelectedCourse(null)
    setDeadlineDate('')
  }

  // Remove deadline
  const handleRemoveDeadline = (courseId: string) => {
    const newDeadlines = { ...courseDeadlines }
    delete newDeadlines[courseId]
    localStorage.setItem('course_deadlines', JSON.stringify(newDeadlines))
    setCourseDeadlines(newDeadlines)
  }

  // Open deadline dialog
  const handleSetDeadline = (course: { id: string; title: string }) => {
    setSelectedCourse(course)
    setDeadlineDate(courseDeadlines[course.id] || '')
    setIsDeadlineOpen(true)
  }

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true)
      const response = await fetch('/api/users?role=student')
      if (response.ok) {
        const data = await response.json()
        setStudents(data.users || [])
      }
    } catch (err) {
      console.error('Error fetching students:', err)
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleCreateStudent = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role: 'student'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create student')
      }

      setSuccess(`Student ${firstName} ${lastName} created successfully!`)
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')

      // Refresh the student list
      fetchStudents()

      // Close dialog after a short delay
      setTimeout(() => {
        setIsAddStudentOpen(false)
        setSuccess('')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle edit student
  const handleEditClick = (student: DbUser) => {
    setEditingStudent(student)
    setEditFirstName(student.first_name)
    setEditLastName(student.last_name)
    setEditEmail(student.email)
    setEditError('')
    setIsEditOpen(true)
  }

  const handleEditStudent = async () => {
    if (!editingStudent) return

    setEditError('')
    setIsEditLoading(true)

    try {
      const response = await fetch(`/api/users/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update student')
      }

      // Refresh the student list
      fetchStudents()
      setIsEditOpen(false)
      setEditingStudent(null)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update student')
    } finally {
      setIsEditLoading(false)
    }
  }

  // Handle delete student
  const handleDeleteClick = (student: DbUser) => {
    setDeletingStudent(student)
    setIsDeleteOpen(true)
  }

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return

    setIsDeleteLoading(true)

    try {
      const response = await fetch(`/api/users/${deletingStudent.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student')
      }

      // Refresh the student list
      fetchStudents()
      setIsDeleteOpen(false)
      setDeletingStudent(null)
    } catch (err) {
      console.error('Delete error:', err)
      // Still close the dialog, but you might want to show an error toast
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader
        firstName={user.firstName}
        lastName={user.lastName}
        role={user.role}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-400">Manage your students and monitor their progress.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { icon: <Users className="w-6 h-6" />, label: 'Total Students', value: students.length, color: 'from-violet-500 to-purple-600' },
            { icon: <Activity className="w-6 h-6" />, label: 'Active Students', value: students.filter(s => s.is_active).length, color: 'from-green-500 to-emerald-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Student Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Student Management</CardTitle>
                  <CardDescription className="text-gray-400">Add and manage students in your organization</CardDescription>
                </div>
                <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Create a new student account and send them login credentials.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {error && (
                        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                          <p className="text-sm text-red-300">{error}</p>
                        </div>
                      )}
                      {success && (
                        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                          <p className="text-sm text-green-300">{success}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            className="bg-slate-800 border-white/10"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            className="bg-slate-800 border-white/10"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@liquidacapital.com"
                          className="bg-slate-800 border-white/10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Temporary Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-slate-800 border-white/10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <Mail className="w-4 h-4 text-violet-400" />
                        <span className="text-sm text-violet-300">Login credentials will be sent to the student&apos;s email</span>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddStudentOpen(false)
                            setError('')
                            setSuccess('')
                          }}
                          className="border-white/10"
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-cyan-600"
                          onClick={handleCreateStudent}
                          disabled={isLoading || !firstName || !lastName || !email || !password}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            'Create Student'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-white/10"
                  />
                </div>
                <Button variant="outline" className="border-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                {loadingStudents ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No students yet.</p>
                    <p className="text-gray-500 text-sm">Click &quot;Add Student&quot; to create one.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Student</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Created</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                {student.first_name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-white font-medium">{student.first_name} {student.last_name}</p>
                                <p className="text-gray-400 text-sm">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-400 text-sm">
                              {new Date(student.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.is_active
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {student.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                                onClick={() => handleEditClick(student)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-400"
                                onClick={() => handleDeleteClick(student)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Student Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update student information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {editError && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-sm text-red-300">{editError}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    className="bg-slate-800 border-white/10"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    disabled={isEditLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    className="bg-slate-800 border-white/10"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    disabled={isEditLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email Address</Label>
                <Input
                  id="editEmail"
                  type="email"
                  className="bg-slate-800 border-white/10"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={isEditLoading}
                />
              </div>
              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  className="border-white/10"
                  disabled={isEditLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-violet-600 to-cyan-600"
                  onClick={handleEditStudent}
                  disabled={isEditLoading || !editFirstName || !editLastName || !editEmail}
                >
                  {isEditLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent className="bg-slate-900 border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Delete Student
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete {deletingStudent?.first_name} {deletingStudent?.last_name}?
                This action cannot be undone and will permanently remove the student from both the platform and authentication system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="border-white/10 bg-transparent text-white hover:bg-white/10"
                disabled={isDeleteLoading}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteStudent}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Student'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Deadline Setting Dialog */}
        <Dialog open={isDeadlineOpen} onOpenChange={setIsDeadlineOpen}>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-cyan-400" />
                Set Course Deadline
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Set a completion deadline for {selectedCourse?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  className="bg-slate-800 border-white/10"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">
                  Students will see this deadline on their dashboard
                </span>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDeadlineOpen(false)}
                  className="border-white/10"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-violet-600 to-cyan-600"
                  onClick={handleSaveDeadline}
                  disabled={!deadlineDate}
                >
                  Save Deadline
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Course Overview & Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-400" />
                  Course Overview & Deadlines
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set completion deadlines for your courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allCourses.map((course) => {
                    const deadline = courseDeadlines[course.id]
                    const deadlineDate = deadline ? new Date(deadline) : null
                    const isOverdue = deadlineDate && deadlineDate < new Date()

                    return (
                      <div key={course.id} className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{course.title}</p>
                              <p className="text-gray-400 text-xs">{course.modules.length} modules • {course.totalDuration}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                            onClick={() => handleSetDeadline({ id: course.id, title: course.title })}
                          >
                            <CalendarClock className="w-4 h-4 mr-1" />
                            {deadline ? 'Edit' : 'Set Deadline'}
                          </Button>
                        </div>
                        {deadline && (
                          <div className="mt-3 flex items-center justify-between pl-13">
                            <div className={`flex items-center gap-2 text-xs ${isOverdue ? 'text-red-400' : 'text-cyan-400'}`}>
                              <Calendar className="w-3 h-3" />
                              <span>
                                Deadline: {deadlineDate?.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                                {isOverdue && ' (Overdue)'}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-red-400 text-xs h-6 px-2"
                              onClick={() => handleRemoveDeadline(course.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.length > 0 ? (
                    students.slice(0, 4).map((student, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="w-2 h-2 rounded-full mt-2 bg-violet-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm">{student.first_name} {student.last_name} was added</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(student.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No recent activity</p>
                      <p className="text-gray-500 text-xs">Add students to see activity here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
