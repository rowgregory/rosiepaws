import React from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { clearInputs, createFormActions } from '../redux/features/formSlice'
import validateBloodSugarForm from '../validations/validateBloodSugarForm'
import { setCloseBloodSugarDrawer } from '../redux/features/petSlice'
import { useCreateBloodSugarMutation } from '../redux/services/petApi'
import { Heart } from 'lucide-react'
import GuardianBloodSugarGuide from '../components/guardian/GuardianBloodSugarGuide'
import { AnimatePresence, motion } from 'framer-motion'
import BloodSugarForm from '../forms/blood-sugar-form/BloodSugarForm'

const CreateBloodSugarDrawer = () => {
  const { bloodSugarDrawer } = useAppSelector((state: RootState) => state.pet)
  const { bloodSugarForm } = useAppSelector((state: RootState) => state.form)
  const dispatch = useAppDispatch()
  const { handleInput, setErrors } = createFormActions('bloodSugarForm', dispatch)
  const closeBloodSugarDrawer = () => dispatch(setCloseBloodSugarDrawer())
  const [createBoodSugar, { isLoading }] = useCreateBloodSugarMutation()

  const handleAddBoodSugar = async (e: MouseEvent) => {
    e.preventDefault()

    const isValid = validateBloodSugarForm(bloodSugarForm.inputs, setErrors)
    if (!isValid) return

    try {
      await createBoodSugar({
        petId: bloodSugarForm.inputs.petId,
        value: bloodSugarForm.inputs.value,
        notes: bloodSugarForm.inputs.notes,
        timeTaken: new Date(bloodSugarForm.inputs.timeTaken)
      }).unwrap()

      closeBloodSugarDrawer()
      dispatch(clearInputs({ formName: 'bloodSugarForm' }))
    } catch {}
  }

  return (
    <AnimatePresence>
      {bloodSugarDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closeBloodSugarDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="min-h-dvh w-[930px] fixed top-0 right-0 z-50 bg-white shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.2)] flex flex-col"
          >
            {/* Header */}
            <div className="px-5 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Blood Sugar Reading</h2>
                    <p className="text-sm text-gray-500">Track your pet&apos;s glucose levels</p>
                  </div>
                </div>
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row">
              <BloodSugarForm
                inputs={bloodSugarForm.inputs}
                errors={bloodSugarForm.errors}
                handleInput={handleInput}
                close={closeBloodSugarDrawer}
                handleSubmit={handleAddBoodSugar}
                loading={isLoading}
              />
              <GuardianBloodSugarGuide />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CreateBloodSugarDrawer
