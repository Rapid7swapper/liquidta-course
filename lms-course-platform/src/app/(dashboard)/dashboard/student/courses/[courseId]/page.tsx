'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import MuxVideoPlayer from '@/components/video/MuxVideoPlayer'
import CourseProgressTracker from '@/components/progress/CourseProgressTracker'
import { allCourses, Course } from '@/lib/course-data'
import { createClient } from '@/lib/supabase/client'

interface ModuleProgress {
  moduleId: string
  videoCompleted: boolean
}

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([])

  // Get authenticated user from Supabase
  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
      setIsLoading(false)
    }

    getUser()
  }, [])

  // Load course and progress
  useEffect(() => {
    if (isLoading) return

    const foundCourse = allCourses.find(c => c.id === resolvedParams.courseId)
    if (!foundCourse) {
      router.push('/dashboard/student/courses')
      return
    }
    setCourse(foundCourse)

    // Load progress from database first, then fall back to localStorage
    // If localStorage has data but database doesn't, migrate it to database
    const loadProgress = async () => {
      if (!userId) return

      let dbHasData = false

      try {
        // Try to load from database first
        const response = await fetch(`/api/course-progress?courseId=${resolvedParams.courseId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.progress && data.progress.length > 0) {
            const dbProgress = data.progress[0]
            setModuleProgress(dbProgress.module_progress || [])
            setCurrentModuleIndex(dbProgress.current_module_index || 0)
            dbHasData = true
            return
          }
        }
      } catch (error) {
        console.error('Error loading progress from DB:', error)
      }

      // Fall back to localStorage
      const savedProgress = localStorage.getItem(`course_progress_${userId}_${resolvedParams.courseId}`)
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress)
        const localModuleProgress = parsed.moduleProgress || []
        const localModuleIndex = parsed.currentModuleIndex || 0

        setModuleProgress(localModuleProgress)
        setCurrentModuleIndex(localModuleIndex)

        // If we have localStorage data but no database data, migrate to database
        if (!dbHasData && localModuleProgress.length > 0) {
          console.log('Migrating localStorage progress to database...')
          try {
            await fetch('/api/course-progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                courseId: resolvedParams.courseId,
                moduleProgress: localModuleProgress,
                currentModuleIndex: localModuleIndex
              })
            })
            console.log('Progress migrated to database successfully')
          } catch (error) {
            console.error('Error migrating progress to DB:', error)
          }
        }
      }
    }

    loadProgress()
  }, [resolvedParams.courseId, router, userId, isLoading])

  // Save progress to both database and localStorage whenever it changes
  useEffect(() => {
    if (userId && course && moduleProgress.length > 0) {
      // Save to localStorage (immediate, for offline support)
      localStorage.setItem(
        `course_progress_${userId}_${course.id}`,
        JSON.stringify({
          moduleProgress,
          currentModuleIndex
        })
      )

      // Save to database (async, for cross-device sync and admin visibility)
      const saveToDatabase = async () => {
        try {
          await fetch('/api/course-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId: course.id,
              moduleProgress,
              currentModuleIndex
            })
          })
        } catch (error) {
          console.error('Error saving progress to DB:', error)
        }
      }

      saveToDatabase()
    }
  }, [moduleProgress, currentModuleIndex, userId, course])

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const currentModule = course.modules[currentModuleIndex]

  // Get current module's progress
  const getCurrentModuleProgress = (): ModuleProgress => {
    return moduleProgress.find(m => m.moduleId === currentModule.id) || {
      moduleId: currentModule.id,
      videoCompleted: false
    }
  }

  const currentProgress = getCurrentModuleProgress()

  // Handle video completion
  const handleVideoComplete = () => {
    setModuleProgress(prev => {
      const existing = prev.find(m => m.moduleId === currentModule.id)
      if (existing) {
        return prev.map(m =>
          m.moduleId === currentModule.id ? { ...m, videoCompleted: true } : m
        )
      }
      return [...prev, {
        moduleId: currentModule.id,
        videoCompleted: true
      }]
    })
  }

  // Handle module selection from progress tracker
  const handleModuleSelect = (index: number) => {
    setCurrentModuleIndex(index)
  }

  // Handle next module
  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1)
    }
  }

  // Calculate overall progress (video completion only)
  const completedModules = moduleProgress.filter(m => m.videoCompleted).length
  const overallProgress = Math.round((completedModules / course.modules.length) * 100)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <h1 className="text-white font-semibold">{course.title}</h1>
                <p className="text-gray-400 text-sm">
                  Module {currentModuleIndex + 1} of {course.modules.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-semibold">{overallProgress}% Complete</p>
                <p className="text-gray-400 text-sm">{completedModules} modules done</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Module Title */}
            <motion.div
              key={currentModule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">{currentModule.title}</h2>
              <p className="text-gray-400">{currentModule.description}</p>
            </motion.div>

            {/* Video Player */}
            <MuxVideoPlayer
              playbackId={currentModule.videoPlaybackId}
              title={currentModule.title}
              onVideoComplete={handleVideoComplete}
            />

            {/* Next Module Button - shown after video completion */}
            {currentProgress.videoCompleted && currentModuleIndex < course.modules.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <Button
                  onClick={handleNextModule}
                  className="bg-gradient-to-r from-violet-600 to-cyan-600"
                >
                  Next Module
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Course Completed Message */}
            {currentProgress.videoCompleted && currentModuleIndex === course.modules.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl text-center"
              >
                <h3 className="text-xl font-bold text-green-300 mb-2">Congratulations!</h3>
                <p className="text-green-400/80">You have completed all modules in this course.</p>
              </motion.div>
            )}
          </div>

          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CourseProgressTracker
                course={course}
                currentModuleIndex={currentModuleIndex}
                moduleProgress={moduleProgress}
                onModuleSelect={handleModuleSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
