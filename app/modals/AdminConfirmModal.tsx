import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { setCloseAdminConfirmModal } from '../redux/features/adminSlice'
import TokensSVG from '@/public/svg/TokensSVG'

const AdminConfirmModal = () => {
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseAdminConfirmModal())
  const { confirmModal } = useAppSelector((state: RootState) => state.admin)
  const { loading: loadingPet } = useAppSelector((state: RootState) => state.pet)
  const { loading: loadingPainScore } = useAppSelector((state: RootState) => state.painScore)
  const { loading: loadingFeeding } = useAppSelector((state: RootState) => state.feeding)
  const { loading: loadingWater } = useAppSelector((state: RootState) => state.water)
  const { loading: loadingVitalSigns } = useAppSelector((state: RootState) => state.vitalSigns)
  const { loading: loadingMovement } = useAppSelector((state: RootState) => state.movement)
  const { loading: loadingAppointment } = useAppSelector((state: RootState) => state.appointment)
  const { loading: loadingBloodSugar } = useAppSelector((state: RootState) => state.bloodSugar)
  const { loading: loadingSeizure } = useAppSelector((state: RootState) => state.seizure)
  const { loading: loadingMedia } = useAppSelector((state: RootState) => state.media)
  const loading =
    loadingPainScore ||
    loadingFeeding ||
    loadingWater ||
    loadingVitalSigns ||
    loadingMovement ||
    loadingAppointment ||
    loadingBloodSugar ||
    loadingSeizure ||
    loadingMedia ||
    loadingPet

  return (
    <AnimatePresence>
      {confirmModal.isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{confirmModal.title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">{confirmModal.description}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmModal.onConfirm()}
                className={`px-4 py-2 rounded-md text-sm text-white whitespace-nowrap flex items-center ${
                  confirmModal.isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  `${confirmModal.confirmText} ${confirmModal.tokenAmount}`
                )}
                {!loading && <TokensSVG id="whiteToWhite" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AdminConfirmModal
