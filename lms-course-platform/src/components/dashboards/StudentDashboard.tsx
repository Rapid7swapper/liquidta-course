'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Play,
  CheckCircle,
  ChevronRight,
  GraduationCap,
  Calendar,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import DashboardHeader from './DashboardHeader'
import { AuthUser } from '@/lib/auth'
import { allCourses } from '@/lib/course-data'

interface StudentDashboardProps {
  user: AuthUser
}

// Course progress state for enrolled courses
interface CourseProgress {
  courseId: string
  completedModules: number[]
  quizScores: Record<string, number>
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  // In production, this would come from database
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`progress_${user.supabaseId || user.clerkId}`)
    if (savedProgress) {
      setCourseProgress(JSON.parse(savedProgress))
    }
  }, [user.supabaseId, user.clerkId])

  // Calculate progress percentage for a course
  const getProgressPercentage = (courseId: string) => {
    const progress = courseProgress.find(p => p.courseId === courseId)
    const course = allCourses.find(c => c.id === courseId)
    if (!progress || !course) return 0
    return Math.round((progress.completedModules.length / course.modules.length) * 100)
  }

  // Get completed modules count
  const getCompletedModulesCount = (courseId: string) => {
    const progress = courseProgress.find(p => p.courseId === courseId)
    return progress?.completedModules.length || 0
  }

  const overallProgress = allCourses.length > 0
    ? Math.round(allCourses.reduce((acc, course) => acc + getProgressPercentage(course.id), 0) / allCourses.length)
    : 0

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
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-400">Continue your learning journey and achieve your goals.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <BookOpen className="w-6 h-6" />, label: 'Enrolled Courses', value: allCourses.length, color: 'from-violet-500 to-purple-600' },
            { icon: <Target className="w-6 h-6" />, label: 'Overall Progress', value: `${overallProgress}%`, color: 'from-cyan-500 to-blue-600' },
            { icon: <CheckCircle className="w-6 h-6" />, label: 'Completed', value: allCourses.filter(c => getProgressPercentage(c.id) === 100).length, color: 'from-green-500 to-emerald-600' },
            { icon: <Award className="w-6 h-6" />, label: 'Certificates', value: allCourses.filter(c => getProgressPercentage(c.id) === 100).length, color: 'from-amber-500 to-orange-600' },
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

        {/* Continue Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Continue Learning</h3>
            <Link href="/dashboard/courses" className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course, index) => {
              const progress = getProgressPercentage(course.id)
              const completedModules = getCompletedModulesCount(course.id)
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link href={`/dashboard/student/courses/${course.id}`}>
                    <Card className="bg-slate-900/50 border-white/10 hover:border-violet-500/50 transition-all group cursor-pointer overflow-hidden">
                      <div className="h-32 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <GraduationCap className="w-16 h-16 text-white/20" />
                        </div>
                        {progress > 0 && (
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-violet-500/80 text-white text-xs font-medium">
                            {progress}% Complete
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg group-hover:text-violet-400 transition-colors">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{completedModules}/{course.modules.length} modules</span>
                            <span className="text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {course.totalDuration}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2 bg-slate-700" />
                          <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500">
                            {progress > 0 ? (
                              <>
                                <Play className="w-4 h-4 mr-2" /> Continue
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" /> Start Course
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity & Upcoming */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Completed Module 6', course: 'Financial Analysis', time: '2 hours ago' },
                    { action: 'Quiz Score: 92%', course: 'Financial Analysis', time: '3 hours ago' },
                    { action: 'Started Module 2', course: 'Risk Management', time: 'Yesterday' },
                    { action: 'Enrolled in course', course: 'Compliance & Regulations', time: '3 days ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-violet-400 mt-2" />
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-gray-400 text-xs">{activity.course} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { task: 'Complete Risk Assessment Quiz', course: 'Risk Management', due: 'Dec 15, 2024' },
                    { task: 'Finish Module 3', course: 'Risk Management', due: 'Dec 18, 2024' },
                    { task: 'Final Exam', course: 'Financial Analysis', due: 'Dec 20, 2024' },
                  ].map((deadline, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{deadline.task}</p>
                        <p className="text-gray-400 text-xs">{deadline.course}</p>
                      </div>
                      <span className="text-xs text-amber-400">{deadline.due}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
