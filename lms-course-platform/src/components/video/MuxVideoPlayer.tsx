'use client'

import MuxPlayer from '@mux/mux-player-react'
import { useState, useRef, useEffect } from 'react'

interface MuxVideoPlayerProps {
  playbackId: string | null
  title: string
  onVideoComplete?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  autoPlay?: boolean
}

export default function MuxVideoPlayer({
  playbackId,
  title,
  onVideoComplete,
  onTimeUpdate,
  autoPlay = false
}: MuxVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const playerRef = useRef<HTMLElement>(null)

  // Reset hasCompleted state when video changes
  useEffect(() => {
    setHasCompleted(false)
  }, [playbackId])

  // Handle video ended
  const handleEnded = () => {
    if (!hasCompleted) {
      setHasCompleted(true)
      onVideoComplete?.()
    }
  }

  // Handle time updates for progress tracking
  const handleTimeUpdate = (event: Event) => {
    const target = event.target as HTMLVideoElement
    if (target && onTimeUpdate) {
      onTimeUpdate(target.currentTime, target.duration)
    }

    // Mark as complete if watched 90% or more
    if (target && target.duration && !hasCompleted) {
      const percentWatched = (target.currentTime / target.duration) * 100
      if (percentWatched >= 90) {
        setHasCompleted(true)
        onVideoComplete?.()
      }
    }
  }

  // If no playback ID, show placeholder
  if (!playbackId) {
    return (
      <div className="w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-violet-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-lg font-medium">{title}</p>
          <p className="text-gray-500 text-sm mt-2">Video coming soon</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
      <MuxPlayer
        ref={playerRef as React.RefObject<any>}
        playbackId={playbackId}
        metadata={{
          video_title: title,
        }}
        streamType="on-demand"
        autoPlay={autoPlay}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{
          height: '100%',
          width: '100%',
        }}
        accentColor="#8b5cf6"
        primaryColor="#ffffff"
        secondaryColor="rgba(255, 255, 255, 0.8)"
      />
    </div>
  )
}
