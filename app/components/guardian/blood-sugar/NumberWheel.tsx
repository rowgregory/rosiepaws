import { useState } from 'react'
import { motion } from 'framer-motion'

const NumberWheel = ({ value, onChange, max = 9, label }: any) => {
  const [isSpinning, setIsSpinning] = useState(false)

  const handleIncrement = () => {
    if (isSpinning) return
    setIsSpinning(true)
    const newValue = value >= max ? 0 : value + 1

    onChange(newValue)
    setTimeout(() => setIsSpinning(false), 150)
  }

  const handleDecrement = () => {
    if (isSpinning) return
    setIsSpinning(true)
    const newValue = value <= 0 ? max : value - 1

    onChange(newValue)
    setTimeout(() => setIsSpinning(false), 150)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="relative w-16 h-[86px] bg-white rounded-lg border-2 border-gray-300 shadow-sm">
        {/* Up button */}
        <button
          type="button"
          onMouseDown={handleIncrement}
          className="absolute top-0 left-0 w-full h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors rounded-t-md active:bg-gray-200"
        >
          <span className="text-sm font-bold">▲</span>
        </button>

        {/* Number display */}
        <div className="absolute top-8 left-0 w-full h-4 flex items-center justify-center">
          <motion.span
            className="text-xl font-bold text-gray-800"
            key={`${label}-${value}`}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {value}
          </motion.span>
        </div>

        {/* Down button */}
        <button
          type="button"
          onMouseDown={handleDecrement}
          className="absolute bottom-0 left-0 w-full h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors rounded-b-md active:bg-gray-200"
        >
          <span className="text-sm font-bold">▼</span>
        </button>
      </div>
    </div>
  )
}

export default NumberWheel
