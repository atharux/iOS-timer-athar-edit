import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, AlarmClock, Timer, Clock } from 'lucide-react'

const navItems = [
  { id: 'world-clock', icon: Globe, label: 'World Clock' },
  { id: 'alarms', icon: AlarmClock, label: 'Alarms' },
  { id: 'stopwatch', icon: Clock, label: 'Stopwatch' },
  { id: 'timers', icon: Timer, label: 'Timers' }
]

export function BottomNavigation() {
  const [activeItem, setActiveItem] = useState('timers')

  return (
    <div className="bg-white/5 backdrop-blur-md border-t border-white/10 p-4">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeItem === item.id
          
          return (
            <motion.button
              key={item.id}
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300"
              onClick={() => setActiveItem(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`relative ${
                  isActive ? 'text-orange-400' : 'text-white/70'
                }`}
                animate={{ 
                  scale: isActive ? 1.2 : 1,
                  color: isActive ? '#fb923c' : 'rgba(255, 255, 255, 0.7)'
                }}
                transition={{ duration: 0.3 }}
              >
                <IconComponent className="w-6 h-6" />
                {isActive && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                )}
              </motion.div>
              
              <motion.span
                className={`text-xs transition-all duration-300 ${
                  isActive ? 'text-orange-400 font-medium' : 'text-white/70'
                }`}
                animate={{ 
                  color: isActive ? '#fb923c' : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: isActive ? 500 : 400
                }}
              >
                {item.label}
              </motion.span>
            </motion.button>
          )
        })}
      </div>
      
      {/* Home indicator */}
      <div className="flex justify-center mt-4">
        <div className="w-32 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  )
}
