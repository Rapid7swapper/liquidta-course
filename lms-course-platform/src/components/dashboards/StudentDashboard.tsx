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
  Target,
  AlertCircle
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

// Module progress from course page
interface ModuleProgress {
  moduleId: string
  videoCompleted: boolean
}

// Stored course progress
interface StoredProgress {
  moduleProgress: ModuleProgress[]
  currentModuleIndex: number
}

// Activity item
interface ActivityItem {
  action: string
  course: string
  time: string
  timestamp: number
}

// Deadline item
interface DeadlineItem {
  courseId: string
  courseName: string
  deadline: string
  daysRemaining: number
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [courseProgress, setCourseProgress] = useState<Record<string, StoredProgress>>({})
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([])
  const userId = user.supabaseId || user.id

  // Load progress from localStorage on mount
  useEffect(() => {
    const loadProgress = () => {
      const progress: Record<string, StoredProgress> = {}
      const activities: ActivityItem[] = []

      allCourses.forEach(course => {
        const savedProgress = localStorage.getItem(`course_progress_${userId}_${course.id}`)
        if (savedProgress) {
          try {
            const parsed = JSON.parse(savedProgress) as StoredProgress
            progress[course.id] = parsed

            // Generate activity items from progress
            if (parsed.moduleProgress) {
              parsed.moduleProgress.forEach(mp => {
                if (mp.videoCompleted) {
                  const module = course.modules.find(m => m.id === mp.moduleId)
                  if (module) {
                    activities.push({
                      action: `Completed ${module.title}`,
                      course: course.title,
                      time: 'Recently',
                      timestamp: Date.now()
                    })
                  }
                }
              })
            }
          } catch (e) {
            console.error('Error parsing progress:', e)
          }
        }
      })

      setCourseProgress(progress)

      // Sort activities and take the most recent 4
      const sortedActivities = activities.slice(0, 4)
      if (sortedActivities.length > 0) {
        setRecentActivity(sortedActivities)
      }
    }

    // Load deadlines
    const loadDeadlines = () => {
      const storedDeadlines = localStorage.getItem('course_deadlines')
      if (storedDeadlines) {
        try {
          const parsed = JSON.parse(storedDeadlines) as Record<string, string>
          const deadlineItems: DeadlineItem[] = []

          Object.entries(parsed).forEach(([courseId, deadline]) => {
            const course = allCourses.find(c => c.id === courseId)
            if (course && deadline) {
              const deadlineDate = new Date(deadline)
              const today = new Date()
              const diffTime = deadlineDate.getTime() - today.getTime()
              const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

              deadlineItems.push({
                courseId,
                courseName: course.title,
                deadline: deadlineDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }),
                daysRemaining
              })
            }
          })

          // Sort by days remaining
          deadlineItems.sort((a, b) => a.daysRemaining - b.daysRemaining)
          setDeadlines(deadlineItems)
        } catch (e) {
          console.error('Error parsing deadlines:', e)
        }
      }
    }

    loadProgress()
    loadDeadlines()
  }, [userId])

  // Calculate progress percentage for a course
  const getProgressPercentage = (courseId: string) => {
    const progress = courseProgress[courseId]
    const course = allCourses.find(c => c.id === courseId)
    if (!progress?.moduleProgress || !course) return 0

    const completedCount = progress.moduleProgress.filter(m => m.videoCompleted).length
    return Math.round((completedCount / course.modules.length) * 100)
  }

  // Get completed modules count
  const getCompletedModulesCount = (courseId: string) => {
    const progress = courseProgress[courseId]
    if (!progress?.moduleProgress) return 0
    return progress.moduleProgress.filter(m => m.videoCompleted).length
  }

  // Calculate totals
  const totalModulesCompleted = allCourses.reduce((acc, course) =>
    acc + getCompletedModulesCount(course.id), 0
  )

  const totalModules = allCourses.reduce((acc, course) =>
    acc + course.modules.length, 0
  )

  const overallProgress = totalModules > 0
    ? Math.round((totalModulesCompleted / totalModules) * 100)
    : 0

  const completedCourses = allCourses.filter(c => getProgressPercentage(c.id) === 100).length

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
            { icon: <CheckCircle className="w-6 h-6" />, label: 'Modules Done', value: totalModulesCompleted, color: 'from-green-500 to-emerald-600' },
            { icon: <Award className="w-6 h-6" />, label: 'Courses Completed', value: completedCourses, color: 'from-amber-500 to-orange-600' },
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
            <Link href="/dashboard/student/courses" className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course, index) => {
              const progress = getProgressPercentage(course.id)
              const completedModules = getCompletedModulesCount(course.id)
              const deadline = deadlines.find(d => d.courseId === course.id)

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
                        {deadline && (
                          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                            deadline.daysRemaining <= 3
                              ? 'bg-red-500/80 text-white'
                              : deadline.daysRemaining <= 7
                              ? 'bg-amber-500/80 text-white'
                              : 'bg-cyan-500/80 text-white'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {deadline.daysRemaining <= 0
                              ? 'Overdue'
                              : `${deadline.daysRemaining}d left`}
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
                            {progress === 100 ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" /> Completed
                              </>
                            ) : progress > 0 ? (
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
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.action}</p>
                          <p className="text-gray-400 text-xs">{activity.course} • {activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <TrendingUp className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No activity yet</p>
                      <p className="text-gray-500 text-xs">Start watching videos to track your progress</p>
                    </div>
                  )}
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
                  {deadlines.length > 0 ? (
                    deadlines.map((deadline, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          deadline.daysRemaining <= 3
                            ? 'bg-red-500/20'
                            : deadline.daysRemaining <= 7
                            ? 'bg-amber-500/20'
                            : 'bg-cyan-500/20'
                        }`}>
                          {deadline.daysRemaining <= 3 ? (
                            <AlertCircle className={`w-4 h-4 ${deadline.daysRemaining <= 0 ? 'text-red-400' : 'text-amber-400'}`} />
                          ) : (
                            <Calendar className="w-4 h-4 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">Complete Course</p>
                          <p className="text-gray-400 text-xs">{deadline.courseName}</p>
                        </div>
                        <span className={`text-xs ${
                          deadline.daysRemaining <= 0
                            ? 'text-red-400'
                            : deadline.daysRemaining <= 3
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }`}>
                          {deadline.deadline}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No deadlines set</p>
                      <p className="text-gray-500 text-xs">Your admin will set deadlines for courses</p>
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
