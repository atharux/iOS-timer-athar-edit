import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StatusBar } from './components/StatusBar'
import { TimerHeader } from './components/TimerHeader'
import { MainTimer } from './components/MainTimer'
import { RecentTimers } from './components/RecentTimers'
import { BottomNavigation } from './components/BottomNavigation'
import { ActiveTimerToast } from './components/ActiveTimerToast'

interface ActiveTimer {
  id: number
  originalTime: string
  remainingTime: number
  duration: string
  isPaused: boolean
}

export default function App() {
  const [isEditing, setIsEditing] = useState(false)
  const [mainTimer, setMainTimer] = useState({
    time: '17:50',
    duration: '18 min',
    isRunning: false
  })
  
  const [recentTimers, setRecentTimers] = useState([
    { id: 1, time: '1:30:00', duration: '1 hr, 30 min', isActive: false },
    { id: 2, time: '5:00', duration: '5 min', isActive: false },
    { id: 3, time: '18:00', duration: '18 min', isActive: false }
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
    // Check if timer is already active to prevent duplicates
    const isAlreadyActive = activeTimers.some(activeTimer => activeTimer.id === timerId)
    
    if (timer && !isAlreadyActive) {
      const seconds = parseTimeToSeconds(timer.time)
      const newActiveTimer: ActiveTimer = {
        id: timerId,
        originalTime: timer.time,
        remainingTime: seconds,
        duration: timer.duration,
        isPaused: false
      }
      setActiveTimers(prev => [...prev, newActiveTimer])
    }
  }

  const handlePauseTimer = (timerId: number) => {
    setActiveTimers(prev => {
      const updatedTimers = prev.map(timer => 
        timer.id === timerId 
          ? { ...timer, isPaused: !timer.isPaused }
          : timer
      )
      
      // Update recentTimers based on the new state
      const updatedTimer = updatedTimers.find(at => at.id === timerId)
      setRecentTimers(recentPrev => recentPrev.map(t => 
        t.id === timerId ? { ...t, isActive: updatedTimer ? !updatedTimer.isPaused : false } : t
      ))
      
      return updatedTimers
    })
  }

  const handleDeleteActiveTimer = (timerId: number) => {
    setActiveTimers(prev => prev.filter(t => t.id !== timerId))
    setRecentTimers(prev => prev.map(t => 
      t.id === timerId ? { ...t, isActive: false } : t
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl" />
      
      <motion.div 
        className="relative z-10 max-w-sm mx-auto h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <StatusBar />
        
        {/* Active Timer Toasts */}
        <AnimatePresence>
          {activeTimers.map((activeTimer, index) => (
            <motion.div
              key={activeTimer.id}
              className="py-1"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveTimerToast
                timer={activeTimer}
                onDelete={handleDeleteActiveTimer}
                onPause={handlePauseTimer}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        <motion.div 
          className="flex-1 px-6 py-4"
          animate={{ 
            paddingTop: activeTimers.length > 0 ? '1rem' : '1rem'
          }}
          transition={{ duration: 0.3 }}
        >
          <TimerHeader 
            isEditing={isEditing} 
            onEditToggle={() => setIsEditing(!isEditing)} 
          />
          
          <MainTimer 
            timer={mainTimer}
            onTimerUpdate={setMainTimer}
            isEditing={isEditing}
          />
          
          <RecentTimers 
            timers={recentTimers}
            onTimersUpdate={setRecentTimers}
            isEditing={isEditing}
            onStartTimer={handleStartTimer}
            onPauseTimer={handlePauseTimer}
            activeTimers={activeTimers.map(timer => timer.id)}
            pausedTimers={activeTimers.filter(timer => timer.isPaused).map(timer => timer.id)}
          />
        </motion.div>
        
        <BottomNavigation />
      </motion.div>
    </div>
  )
}