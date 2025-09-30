import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { X, Play, Pause, Plus, Clock, Coffee, Dumbbell, Book, Utensils, Check } from 'lucide-react'

// Types
interface Timer {
  id: number
  time: string
  duration: string
  isActive: boolean
  label?: string
  category?: string
}

interface ActiveTimer {
  id: number
  originalTime: string
  remainingTime: number
  duration: string
  isPaused: boolean
  label?: string
}

// Timer Presets
const TIMER_PRESETS = [
  { label: 'Quick Break', time: '5:00', duration: '5 min', category: 'break', icon: Coffee },
  { label: 'Pomodoro', time: '25:00', duration: '25 min', category: 'work', icon: Book },
  { label: 'Workout', time: '30:00', duration: '30 min', category: 'fitness', icon: Dumbbell },
  { label: 'Cooking', time: '15:00', duration: '15 min', category: 'cooking', icon: Utensils },
]

// Components
function StatusBar() {
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="flex justify-between items-center px-6 pt-3 pb-2 text-white text-sm">
      <span className="font-semibold">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      <div className="flex items-center gap-1">
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-1 h-1 rounded-full bg-white" />
        <span className="ml-1">100%</span>
      </div>
    </div>
  )
}

function TimerHeader({ isEditing, onEditToggle }: { isEditing: boolean, onEditToggle: () => void }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white">Timer</h1>
      <motion.button
        className="text-orange-400 font-medium text-lg"
        onClick={onEditToggle}
        whileTap={{ scale: 0.95 }}
      >
        {isEditing ? 'Done' : 'Edit'}
      </motion.button>
    </div>
  )
}

