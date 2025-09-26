import { Wifi, Signal, Battery } from 'lucide-react'

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="text-white font-medium">
        8:34
      </div>
      
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
        
        <Signal className="w-4 h-4 text-white" />
        <Wifi className="w-4 h-4 text-white" />
        
        <div className="flex items-center gap-1 bg-white/20 rounded-md px-2 py-1">
          <Battery className="w-4 h-4 text-white" />
          <span className="text-xs text-white font-medium">64</span>
        </div>
      </div>
    </div>
  )
}