import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause, Trash2, GripVertical } from 'lucide-react'

interface Timer {
  id: number
  time: string
  duration: string
  isActive: boolean
}

interface RecentTimersProps {
  timers: Timer[]
  onTimersUpdate: (timers: Timer[]) => void
  isEditing: boolean
  onStartTimer: (timerId: number) => void
  onPauseTimer: (timerId: number) => void
  activeTimers?: number[] // Add activeTimers prop to track which timers are active
  pausedTimers?: number[] // Add pausedTimers prop to track which timers are paused
}

export function RecentTimers({ timers, onTimersUpdate, isEditing, onStartTimer, onPauseTimer, activeTimers = [], pausedTimers = [] }: RecentTimersProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [expandingButton, setExpandingButton] = useState<number | null>(null)

  const handlePlayPause = (id: number) => {
    const timer = timers.find(t => t.id === id)
    const isCurrentlyActive = activeTimers.includes(id)
    const isCurrentlyPaused = pausedTimers.includes(id)
    
    if (timer && !isCurrentlyActive) {
      // Start the expanding animation only if timer is not already active
      setExpandingButton(id)
      
      // Trigger the timer start after a short delay for animation
      setTimeout(() => {
        onStartTimer(id)
        const updatedTimers = timers.map(timer =>
          timer.id === id ? { ...timer, isActive: true } : timer
        )
        onTimersUpdate(updatedTimers)
        setExpandingButton(null)
      }, 300)
    } else if (isCurrentlyActive) {
      // Handle pause/resume for active timers
      onPauseTimer(id)
    }
  }

  const handleDelete = (id: number) => {
    const updatedTimers = timers.filter(timer => timer.id !== id)
    onTimersUpdate(updatedTimers)
  }

  const handleTimeEdit = (id: number, newTime: string) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? { ...timer, time: newTime } : timer
    )
    onTimersUpdate(updatedTimers)
  }

  const handleDurationEdit = (id: number, newDuration: string) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? { ...timer, duration: newDuration } : timer
    )
    onTimersUpdate(updatedTimers)
  }

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Recents</h2>
      
      <div className="space-y-3">
        <AnimatePresence>
          {timers.map((timer, index) => (
            <motion.div
              key={timer.id}
              className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-5 h-5 text-white/50" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex-1">
                  <motion.div
                    className={`text-3xl text-white font-light mb-1 ${
                      isEditing ? 'cursor-pointer hover:text-blue-300' : ''
                    }`}
                    onClick={() => isEditing && setEditingId(timer.id)}
                    whileHover={isEditing ? { scale: 1.02 } : {}}
                  >
                    {editingId === timer.id ? (
                      <input
                        type="text"
                        value={timer.time}
                        onChange={(e) => handleTimeEdit(timer.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                        className="bg-transparent text-3xl text-white font-light outline-none border-b border-blue-400 w-full"
                        autoFocus
                      />
                    ) : (
                      timer.time
                    )}
                  </motion.div>
                  
                  <motion.p 
                    className={`text-white/70 ${
                      isEditing ? 'cursor-pointer hover:text-blue-300' : ''
                    }`}
                    onClick={() => isEditing && setEditingId(timer.id + 1000)} // Use different ID for duration editing
                    animate={{ opacity: timer.isActive ? [1, 0.5, 1] : 1 }}
                    transition={{ duration: 1, repeat: timer.isActive ? Infinity : 0 }}
                  >
                    {editingId === timer.id + 1000 ? (
                      <input
                        type="text"
                        value={timer.duration}
                        onChange={(e) => handleDurationEdit(timer.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                        className="bg-transparent text-white/70 outline-none border-b border-blue-400 w-full"
                        autoFocus
                      />
                    ) : (
                      timer.duration
                    )}
                  </motion.p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {isEditing && (
                    <motion.button
                      className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center backdrop-blur-md"
                      onClick={() => handleDelete(timer.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </motion.button>
                  )}
                </AnimatePresence>
                
                <motion.button
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 relative overflow-hidden ${
                    activeTimers.includes(timer.id)
                      ? pausedTimers.includes(timer.id) 
                        ? 'bg-green-500/80 hover:bg-green-400/80' // Show green when paused (to resume)
                        : 'bg-orange-500/80 hover:bg-orange-400/80' // Show orange when running (to pause)
                      : 'bg-green-500/80 hover:bg-green-400/80' // Show green when not active (to start)
                  }`}
                  onClick={() => handlePlayPause(timer.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ 
                    scale: expandingButton === timer.id ? [1, 1.5, 1] : 1,
                    boxShadow: activeTimers.includes(timer.id) && !pausedTimers.includes(timer.id)
                      ? ['0 0 0 0 rgba(255, 165, 0, 0.7)', '0 0 0 10px rgba(255, 165, 0, 0)']
                      : expandingButton === timer.id 
                        ? ['0 0 0 0 rgba(34, 197, 94, 0.8)', '0 0 0 30px rgba(34, 197, 94, 0)']
                        : '0 0 0 0 rgba(34, 197, 94, 0)'
                  }}
                  transition={{ 
                    duration: expandingButton === timer.id ? 0.6 : 1.5, 
                    repeat: activeTimers.includes(timer.id) && !pausedTimers.includes(timer.id) && expandingButton !== timer.id ? Infinity : 0,
                    ease: "easeOut"
                  }}
                >
                  {/* Expanding circle effect */}
                  <AnimatePresence>
                    {expandingButton === timer.id && (
                      <motion.div
                        className="absolute inset-0 bg-green-400/30 rounded-full"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {activeTimers.includes(timer.id) ? (
                    pausedTimers.includes(timer.id) ? (
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    ) : (
                      <Pause className="w-4 h-4 text-white fill-white" />
                    )
                  ) : (
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}