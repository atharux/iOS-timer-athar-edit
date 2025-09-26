import { useState, useEffect } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react'
import { X, Play, Pause } from 'lucide-react'

interface ActiveTimer {
  id: number
  originalTime: string
  remainingTime: number // in seconds
  duration: string
  isPaused: boolean
}

interface ActiveTimerToastProps {
  timer: ActiveTimer
  onDelete: (id: number) => void
  onPause: (id: number) => void
}

export function ActiveTimerToast({ timer, onDelete, onPause }: ActiveTimerToastProps) {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime)
  const [progress, setProgress] = useState(100)
  
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5])
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95])

  // Sync local state with timer prop changes
  useEffect(() => {
    setRemainingTime(timer.remainingTime)
  }, [timer.remainingTime])

  useEffect(() => {
    if (timer.isPaused) return // Don't run timer when paused
    
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          // Use setTimeout to defer the delete call to avoid setState during render
          setTimeout(() => onDelete(timer.id), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer.id, timer.isPaused, onDelete])

  useEffect(() => {
    const progressPercent = (remainingTime / timer.remainingTime) * 100
    setProgress(progressPercent)
  }, [remainingTime, timer.remainingTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onDelete(timer.id)
    } else {
      x.set(0)
    }
  }

  return (
    <motion.div
      className="bg-black/80 backdrop-blur-md px-4 py-2 mx-4 rounded-lg border border-white/10"
      style={{ x, opacity, scale }}
      drag="x"
      dragConstraints={{ left: -150, right: 150 }}
      onDragEnd={handleDragEnd}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      whileDrag={{ cursor: "grabbing" }}
    >
      <div className="flex items-center justify-between">
        {/* Progress bar on the left */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-2 h-6 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className={`w-full rounded-full origin-bottom ${
                timer.isPaused ? 'bg-orange-500' : 'bg-green-500'
              }`}
              initial={{ height: "100%" }}
              animate={{ height: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="text-white/70 text-xs">
            Timer • {timer.originalTime}
          </div>
        </div>

        {/* Timer countdown and controls on the right */}
        <div className="flex items-center gap-2">
          <motion.div 
            className="text-white text-sm font-mono"
            animate={{ 
              opacity: !timer.isPaused && remainingTime <= 10 ? [1, 0.3, 1] : 1 
            }}
            transition={{ duration: 0.5, repeat: !timer.isPaused && remainingTime <= 10 ? Infinity : 0 }}
          >
            {formatTime(remainingTime)}
          </motion.div>
          
          {/* Play/Pause button */}
          <motion.button
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              timer.isPaused 
                ? 'bg-green-500/80 hover:bg-green-400/80' 
                : 'bg-orange-500/80 hover:bg-orange-400/80'
            }`}
            onClick={() => onPause(timer.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {timer.isPaused ? (
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            ) : (
              <Pause className="w-3 h-3 text-white fill-white" />
            )}
          </motion.button>
          
          {/* Delete button */}
          <motion.button
            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            onClick={() => onDelete(timer.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </div>
      
      {/* Swipe indicator */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full"
        animate={{ 
          opacity: Math.abs(x.get()) > 0 ? 0.7 : 0.3,
          width: Math.abs(x.get()) > 50 ? 12 : 32
        }}
      />
    </motion.div>
  )
}