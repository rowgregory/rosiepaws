import React from 'react'
import { Settings } from 'lucide-react'

interface AdminActionMenuButtonProps {
  onClick: () => void
  className?: string
}

const AdminActionMenuButton: React.FC<AdminActionMenuButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group flex items-center justify-center
        w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 
        hover:from-indigo-600 hover:to-blue-700
        rounded-xl shadow-lg hover:shadow-xl
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        ${className}
      `}
      aria-label="Open Admin Actions Menu"
    >
      {/* Main Icon */}
      <div className="relative">
        <Settings className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
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
        Admin Actions
      </div>
    </button>
  )
}

export default AdminActionMenuButton
