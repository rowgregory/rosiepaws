import React, { FC, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { itemVariants } from '@/app/lib/constants/appointment'
import { CheckCircle2, PawPrint } from 'lucide-react'
import { Pet } from '@/app/types'
import { useAppDispatch } from '@/app/redux/store'
import { setInputs } from '@/app/redux/features/formSlice'

const PetSelection: FC<{ pets: Pet[] | undefined; inputs: any; errors: any; handleInput: any; formName: string }> = ({
  pets,
  inputs,
  errors,
  handleInput,
  formName
}) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (pets?.length !== undefined && pets?.length === 1) {
      dispatch(setInputs({ formName, data: { petId: pets[0]?.id } }))
    }
  }, [dispatch, formName, pets])

  return (
    <motion.div variants={itemVariants} className="space-y-3">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <PawPrint className="text-indigo-500" size={16} />
        Select Pet
      </label>
      <div className="grid grid-cols-1 gap-2">
        <AnimatePresence>
          {pets?.map((pet: Pet, index: number) => (
            <motion.label
              key={pet.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border transition-all text-left cursor-pointer ${
                inputs?.petId === pet.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : errors?.petId
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-indigo-300'
              }`}
            >
              <input type="radio" name="petId" value={pet.id} onChange={handleInput} className="hidden" />
              <div className="flex items-center space-x-3">
                <span className="text-xl">{pet.type === 'DOG' ? '🐶' : '🐱'}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pet.name}</p>
                  <p className="text-13 text-gray-500">
                    {pet.breed} • {pet.age} years old
                  </p>
                </div>
                <AnimatePresence>
                  {inputs?.petId === pet.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle2 className="text-indigo-500" size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.label>
          ))}
        </AnimatePresence>
      </div>
      {errors?.petId && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <span className="text-red-500">⚠️</span>
          {errors?.petId}
        </motion.p>
      )}
    </motion.div>
  )
}

export default PetSelection
