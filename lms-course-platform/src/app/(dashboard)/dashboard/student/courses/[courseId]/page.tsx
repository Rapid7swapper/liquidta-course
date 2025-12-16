'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, Play, Award, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import MuxVideoPlayer from '@/components/video/MuxVideoPlayer'
import ModuleQuiz from '@/components/quiz/ModuleQuiz'
import CourseProgressTracker from '@/components/progress/CourseProgressTracker'
import { allCourses, Course, Module } from '@/lib/course-data'

interface ModuleProgress {
  moduleId: string
  videoCompleted: boolean
  quizCompleted: boolean
  quizScore: number | null
  quizPassed: boolean
}

type ViewMode = 'video' | 'quiz'

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('video')
  const [userId, setUserId] = useState<string>('')

  // Load course and progress
  useEffect(() => {
    const foundCourse = allCourses.find(c => c.id === resolvedParams.courseId)
    if (!foundCourse) {
      router.push('/dashboard/student/courses')
      return
    }
    setCourse(foundCourse)

    // Get user ID from a simple source (in production would come from auth)
    const storedUserId = localStorage.getItem('userId') || `user_${Date.now()}`
    localStorage.setItem('userId', storedUserId)
    setUserId(storedUserId)

    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`course_progress_${storedUserId}_${resolvedParams.courseId}`)
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setModuleProgress(parsed.moduleProgress || [])
      setCurrentModuleIndex(parsed.currentModuleIndex || 0)
    }
  }, [resolvedParams.courseId, router])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (userId && course) {
      localStorage.setItem(
        `course_progress_${userId}_${course.id}`,
        JSON.stringify({
          moduleProgress,
          currentModuleIndex
        })
      )
    }
  }, [moduleProgress, currentModuleIndex, userId, course])

  if (!course) {
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
      videoCompleted: false,
      quizCompleted: false,
      quizScore: null,
      quizPassed: false
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
        videoCompleted: true,
        quizCompleted: false,
        quizScore: null,
        quizPassed: false
      }]
    })
  }

  // Handle quiz completion
  const handleQuizComplete = (score: number, passed: boolean) => {
    setModuleProgress(prev => {
      const existing = prev.find(m => m.moduleId === currentModule.id)
      if (existing) {
        return prev.map(m =>
          m.moduleId === currentModule.id
            ? { ...m, quizCompleted: true, quizScore: score, quizPassed: passed }
            : m
        )
      }
      return [...prev, {
        moduleId: currentModule.id,
        videoCompleted: true,
        quizCompleted: true,
        quizScore: score,
        quizPassed: passed
      }]
    })

    // If passed and not the last module, move to next module after a delay
    if (passed && currentModuleIndex < course.modules.length - 1) {
      setTimeout(() => {
        setCurrentModuleIndex(prev => prev + 1)
        setViewMode('video')
      }, 2000)
    }
  }

  // Handle module selection from progress tracker
  const handleModuleSelect = (index: number) => {
    setCurrentModuleIndex(index)
    setViewMode('video')
  }

  // Calculate overall progress
  const completedModules = moduleProgress.filter(m => m.videoCompleted && m.quizPassed).length
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
          {/* Video/Quiz Area */}
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

            {/* View Mode Tabs */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'video' ? 'default' : 'outline'}
                onClick={() => setViewMode('video')}
                className={viewMode === 'video'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600'
                  : 'border-white/10'}
              >
                <Play className="w-4 h-4 mr-2" />
                Video
                {currentProgress.videoCompleted && (
                  <CheckCircle className="w-4 h-4 ml-2 text-green-400" />
                )}
              </Button>
              <Button
                variant={viewMode === 'quiz' ? 'default' : 'outline'}
                onClick={() => setViewMode('quiz')}
                disabled={!currentProgress.videoCompleted}
                className={viewMode === 'quiz'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600'
                  : 'border-white/10'}
              >
                <Award className="w-4 h-4 mr-2" />
                Quiz
                {currentProgress.quizPassed && (
                  <CheckCircle className="w-4 h-4 ml-2 text-green-400" />
                )}
              </Button>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              {viewMode === 'video' ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <MuxVideoPlayer
                    playbackId={currentModule.videoPlaybackId}
                    title={currentModule.title}
                    onVideoComplete={handleVideoComplete}
                  />

                  {/* Video completion prompt */}
                  {currentProgress.videoCompleted && !currentProgress.quizPassed && currentModule.quiz && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-violet-500/20 border border-violet-500/30 rounded-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Video completed!</p>
                            <p className="text-violet-300 text-sm">Take the quiz to unlock the next module</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setViewMode('quiz')}
                          className="bg-gradient-to-r from-violet-600 to-cyan-600"
                        >
                          Start Quiz
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* If no quiz, show next module button */}
                  {currentProgress.videoCompleted && !currentModule.quiz && currentModuleIndex < course.modules.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex justify-end"
                    >
                      <Button
                        onClick={() => {
                          setModuleProgress(prev => {
                            const existing = prev.find(m => m.moduleId === currentModule.id)
                            if (existing) {
                              return prev.map(m =>
                                m.moduleId === currentModule.id
                                  ? { ...m, quizCompleted: true, quizScore: 100, quizPassed: true }
                                  : m
                              )
                            }
                            return [...prev, {
                              moduleId: currentModule.id,
                              videoCompleted: true,
                              quizCompleted: true,
                              quizScore: 100,
                              quizPassed: true
                            }]
                          })
                          setCurrentModuleIndex(prev => prev + 1)
                        }}
                        className="bg-gradient-to-r from-violet-600 to-cyan-600"
                      >
                        Continue to Next Module
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {currentModule.quiz ? (
                    <ModuleQuiz
                      quiz={currentModule.quiz}
                      onQuizComplete={handleQuizComplete}
                      onRetry={() => {}}
                    />
                  ) : (
                    <div className="p-8 bg-slate-800/50 rounded-xl text-center">
                      <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No quiz for this module</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
