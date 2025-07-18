import React, { FC, useMemo } from 'react'
import { motion } from 'framer-motion'
import TokenCounter from '../../guardian/TokenCounter'

interface IFixedFooter {
  inputs: any
  loading: boolean
  tokens: number
  text: string
  close: any
  func: any
  isUpdating?: boolean
}

const FixedFooter: FC<IFixedFooter> = ({ inputs, loading, tokens, text, close, func, isUpdating }) => {
  const isFormValid = useMemo(() => func(inputs), [func, inputs])
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="sticky bottom-0 border-t border-zinc-200 bg-white pt-4 px-5 pb-5 flex justify-end gap-x-4 flex-shrink-0"
    >
      <motion.button
        type="button"
        onClick={close}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
      >
        Cancel
      </motion.button>
      <motion.button
        type="submit"
        disabled={!isFormValid || loading}
        whileHover={{ scale: isFormValid && !loading ? 1.02 : 1 }}
        whileTap={{ scale: isFormValid && !loading ? 0.98 : 1 }}
        className="px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-full font-medium transition-all disabled:from-gray-400 disabled:to-zinc-400 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {isUpdating ? 'Updating' : 'Logging'}...
          </>
        ) : (
          <>
            {isUpdating ? 'Update' : 'Log'} {text}
            <TokenCounter color1="#fff" color2="#fff" id="whiteToWhite" tokens={tokens} />
          </>
        )}
      </motion.button>
    </motion.div>
  )
}

export default FixedFooter
