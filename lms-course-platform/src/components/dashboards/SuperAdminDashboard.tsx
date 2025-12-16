'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Shield,
  TrendingUp,
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  Activity,
  Award,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardHeader from './DashboardHeader'
import { AuthUser } from '@/lib/auth'

interface DbUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
}

interface SuperAdminDashboardProps {
  user: AuthUser
}

export default function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Users from database
  const [admins, setAdmins] = useState<DbUser[]>([])
  const [students, setStudents] = useState<DbUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<DbUser | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editError, setEditError] = useState('')
  const [isEditLoading, setIsEditLoading] = useState(false)

  // Delete confirmation state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<DbUser | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const [adminsRes, studentsRes] = await Promise.all([
        fetch('/api/users?role=admin'),
        fetch('/api/users?role=student')
      ])

      if (adminsRes.ok) {
        const data = await adminsRes.json()
        setAdmins(data.users || [])
      }

      if (studentsRes.ok) {
        const data = await studentsRes.json()
        setStudents(data.users || [])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleCreateAdmin = async () => {
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
          role: 'admin'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create administrator')
      }

      setSuccess(`Administrator ${firstName} ${lastName} created successfully!`)
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')

      // Refresh the admin list
      fetchUsers()

      // Close dialog after a short delay
      setTimeout(() => {
        setIsAddUserOpen(false)
        setSuccess('')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create administrator')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle edit user
  const handleEditClick = (user: DbUser) => {
    setEditingUser(user)
    setEditFirstName(user.first_name)
    setEditLastName(user.last_name)
    setEditEmail(user.email)
    setEditError('')
    setIsEditOpen(true)
  }

  const handleEditUser = async () => {
    if (!editingUser) return

    setEditError('')
    setIsEditLoading(true)

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
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
        throw new Error(data.error || 'Failed to update user')
      }

      // Refresh the user list
      fetchUsers()
      setIsEditOpen(false)
      setEditingUser(null)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setIsEditLoading(false)
    }
  }

  // Handle delete user
  const handleDeleteClick = (user: DbUser) => {
    setDeletingUser(user)
    setIsDeleteOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!deletingUser) return

    setIsDeleteLoading(true)

    try {
      const response = await fetch(`/api/users/${deletingUser.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user')
      }

      // Refresh the user list
      fetchUsers()
      setIsDeleteOpen(false)
      setDeletingUser(null)
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const totalUsers = admins.length + students.length
  const totalProgress = students.length > 0 ? 52 : 0 // Will be calculated from real data later

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
            Platform Control Center
          </h2>
          <p className="text-gray-400">Complete oversight of all administrators, students, and platform activity.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { icon: <Shield className="w-6 h-6" />, label: 'Administrators', value: admins.length, color: 'from-red-500 to-pink-600' },
            { icon: <Users className="w-6 h-6" />, label: 'Total Students', value: students.length, color: 'from-violet-500 to-purple-600' },
            { icon: <Activity className="w-6 h-6" />, label: 'Active Users', value: totalUsers - 1, color: 'from-green-500 to-emerald-600' },
            { icon: <TrendingUp className="w-6 h-6" />, label: 'Avg. Progress', value: `${Math.round(totalProgress)}%`, color: 'from-cyan-500 to-blue-600' },
            { icon: <Award className="w-6 h-6" />, label: 'Certificates', value: 4, color: 'from-amber-500 to-orange-600' },
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

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="admins" className="space-y-6">
            <TabsList className="bg-slate-900/50 border border-white/10 p-1">
              <TabsTrigger value="admins" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600">
                <Shield className="w-4 h-4 mr-2" />
                Administrators
              </TabsTrigger>
              <TabsTrigger value="students" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-cyan-600">
                <Users className="w-4 h-4 mr-2" />
                All Students
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Administrators Tab */}
            <TabsContent value="admins">
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Administrator Management</CardTitle>
                      <CardDescription className="text-gray-400">Create and manage platform administrators</CardDescription>
                    </div>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Administrator
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle>Add New Administrator</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Create a new administrator account with full student management capabilities.
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
                              <Label htmlFor="adminFirstName">First Name</Label>
                              <Input
                                id="adminFirstName"
                                placeholder="John"
                                className="bg-slate-800 border-white/10"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={isLoading}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="adminLastName">Last Name</Label>
                              <Input
                                id="adminLastName"
                                placeholder="Manager"
                                className="bg-slate-800 border-white/10"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adminEmail">Email Address</Label>
                            <Input
                              id="adminEmail"
                              type="email"
                              placeholder="admin@liquidacapital.com"
                              className="bg-slate-800 border-white/10"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adminPassword">Temporary Password</Label>
                            <Input
                              id="adminPassword"
                              type="password"
                              placeholder="••••••••"
                              className="bg-slate-800 border-white/10"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-300 font-medium">Administrator Access</span>
                            </div>
                            <p className="text-sm text-red-300/80 mt-1">This user will be able to create and manage student accounts.</p>
                          </div>
                          <div className="flex justify-end gap-3 mt-6">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsAddUserOpen(false)
                                setError('')
                                setSuccess('')
                              }}
                              className="border-white/10"
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-gradient-to-r from-red-600 to-pink-600"
                              onClick={handleCreateAdmin}
                              disabled={isLoading || !firstName || !lastName || !email || !password}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                'Create Administrator'
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    {loadingUsers ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                      </div>
                    ) : admins.length === 0 ? (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No administrators yet.</p>
                        <p className="text-gray-500 text-sm">Click &quot;Add Administrator&quot; to create one.</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Administrator</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Created</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.map((admin) => (
                            <tr key={admin.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                    {admin.first_name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">{admin.first_name} {admin.last_name}</p>
                                    <p className="text-gray-400 text-sm">{admin.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-gray-400 text-sm">
                                  {new Date(admin.created_at).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                                  admin.is_active
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {admin.is_active ? (
                                    <>
                                      <CheckCircle className="w-3 h-3" />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3" />
                                      Inactive
                                    </>
                                  )}
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
                                    onClick={() => handleEditClick(admin)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-red-400"
                                    onClick={() => handleDeleteClick(admin)}
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
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students">
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">All Students</CardTitle>
                      <CardDescription className="text-gray-400">View and manage all students across all administrators</CardDescription>
                    </div>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search students..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64 bg-slate-800 border-white/10"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-40 bg-slate-800 border-white/10">
                          <SelectValue placeholder="Filter by admin" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                          <SelectItem value="all">All Admins</SelectItem>
                          {admins.map((admin) => (
                            <SelectItem key={admin.id} value={admin.id}>{admin.first_name} {admin.last_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Student</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Managed By</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Progress</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Courses</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Last Active</th>
                          <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center">
                              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-400">No students yet.</p>
                            </td>
                          </tr>
                        ) : (
                          students.map((student) => (
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
                                <span className="text-amber-400 text-sm">-</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="w-32">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-white text-sm">0%</span>
                                  </div>
                                  <Progress value={0} className="h-2 bg-slate-700" />
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-white">0/0</span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-gray-400 text-sm">
                                  {new Date(student.created_at).toLocaleDateString()}
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
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      Platform Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { label: 'Overall Completion Rate', value: 67 },
                        { label: 'Average Quiz Score', value: 84 },
                        { label: 'Student Engagement', value: 78 },
                        { label: 'Certification Rate', value: 52 },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400">{stat.label}</span>
                            <span className="text-white font-medium">{stat.value}%</span>
                          </div>
                          <Progress value={stat.value} className="h-3 bg-slate-700" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-400" />
                      Admin Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {admins.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-gray-400">No administrators to display.</p>
                        </div>
                      ) : (
                        admins.map((admin, index) => (
                          <div key={admin.id} className="p-4 rounded-lg bg-slate-800/50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                                  {admin.first_name.charAt(0)}
                                </div>
                                <span className="text-white font-medium">{admin.first_name} {admin.last_name}</span>
                              </div>
                              <span className="text-sm text-gray-400">0 students</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-xl font-bold text-white">0</p>
                                <p className="text-xs text-gray-400">Active</p>
                              </div>
                              <div>
                                <p className="text-xl font-bold text-cyan-400">0%</p>
                                <p className="text-xs text-gray-400">Avg Progress</p>
                              </div>
                              <div>
                                <p className="text-xl font-bold text-green-400">{index}</p>
                                <p className="text-xs text-gray-400">Certificates</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/10 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      System Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { type: 'warning', message: '2 students have not logged in for 7+ days', action: 'Send Reminder' },
                        { type: 'info', message: 'New course available: Advanced Compliance Training', action: 'Assign' },
                        { type: 'success', message: '3 students completed certification this week', action: 'View' },
                      ].map((alert, index) => (
                        <div key={index} className={`p-4 rounded-lg flex items-center justify-between ${
                          alert.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                          alert.type === 'info' ? 'bg-blue-500/10 border border-blue-500/20' :
                          'bg-green-500/10 border border-green-500/20'
                        }`}>
                          <div className="flex items-center gap-3">
                            {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                            {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-400" />}
                            {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                            <span className={`text-sm ${
                              alert.type === 'warning' ? 'text-amber-300' :
                              alert.type === 'info' ? 'text-blue-300' :
                              'text-green-300'
                            }`}>{alert.message}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                            {alert.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Edit User Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Edit {editingUser?.role === 'admin' ? 'Administrator' : 'Student'}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update user information.
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
                  className={editingUser?.role === 'admin'
                    ? "bg-gradient-to-r from-red-600 to-pink-600"
                    : "bg-gradient-to-r from-violet-600 to-cyan-600"
                  }
                  onClick={handleEditUser}
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
                Delete {deletingUser?.role === 'admin' ? 'Administrator' : 'Student'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete {deletingUser?.first_name} {deletingUser?.last_name}?
                This action cannot be undone and will permanently remove the user from both the platform and authentication system.
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
                onClick={handleDeleteUser}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  `Delete ${deletingUser?.role === 'admin' ? 'Administrator' : 'Student'}`
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
