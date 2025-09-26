import { motion } from 'motion/react'
import { Plus } from 'lucide-react'

interface TimerHeaderProps {
  isEditing: boolean
  onEditToggle: () => void
}

export function TimerHeader({ isEditing, onEditToggle }: TimerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <motion.button
        className={`px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-300 ${
          isEditing 
            ? 'bg-blue-500/80 text-white' 
            : 'bg-orange-500/80 text-white hover:bg-orange-400/80'
        }`}
        onClick={onEditToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isEditing ? 'Done' : 'Edit'}
      </motion.button>
      
      <h1 className="text-white text-4xl font-light">
        Timers
      </h1>
      
      <motion.button
        className="w-12 h-12 bg-orange-500/80 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-orange-400/80 transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={3} />
      </motion.button>
    </div>
  )
}