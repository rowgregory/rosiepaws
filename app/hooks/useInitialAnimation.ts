// hooks/useInitialAnimation.js
import { useState, useEffect } from 'react'

export const useInitialAnimation = (dataArray: any[]) => {
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Only set hasAnimated when we actually have data
    if (dataArray?.length > 0 && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [dataArray?.length, hasAnimated])

  return !hasAnimated
}
