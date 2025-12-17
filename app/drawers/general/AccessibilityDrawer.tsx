'use client'

import { useState, useEffect, useRef, useCallback, FC } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store'
import { setCloseAccessibilityDrawer } from '../../redux/features/appSlice'
import useCustomPathname from '../../hooks/useCustomPathname'
import { AlignJustify, AlignLeft, Contrast, Link, RefreshCcw, Settings, X } from 'lucide-react'

const textSteps = [1, 1.1, 1.2, 1.3, 1.4] // 5 levels: normal → bigger → biggest

interface StepIndicatorProps {
  currentStep: number // This will track the current step index
}

const StepIndicator: FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${currentStep >= index ? 'bg-blaze' : 'bg-midnightblack'}`}
        ></div>
      ))}
    </div>
  )
}

const AccessibilityDrawer = () => {
  const dispatch = useAppDispatch()
  const path = useCustomPathname()
  const { accessibility } = useAppSelector((state: RootState) => state.app)
  const [highContrast, setHighContrast] = useState(false)
  const [highlightLinks, setHighlightLinks] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [textSpacing, setTextSpacing] = useState(false)
  const [dyslexiaFriendly, setDyslexiaFriendly] = useState(false)
  const [lineHeight, setLineHeight] = useState(false)

  const onClose = () => dispatch(setCloseAccessibilityDrawer())

  // Use a ref to store the original font sizes of the elements
  const originalFontSizesRef = useRef<Map<HTMLElement, string>>(new Map())

  // Helper function to notify PageWrapper of changes
  const notifyAccessibilityChange = useCallback(() => {
    window.dispatchEvent(new CustomEvent('accessibilityChanged'))
  }, [])

  // Helper function to update localStorage and notify
  const updateSetting = useCallback(
    (key: string, value: boolean | number) => {
      localStorage.setItem(key, String(value))
      notifyAccessibilityChange()
    },
    [notifyAccessibilityChange]
  )

  // Load settings from localStorage when component mounts or path changes
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true'
    const savedHighlightLinks = localStorage.getItem('highlightLinks') === 'true'
    const savedStepIndex = parseInt(localStorage.getItem('stepIndex') || '0', 10)
    const savedTextSpacing = localStorage.getItem('textSpacing') === 'true' // Fixed: was checking 'stepIndex'
    const savedDyslexiaFriendly = localStorage.getItem('dyslexiaFriendly') === 'true'
    const savedLineHeight = localStorage.getItem('lineHeight') === 'true'

    setHighContrast(savedHighContrast)
    setHighlightLinks(savedHighlightLinks)
    setStepIndex(savedStepIndex)
    setTextSpacing(savedTextSpacing)
    setDyslexiaFriendly(savedDyslexiaFriendly)
    setLineHeight(savedLineHeight)
  }, [path])

  // Font size scaling effect
  useEffect(() => {
    const scaleFontSize = (element: HTMLElement, originalSize: string) => {
      const currentSize = parseFloat(originalSize)
      const newSize =
        stepIndex === textSteps.length - 1
          ? currentSize // Reset to original size on last step
          : currentSize * textSteps[stepIndex] // Scale based on step

      element.style.fontSize = `${newSize}px`
    }

    // Get all accessibility items and main content
    const accessibilityItems = document.querySelectorAll('.accessibility-item')
    const mainContent = document.querySelector('.main-content')

    // Scale accessibility items
    accessibilityItems.forEach((element: any) => {
      if (!originalFontSizesRef.current.has(element)) {
        const originalSize = window.getComputedStyle(element).fontSize
        originalFontSizesRef.current.set(element, originalSize)
      }
      const originalSize = originalFontSizesRef.current.get(element)!
      scaleFontSize(element, originalSize)
    })

    // Scale main content text elements
    if (mainContent) {
      const textElements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, a, p, label, li, span')
      textElements.forEach((element: any) => {
        if (!originalFontSizesRef.current.has(element)) {
          const originalSize = window.getComputedStyle(element).fontSize
          originalFontSizesRef.current.set(element, originalSize)
        }
        const originalSize = originalFontSizesRef.current.get(element)!
        scaleFontSize(element, originalSize)
      })
    }

    updateSetting('stepIndex', stepIndex)
  }, [stepIndex, path, updateSetting])

  const cycleTextSize = () => {
    setStepIndex((prevIndex) => (prevIndex === textSteps.length - 1 ? 0 : prevIndex + 1))
  }

  // High contrast effect
  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast)
    updateSetting('highContrast', highContrast)
  }, [highContrast, updateSetting])

  // Highlight links effect
  useEffect(() => {
    const links = document.querySelectorAll('a')
    links.forEach((link: HTMLElement) => {
      if (highlightLinks) {
        link.style.backgroundColor = 'yellow'
        link.style.color = 'black'
      } else {
        link.style.backgroundColor = ''
        link.style.color = ''
      }
    })
    updateSetting('highlightLinks', highlightLinks)
  }, [highlightLinks, updateSetting])

  // Text spacing effect
  useEffect(() => {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, a, p, label, li, span')
    textElements.forEach((element: any) => {
      element.style.letterSpacing = textSpacing ? '0.1em' : ''
    })
    updateSetting('textSpacing', textSpacing)
  }, [textSpacing, updateSetting])

  // Dyslexia friendly effect
  useEffect(() => {
    document.body.classList.toggle('dyslexia-friendly', dyslexiaFriendly)
    updateSetting('dyslexiaFriendly', dyslexiaFriendly)
  }, [dyslexiaFriendly, updateSetting])

  // Line height effect
  useEffect(() => {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span')
    textElements.forEach((element: any) => {
      element.style.lineHeight = lineHeight ? '1.8' : ''
    })
    updateSetting('lineHeight', lineHeight)
  }, [lineHeight, updateSetting])

  const reset = () => {
    // Reset all state
    setHighContrast(false)
    setHighlightLinks(false)
    setStepIndex(0)
    setTextSpacing(false)
    setDyslexiaFriendly(false)
    setLineHeight(false)

    // Clear body classes
    document.body.classList.remove('high-contrast', 'dyslexia-friendly')

    // Clear all inline styles
    const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, div, a, label')
    allElements.forEach((element: any) => {
      element.style.fontFamily = ''
      element.style.fontSize = ''
      element.style.lineHeight = ''
      element.style.backgroundColor = ''
      element.style.color = ''
      element.style.letterSpacing = ''
    })

    // Clear localStorage
    const settings = ['highContrast', 'highlightLinks', 'stepIndex', 'textSpacing', 'dyslexiaFriendly', 'lineHeight']
    settings.forEach((setting) => {
      localStorage.setItem(setting, setting === 'stepIndex' ? '0' : 'false')
    })

    // Notify PageWrapper
    notifyAccessibilityChange()
  }

  return (
    <AnimatePresence>
      {accessibility && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-20 z-[90]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[100] overflow-hidden flex flex-col border-l border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Accessibility Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Customize your viewing experience</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-12 gap-4 w-full">
                {/* Text Size */}
                <div
                  onClick={cycleTextSize}
                  className="col-span-12 sm:col-span-6 relative bg-gray-50 hover:bg-gray-100 border border-gray-200 p-6 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="accessibility-item text-lg font-medium text-gray-700">T</div>
                      <div className="accessibility-item text-3xl font-medium text-gray-900">T</div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Bigger Text</h3>
                      <StepIndicator currentStep={stepIndex} />
                    </div>
                  </div>
                </div>

                {/* High Contrast */}
                <div
                  onClick={() => setHighContrast(!highContrast)}
                  className="col-span-12 sm:col-span-6 relative bg-gray-50 hover:bg-gray-100 border border-gray-200 p-6 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <Contrast className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">High Contrast</h3>
                      <div
                        className={`w-4 h-4 rounded-full mx-auto transition-colors duration-200 ${
                          highContrast ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Highlight Links */}
                <div
                  onClick={() => setHighlightLinks(!highlightLinks)}
                  className="col-span-12 sm:col-span-6 relative bg-gray-50 hover:bg-gray-100 border border-gray-200 p-6 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <Link className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Highlight Links</h3>
                      <div
                        className={`w-4 h-4 rounded-full mx-auto transition-colors duration-200 ${
                          highlightLinks ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Text Spacing */}
                <div
                  onClick={() => setTextSpacing(!textSpacing)}
                  className="col-span-12 sm:col-span-6 relative bg-gray-50 hover:bg-gray-100 border border-gray-200 p-6 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <AlignLeft className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Text Spacing</h3>
                      <div
                        className={`w-4 h-4 rounded-full mx-auto transition-colors duration-200 ${
                          textSpacing ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Dyslexia-Friendly */}
                <div
                  onClick={() => setDyslexiaFriendly(!dyslexiaFriendly)}
                  className="col-span-12 sm:col-span-6 relative bg-gray-50 hover:bg-gray-100 border border-gray-200 p-6 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <div className="text-lg font-bold text-gray-700">Aa</div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Dyslexia-Friendly</h3>
                      <div
                        className={`w-4 h-4 rounded-full mx-auto transition-colors duration-200 ${
                          dyslexiaFriendly ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Line Height */}
                <div
                  onClick={() => setLineHeight(!lineHeight)}
                  className="col-span-12 sm:col-span-6 relative bg-gray-50 hover:bg-gray-100 border border-gray-200 p-6 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <AlignJustify className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Line Height</h3>
                      <div
                        className={`w-4 h-4 rounded-full mx-auto transition-colors duration-200 ${
                          lineHeight ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => reset()}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 hover:shadow-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Reset All Settings</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AccessibilityDrawer
