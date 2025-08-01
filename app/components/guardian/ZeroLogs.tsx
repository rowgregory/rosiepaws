import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/app/redux/store'
import TokenCounter from './TokenCounter'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'

interface IZeroLogs {
  title: string
  subtitle: string
  btnText: string
  tokens: number
  func: ActionCreatorWithoutPayload
}

const ZeroLogs: FC<IZeroLogs> = ({ title, subtitle, btnText, tokens, func }) => {
  const dispatch = useAppDispatch()

  return (
    <div className="p-6 bg-white min-h-[calc(100dvh-96px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed max-w-sm">{subtitle}</p>
        </div>
        <motion.button
          onClick={() => dispatch(func())}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 text-white font-medium rounded-full hover:from-pink-600 hover:via-orange-600 hover:to-red-600 transition-colors duration-200 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{btnText}</span>
          <TokenCounter color1="#fff" color2="#fff" id="whiteToWhite" tokens={tokens} />
        </motion.button>
      </motion.div>
    </div>
  )
}

export default ZeroLogs
