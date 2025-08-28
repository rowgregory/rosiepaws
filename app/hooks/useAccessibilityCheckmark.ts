import { useState, useEffect, useCallback } from 'react'

interface AccessibilitySettings {
  highContrast: boolean
  highlightLinks: boolean
  stepIndex: number
  textSpacing: boolean
  dyslexiaFriendly: boolean
  lineHeight: boolean
}

const useAccessibilityCheckmark = () => {
  const [showCheckmark, setShowCheckmark] = useState<boolean>(false)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Function to check accessibility settings
  const checkAccessibilityFeatures = useCallback(() => {
    if (typeof window === 'undefined') return

    const accessibilitySettings: AccessibilitySettings = {
      highContrast: localStorage.getItem('highContrast') === 'true',
      highlightLinks: localStorage.getItem('highlightLinks') === 'true',
      stepIndex: parseInt(localStorage.getItem('stepIndex') || '0', 10),
      textSpacing: localStorage.getItem('textSpacing') === 'true',
      dyslexiaFriendly: localStorage.getItem('dyslexiaFriendly') === 'true',
      lineHeight: localStorage.getItem('lineHeight') === 'true'
    }

    const hasAnyAccessibilityFeature =
      accessibilitySettings.highContrast ||
      accessibilitySettings.highlightLinks ||
      accessibilitySettings.stepIndex > 0 ||
      accessibilitySettings.textSpacing ||
      accessibilitySettings.dyslexiaFriendly ||
      accessibilitySettings.lineHeight

    setShowCheckmark(hasAnyAccessibilityFeature)
  }, [])

  // Set up event listeners for accessibility changes
  useEffect(() => {
    if (!isClient) return

    // Check settings on mount
    checkAccessibilityFeatures()

    // Listen for custom accessibility change events
    const handleAccessibilityChange = () => {
      checkAccessibilityFeatures()
    }

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key &&
        ['highContrast', 'highlightLinks', 'stepIndex', 'textSpacing', 'dyslexiaFriendly', 'lineHeight'].includes(e.key)
      ) {
        checkAccessibilityFeatures()
      }
    }

    window.addEventListener('accessibilityChanged', handleAccessibilityChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('accessibilityChanged', handleAccessibilityChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [isClient, checkAccessibilityFeatures])

  return {
    showCheckmark,
    isClient,
    checkAccessibilityFeatures // Expose this in case you need to manually trigger a check
  }
}

export default useAccessibilityCheckmark
