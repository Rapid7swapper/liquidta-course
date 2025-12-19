'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface InactivityHandlerProps {
  // Timeout in minutes before showing warning (default: 115 minutes = 1h 55m)
  warningTimeout?: number
  // Timeout in minutes before auto-logout (default: 120 minutes = 2 hours)
  logoutTimeout?: number
}

export function InactivityHandler({
  warningTimeout = 115,
  logoutTimeout = 120,
}: InactivityHandlerProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const lastActivityRef = useRef<number>(Date.now())
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const warningMs = warningTimeout * 60 * 1000
  const logoutMs = logoutTimeout * 60 * 1000

  const handleLogout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in?reason=inactivity')
  }, [router])

  const resetTimers = useCallback(() => {
    lastActivityRef.current = Date.now()
    setShowWarning(false)

    // Clear existing timers
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true)
      const remainingSeconds = Math.floor((logoutMs - warningMs) / 1000)
      setCountdown(remainingSeconds)

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, warningMs)

    // Set logout timer
    logoutTimerRef.current = setTimeout(() => {
      handleLogout()
    }, logoutMs)
  }, [warningMs, logoutMs, handleLogout])

  const handleActivity = useCallback(() => {
    // Only reset if not already recently reset (throttle to once per second)
    const now = Date.now()
    if (now - lastActivityRef.current > 1000) {
      resetTimers()
    }
  }, [resetTimers])

  const handleStayLoggedIn = useCallback(() => {
    resetTimers()
  }, [resetTimers])

  useEffect(() => {
    // Initialize timers
    resetTimers()

    // Activity events to track
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [resetTimers, handleActivity])

  // Format countdown as minutes:seconds
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Session Timeout Warning
        </h2>
        <p className="text-gray-600 mb-4">
          You will be automatically logged out due to inactivity in{' '}
          <span className="font-bold text-red-600">{formatCountdown(countdown)}</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleStayLoggedIn}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Stay Logged In
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  )
}
