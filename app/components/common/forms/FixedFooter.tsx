import { FC, useMemo } from 'react'
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
      className="sticky bottom-0 border-t border-zinc-200 bg-white pt-4 px-5 pb-5 flex flex-col lg:flex-row justify-end gap-x-4 flex-shrink-0 gap-y-3 lg:gap-y-0"
    >
      <motion.button
        type="button"
        onClick={close}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="order-2 lg:order-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
      >
        Cancel
      </motion.button>
      <motion.button
        type="submit"
        disabled={!isFormValid || loading}
        whileHover={{ scale: isFormValid && !loading ? 1.02 : 1 }}
        whileTap={{ scale: isFormValid && !loading ? 0.98 : 1 }}
        className={`${!isFormValid ? 'from-slate-600 to-gray-600 cursor-not-allowed' : 'from-pink-600 to-orange-600 cursor-pointer'} order-1 lg:order-2 group relative inline-flex items-center rounded-full px-10 py-3 bg-gradient-to-r  text-white font-bold overflow-hidden transition-all duration-500 justify-center`}
        style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
        <div
          className={`${!isFormValid ? 'border-zinc-300/50 group-hover:border-zinc-200/80' : 'border-pink-300/50 group-hover:border-pink-200/80'} absolute inset-0 rounded-full border-2 transition-colors duration-300`}
        />
        <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
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
        </span>
      </motion.button>
    </motion.div>
  )
}

export default FixedFooter