function TimePicker({ onTimeSelect, onClose }: { onTimeSelect: (time: string, duration: string, label: string) => void, onClose: () => void }) {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const [label, setLabel] = useState('')
  
  const handleConfirm = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    if (totalSeconds === 0) return
    
    const timeStr = hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`
    
    let durationStr = ''
    if (hours > 0) durationStr += `${hours} hr`
    if (hours > 0 && minutes > 0) durationStr += ', '
    if (minutes > 0) durationStr += `${minutes} min`
    if (hours === 0 && seconds > 0) durationStr += `, ${seconds} sec`
    
    onTimeSelect(timeStr, durationStr, label || 'Custom Timer')
    onClose()
  }
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        className="relative w-full max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-t-3xl p-6 border-t border-white/10"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">New Timer</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Timer name (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full bg-white/10 text-white rounded-xl px-4 py-3 mb-6 outline-none border border-white/20 focus:border-orange-400"
        />
        
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="text-white/60 text-sm mb-2">Hours</div>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
              className="w-20 bg-white/10 text-white text-2xl text-center rounded-xl py-3 outline-none border border-white/20 focus:border-orange-400"
            />
          </div>
          <div className="text-white text-2xl mt-8">:</div>
          <div className="flex flex-col items-center">
            <div className="text-white/60 text-sm mb-2">Min</div>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-20 bg-white/10 text-white text-2xl text-center rounded-xl py-3 outline-none border border-white/20 focus:border-orange-400"
            />
          </div>
          <div className="text-white text-2xl mt-8">:</div>
          <div className="flex flex-col items-center">
            <div className="text-white/60 text-sm mb-2">Sec</div>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-20 bg-white/10 text-white text-2xl text-center rounded-xl py-3 outline-none border border-white/20 focus:border-orange-400"
            />
          </div>
        </div>
        
        <motion.button
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold"
          onClick={handleConfirm}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add Timer
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function CompletionNotification({ timer, onDismiss }: { timer: ActiveTimer, onDismiss: () => void }) {
  useEffect(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS563+dTgwOUKXh8LZjHAU5jtbyzHksAyV2xvDdkEELFGCz6uunVRQLRp/g8r1rIAUsgs/y2IQzBxlpu+t/nU0MDVOl4vC2ZBwGOY7X8s15LAQmeMfx3I9CC...') // Simplified beep
    audio.play().catch(() => {}) // Play notification sound
    
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])
  
  return (
    <motion.div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
      initial={{ y: -100, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -100, opacity: 0, scale: 0.9 }}
    >
      <Check className="w-6 h-6" />
      <div>
        <div className="font-semibold">{timer.label || 'Timer'} Complete!</div>
        <div className="text-sm opacity-90">{timer.duration}</div>
      </div>
      <button onClick={onDismiss} className="ml-4">
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

function ActiveTimerToast({ timer, onDelete, onPause }: { 
  timer: ActiveTimer
  onDelete: (id: number) => void
  onPause: (id: number) => void 
}) {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime)
  const [progress, setProgress] = useState(100)
  
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5])

  useEffect(() => {
    setRemainingTime(timer.remainingTime)
  }, [timer.remainingTime])

  useEffect(() => {
    if (timer.isPaused) return
    
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
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
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: -150, right: 150 }}
      onDragEnd={handleDragEnd}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-2 h-6 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className={`w-full rounded-full origin-bottom ${timer.isPaused ? 'bg-orange-500' : 'bg-green-500'}`}
              animate={{ height: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="text-white/70 text-xs">
            {timer.label || 'Timer'} • {timer.originalTime}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div 
            className="text-white text-sm font-mono"
            animate={{ opacity: !timer.isPaused && remainingTime <= 10 ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 0.5, repeat: !timer.isPaused && remainingTime <= 10 ? Infinity : 0 }}
          >
            {formatTime(remainingTime)}
          </motion.div>
          
          <motion.button
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              timer.isPaused ? 'bg-green-500/80 hover:bg-green-400/80' : 'bg-orange-500/80 hover:bg-orange-400/80'
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
    </motion.div>
  )
}

function RecentTimerItem({ timer, isEditing, onDelete, onStart, isPaused, isActive }: {
  timer: Timer
  isEditing: boolean
  onDelete: (id: number) => void
  onStart: (id: number) => void
  isPaused: boolean
  isActive: boolean
}) {
  const x = useMotionValue(0)
  const bgColor = useTransform(x, [-100, 0], ['rgb(239, 68, 68)', 'rgb(255, 255, 255, 0.05)'])

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      onDelete(timer.id)
    } else {
      x.set(0)
    }
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl mb-3"
      layout
    >
      {/* Delete background */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-end px-6"
        style={{ backgroundColor: bgColor }}
      >
        <X className="w-6 h-6 text-white" />
      </motion.div>

      {/* Timer card */}
      <motion.div
        className="relative bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10"
        style={{ x }}
        drag={isEditing ? "x" : false}
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditing && (
              <motion.button
                className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center"
                onClick={() => onDelete(timer.id)}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-3 h-0.5 bg-red-500" />
              </motion.button>
            )}
            
            <div>
              <div className="text-white text-2xl font-light">{timer.time}</div>
              {timer.label && (
                <div className="text-white/60 text-sm">{timer.label}</div>
              )}
            </div>
          </div>
          
          {!isEditing && (
            <motion.button
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                isActive
                  ? isPaused
                    ? 'bg-orange-500/80 text-white'
                    : 'bg-green-500/80 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-400'
              }`}
              onClick={() => onStart(timer.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isActive && !isPaused}
            >
              {isActive ? (isPaused ? 'Paused' : 'Running') : 'Start'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function BottomNavigation() {
  return (
    <div className="flex justify-around items-center py-4 bg-black/20 backdrop-blur-md border-t border-white/10">
      {['World Clock', 'Alarm', 'Stopwatch', 'Timer'].map((item, idx) => (
        <button 
          key={item}
          className={`flex flex-col items-center gap-1 ${idx === 3 ? 'text-orange-400' : 'text-white/60'}`}
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs">{item}</span>
        </button>
      ))}
    </div>
  )
}

// Main App
export default function App() {
  const [isEditing, setIsEditing] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [completedTimer, setCompletedTimer] = useState<ActiveTimer | null>(null)
  
  const [recentTimers, setRecentTimers] = useState<Timer[]>([
    { id: 1, time: '1:30:00', duration: '1 hr, 30 min', isActive: false, label: 'Study Session' },
    { id: 2, time: '5:00', duration: '5 min', isActive: false, label: 'Quick Break' },
    { id: 3, time: '18:00', duration: '18 min', isActive: false, label: 'Meditation' }
  ])

  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([])

  const parseTimeToSeconds = (timeString: string) => {
    const parts = timeString.split(':')
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1])
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    }
    return 0
  }

  const handleStartTimer = (timerId: number) => {
    const timer = recentTimers.find(t => t.id === timerId)
    const isAlreadyActive = activeTimers.some(activeTimer => activeTimer.id === timerId)
    
    if (timer && !isAlreadyActive) {
      const seconds = parseTimeToSeconds(timer.time)
      const newActiveTimer: ActiveTimer = {
        id: timerId,
        originalTime: timer.time,
        remainingTime: seconds,
        duration: timer.duration,
        isPaused: false,
        label: timer.label
      }
      setActiveTimers(prev => [...prev, newActiveTimer])
    }
  }

  const handlePauseTimer = (timerId: number) => {
    setActiveTimers(prev => prev.map(timer => 
      timer.id === timerId ? { ...timer, isPaused: !timer.isPaused } : timer
    ))
  }

  const handleDeleteActiveTimer = (timerId: number) => {
    const timer = activeTimers.find(t => t.id === timerId)
    if (timer && timer.remainingTime === 0) {
      setCompletedTimer(timer)
    }
    setActiveTimers(prev => prev.filter(t => t.id !== timerId))
  }

  const handleDeleteRecentTimer = (timerId: number) => {
    setRecentTimers(prev => prev.filter(t => t.id !== timerId))
    setActiveTimers(prev => prev.filter(t => t.id !== timerId))
  }

  const handleAddCustomTimer = (time: string, duration: string, label: string) => {
    const newId = Math.max(...recentTimers.map(t => t.id), 0) + 1
    setRecentTimers(prev => [{ id: newId, time, duration, isActive: false, label }, ...prev])
  }

  const handleAddPreset = (preset: typeof TIMER_PRESETS[0]) => {
    const newId = Math.max(...recentTimers.map(t => t.id), 0) + 1
    setRecentTimers(prev => [{ 
      id: newId, 
      time: preset.time, 
      duration: preset.duration, 
      isActive: false,
      label: preset.label,
      category: preset.category
    }, ...prev])
    setShowPresets(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl" />
      
      <motion.div 
        className="relative z-10 max-w-sm mx-auto h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <StatusBar />
        
        <AnimatePresence>
          {activeTimers.map((activeTimer) => (
            <motion.div key={activeTimer.id} className="py-1">
              <ActiveTimerToast
                timer={activeTimer}
                onDelete={handleDeleteActiveTimer}
                onPause={handlePauseTimer}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {completedTimer && (
            <CompletionNotification
              timer={completedTimer}
              onDismiss={() => setCompletedTimer(null)}
            />
          )}
        </AnimatePresence>
        
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <TimerHeader isEditing={isEditing} onEditToggle={() => setIsEditing(!isEditing)} />
          
          <div className="mb-6">
            <div className="flex gap-3 mb-4">
              <motion.button
                className="flex-1 bg-orange-500/20 border border-orange-500/50 text-orange-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                onClick={() => setShowTimePicker(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                Custom Timer
              </motion.button>
              
              <motion.button
                className="flex-1 bg-purple-500/20 border border-purple-500/50 text-purple-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                onClick={() => setShowPresets(!showPresets)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Clock className="w-5 h-5" />
                Presets
              </motion.button>
            </div>

            <AnimatePresence>
              {showPresets && (
                <motion.div
                  className="grid grid-cols-2 gap-3 mb-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {TIMER_PRESETS.map((preset) => {
                    const Icon = preset.icon
                    return (
                      <motion.button
                        key={preset.label}
                        className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-left"
                        onClick={() => handleAddPreset(preset)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-6 h-6 text-orange-400 mb-2" />
                        <div className="text-white font-medium">{preset.label}</div>
                        <div className="text-white/60 text-sm">{preset.duration}</div>
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div>
            <h2 className="text-white/60 text-sm uppercase tracking-wider mb-3">Recent</h2>
            <AnimatePresence mode="popLayout">
              {recentTimers.map((timer) => (
                <RecentTimerItem
                  key={timer.id}
                  timer={timer}
                  isEditing={isEditing}
                  onDelete={handleDeleteRecentTimer}
                  onStart={handleStartTimer}
                  isActive={activeTimers.some(at => at.id === timer.id)}
                  isPaused={activeTimers.find(at => at.id === timer.id)?.isPaused || false}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <BottomNavigation />
      </motion.div>

      <AnimatePresence>
        {showTimePicker && (
          <TimePicker
            onTimeSelect={handleAddCustomTimer}
            onClose={() => setShowTimePicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
