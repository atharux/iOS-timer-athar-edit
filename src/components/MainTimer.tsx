import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, Square } from 'lucide-react'

interface Timer {
  time: string
  duration: string
  isRunning: boolean
}

interface MainTimerProps {
  timer: Timer
  onTimerUpdate: (timer: Timer) => void
  isEditing: boolean
}

export function MainTimer({ timer, onTimerUpdate, isEditing }: MainTimerProps) {
  const [isEditingTime, setIsEditingTime] = useState(false)
  
  const handlePlayPause = () => {
    onTimerUpdate({ ...timer, isRunning: !timer.isRunning })
  }

  const handleStop = () => {
    onTimerUpdate({ ...timer, isRunning: false, time: '00:00' })
  }

  const handleTimeEdit = () => {
    if (isEditing) {
      setIsEditingTime(true)
    }
  }

  return (
    <motion.div 
      className="mb-8 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl"
      layout
      whileHover={{ scale: isEditing ? 1.02 : 1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.div
            className={`text-6xl text-white font-light mb-2 ${
              isEditing ? 'cursor-pointer hover:text-blue-300' : ''
            }`}
            onClick={handleTimeEdit}
            whileHover={isEditing ? { scale: 1.05 } : {}}
          >
            {isEditingTime ? (
              <input
                type="text"
                value={timer.time}
                onChange={(e) => onTimerUpdate({ ...timer, time: e.target.value })}
                onBlur={() => setIsEditingTime(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTime(false)}
                className="bg-transparent text-6xl text-white font-light outline-none border-b-2 border-blue-400"
                autoFocus
              />
            ) : (
              timer.time
            )}
          </motion.div>
          
          <motion.p 
            className="text-white/70 text-lg"
            animate={{ opacity: timer.isRunning ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 1, repeat: timer.isRunning ? Infinity : 0 }}
          >
            {timer.duration}
          </motion.p>
        </div>
        
        <div className="flex gap-3">
          <AnimatePresence>
            {isEditing && (
              <motion.button
                className="w-14 h-14 bg-red-500/80 rounded-full flex items-center justify-center backdrop-blur-md"
                onClick={handleStop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Square className="w-6 h-6 text-white fill-white" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.button
            className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
              timer.isRunning 
                ? 'bg-orange-500/80 hover:bg-orange-400/80' 
                : 'bg-green-500/80 hover:bg-green-400/80'
            }`}
            onClick={handlePlayPause}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              boxShadow: timer.isRunning 
                ? ['0 0 0 0 rgba(255, 165, 0, 0.7)', '0 0 0 20px rgba(255, 165, 0, 0)']
                : '0 0 0 0 rgba(34, 197, 94, 0)'
            }}
            transition={{ duration: 1.5, repeat: timer.isRunning ? Infinity : 0 }}
          >
            {timer.isRunning ? (
              <Pause className="w-6 h-6 text-white fill-white" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
