import React from 'react'
import { Menu } from 'lucide-react'

interface GuardianActionMenuButtonProps {
  onClick: () => void
  className?: string
}

const GuardianActionMenuButton: React.FC<GuardianActionMenuButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group flex items-center justify-center
        w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 
        hover:from-blue-600 hover:to-purple-700
        rounded-xl shadow-lg hover:shadow-xl
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        ${className}
      `}
      aria-label="Open Guardian Actions Menu"
    >
      {/* Main Icon */}
      <div className="relative">
        <Menu className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
      </div>

      {/* Hover tooltip */}
      <div
        className="
        absolute right-full mr-3 px-3 py-1.5 
        bg-gray-900 text-white text-sm rounded-lg
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        whitespace-nowrap pointer-events-none
        before:content-[''] before:absolute before:left-full before:top-1/2 
        before:-translate-y-1/2 before:border-4 before:border-transparent 
        before:border-l-gray-900
      "
      >
        Quick Actions
      </div>
    </button>
  )
}

export default GuardianActionMenuButton
