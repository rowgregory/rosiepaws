'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import {
  setCloseGuardianActionMenu,
  setOpenFeedingDrawer,
  setOpenMedicationDrawer,
  setOpenPainScoreDrawer,
  setOpenPetDrawer,
  setOpenWaterDrawer
} from '@/app/redux/features/petSlice'
import { useCallback, useRef } from 'react'
import useOutsideDetect from '@/app/hooks/useOutsideDetect'
import Link from 'next/link'
import { catIcon, heartBeatIcon } from '@/app/lib/icons'
import AwesomeIcon from '../common/AwesomeIcon'
import { faBowlFood, faKitMedical, faWater } from '@fortawesome/free-solid-svg-icons'

const actions = [
  { label: 'Pet', linkKey: '/guardian/pets/list', func: setOpenPetDrawer, icon: catIcon },
  { label: 'Pain Score', linkKey: '/guardian/pets/pain', func: setOpenPainScoreDrawer, icon: heartBeatIcon },
  { label: 'Water Intake', linkKey: '/guardian/pets/water', func: setOpenWaterDrawer, icon: faWater },
  { label: 'Feedings', linkKey: '/guardian/pets/feedings', func: setOpenFeedingDrawer, icon: faBowlFood },
  { label: 'Medication', linkKey: '/guardian/pets/medication', func: setOpenMedicationDrawer, icon: faKitMedical }
]

const GuardianActionMenu = () => {
  const { guardianActionMenu } = useAppSelector((state: RootState) => state.pet)
  const dispatch = useAppDispatch()
  const menuRef = useRef<HTMLDivElement | null>(null)

  const onClose = useCallback(() => dispatch(setCloseGuardianActionMenu()), [dispatch])

  const handleClose = useCallback(() => onClose(), [onClose])
  useOutsideDetect(menuRef, handleClose)

  return (
    <AnimatePresence>
      {guardianActionMenu && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="fixed right-10 top-10 mt-2 w-56 origin-top-right bg-white border border-zinc-200 rounded-md shadow-lg z-50"
        >
          <div className="p-1">
            {actions.map(({ label, linkKey, func, icon }) => (
              <Link
                href={linkKey}
                key={label}
                className="w-full grid grid-cols-12 gap-x-6 items-center justify-between text-sm px-1 py-1.5 text-indigo-500 font-bold hover:bg-zinc-100 rounded-md"
                onClick={() => {
                  dispatch(setCloseGuardianActionMenu())
                  dispatch(func())
                }}
              >
                <AwesomeIcon icon={icon} className="col-span-1 w-3 h-3 text-indigo-500" />
                <span className="col-span-11">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GuardianActionMenu
