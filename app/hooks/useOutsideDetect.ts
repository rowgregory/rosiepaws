import { useEffect, useCallback, RefObject } from 'react'

const useOutsideDetect = <T extends HTMLElement>(ref: RefObject<T | null>, callback: () => void) => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    },
    [ref, callback]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])
}

export default useOutsideDetect
