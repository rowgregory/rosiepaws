import { Accessibility } from 'lucide-react'
import useAccessibilityCheckmark from '../hooks/useAccessibilityCheckmark'
import useCustomPathname from '../hooks/useCustomPathname'
import { setToggleAccessibilityDrawer } from '../redux/features/appSlice'
import { useAppDispatch, useApplicationSelecetor } from '../redux/store'
import CheckmarkSVG from '@/public/svg/CheckmarkSVG'

const AccessibilityIcon = () => {
  const { showCheckmark, isClient } = useAccessibilityCheckmark()
  const path = useCustomPathname()
  const dispatch = useAppDispatch()
  const { accessibility } = useApplicationSelecetor()
  const isGuardianOrAdminLink = ['/guardian', '/admin'].some((item) => path.includes(item))

  const toggleAccessibilityDrawer = () => dispatch(setToggleAccessibilityDrawer(accessibility))
  return (
    <div onClick={toggleAccessibilityDrawer} className="relative cursor-pointer">
      <Accessibility
        className={`${isGuardianOrAdminLink ? 'bottom-5 left-5 lg:left-auto lg:top-5 lg:right-5' : 'bottom-5 left-5'} p-2 bg-indigo-600 text-white rounded-full w-8 h-8 fixed z-[110]  cursor-pointer hover:animate-rotateToTwoOClock`}
      />
      {isClient && showCheckmark && <CheckmarkSVG />}
    </div>
  )
}

export default AccessibilityIcon
