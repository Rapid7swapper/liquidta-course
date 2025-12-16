'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, GraduationCap, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { allCourses } from '@/lib/course-data'

interface CourseProgress {
  courseId: string
  completedModules: number
  totalModules: number
}

export default function StudentCoursesPage() {
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])

  useEffect(() => {
    // Load progress from localStorage for all courses
    const userId = localStorage.getItem('userId') || ''
    const progress: CourseProgress[] = []

    allCourses.forEach(course => {
      const savedProgress = localStorage.getItem(`course_progress_${userId}_${course.id}`)
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress)
        const completedModules = (parsed.moduleProgress || []).filter(
          (m: { videoCompleted: boolean; quizPassed: boolean }) => m.videoCompleted && m.quizPassed
        ).length
        progress.push({
          courseId: course.id,
          completedModules,
          totalModules: course.modules.length
        })
      } else {
        progress.push({
          courseId: course.id,
          completedModules: 0,
          totalModules: course.modules.length
        })
      }
    })

    setCourseProgress(progress)
  }, [])

  const getProgress = (courseId: string) => {
    const progress = courseProgress.find(p => p.courseId === courseId)
    if (!progress) return { percentage: 0, completed: 0, total: 0 }
    return {
      percentage: Math.round((progress.completedModules / progress.totalModules) * 100),
      completed: progress.completedModules,
      total: progress.totalModules
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
          <p className="text-gray-400">Browse and access your enrolled courses.</p>
        </motion.div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course, index) => {
            const progress = getProgress(course.id)
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/dashboard/student/courses/${course.id}`}>
                  <Card className="bg-slate-900/50 border-white/10 hover:border-violet-500/50 transition-all group cursor-pointer overflow-hidden h-full">
                    <div className="h-40 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap className="w-20 h-20 text-white/20" />
                      </div>
                      {progress.percentage > 0 && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-violet-500/80 text-white text-xs font-medium">
                          {progress.percentage}% Complete
                        </div>
                      )}
                      {progress.percentage === 100 && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-green-500/80 text-white text-xs font-medium">
                          Completed
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg group-hover:text-violet-400 transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-sm line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {progress.completed}/{progress.total} modules
                          </span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.totalDuration}
                          </span>
                        </div>
                        <Progress value={progress.percentage} className="h-2 bg-slate-700" />
                        <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500">
                          {progress.percentage > 0 && progress.percentage < 100 ? (
                            <>
                              <Play className="w-4 h-4 mr-2" /> Continue Learning
                            </>
                          ) : progress.percentage === 100 ? (
                            <>
                              <BookOpen className="w-4 h-4 mr-2" /> Review Course
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

        {/* Empty State */}
        {allCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses available</h3>
            <p className="text-gray-400">Check back soon for new courses.</p>
          </div>
        )}
      </main>
    </div>
  )
}
