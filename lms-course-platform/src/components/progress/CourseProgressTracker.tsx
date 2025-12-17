'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Circle, Lock, Play, BookOpen, Trophy } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Course } from '@/lib/course-data'

interface ModuleProgress {
  moduleId: string
  videoCompleted: boolean
}

interface CourseProgressTrackerProps {
  course: Course
  currentModuleIndex: number
  moduleProgress: ModuleProgress[]
  onModuleSelect: (moduleIndex: number) => void
}

export default function CourseProgressTracker({
  course,
  currentModuleIndex,
  moduleProgress,
  onModuleSelect
}: CourseProgressTrackerProps) {
  const totalModules = course.modules.length

  // Calculate overall progress (video completion only)
  const completedModules = moduleProgress.filter(m => m.videoCompleted).length
  const overallProgress = Math.round((completedModules / totalModules) * 100)

  // Check if module is accessible (unlocked)
  const isModuleAccessible = (moduleIndex: number) => {
    if (moduleIndex === 0) return true

    // Module is accessible if previous module's video is completed
    const prevModule = moduleProgress.find(
      m => m.moduleId === course.modules[moduleIndex - 1].id
    )
    return prevModule?.videoCompleted === true
  }

  // Get module status
  const getModuleStatus = (moduleIndex: number) => {
    const progress = moduleProgress.find(
      m => m.moduleId === course.modules[moduleIndex].id
    )

    if (!progress) {
      return moduleIndex === 0 ? 'available' : 'locked'
    }

    if (progress.videoCompleted) {
      return 'completed'
    }

    return isModuleAccessible(moduleIndex) ? 'available' : 'locked'
  }

  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Header with overall progress */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-400" />
            Course Progress
          </h3>
          <span className="text-violet-400 font-bold">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2 bg-slate-700" />
        <p className="text-gray-400 text-sm mt-2">
          {completedModules} of {totalModules} modules completed
        </p>
      </div>

      {/* Module List */}
      <div className="max-h-[500px] overflow-y-auto">
        {course.modules.map((module, index) => {
          const status = getModuleStatus(index)
          const isActive = index === currentModuleIndex
          const isAccessible = isModuleAccessible(index)

          return (
            <motion.button
              key={module.id}
              onClick={() => isAccessible && onModuleSelect(index)}
              disabled={!isAccessible}
              className={`w-full p-4 flex items-start gap-3 border-b border-white/5 transition-all text-left ${
                isActive
                  ? 'bg-violet-500/10 border-l-2 border-l-violet-500'
                  : isAccessible
                  ? 'hover:bg-white/5 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              whileHover={isAccessible ? { x: 4 } : {}}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {status === 'completed' ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : status === 'available' ? (
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center">
                    {isActive ? (
                      <Play className="w-3 h-3 text-violet-400" />
                    ) : (
                      <Circle className="w-3 h-3 text-violet-400" />
                    )}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                    <Lock className="w-3 h-3 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Module Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isActive
                      ? 'text-violet-300'
                      : status === 'completed'
                      ? 'text-green-300'
                      : isAccessible
                      ? 'text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {module.title}
                </p>
                {module.duration && (
                  <p className="text-xs text-gray-500 mt-0.5">{module.duration}</p>
                )}
              </div>

              {/* Module number badge */}
              <div className="flex-shrink-0">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-300'
                      : status === 'completed'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-slate-700 text-gray-400'
                  }`}
                >
                  {index + 1}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Completion Badge */}
      {overallProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-t border-green-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-300 font-semibold">Course Completed!</p>
              <p className="text-green-400/80 text-sm">Congratulations on finishing all modules</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
