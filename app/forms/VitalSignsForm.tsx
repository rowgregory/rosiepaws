import React, { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Clock, Eye, Heart, Stethoscope, Thermometer, Weight } from 'lucide-react'
import PetSelection from '../components/common/forms/PetSelection'
import { IForm } from '../types'
import FixedFooter from '../components/common/forms/FixedFooter'
import { vitalSignsCreateTokenCost, vitalSignsUpdateTokenCost } from '../lib/constants/public/token'
import Notes from '../components/common/forms/Notes'
import TimeRecorded from '../components/common/forms/TimeRecorded'
import { InputStyle } from '../lib/constants'
import { isVitalSignsFormValid } from '../validations/validateVitalSignsForm'

const VitalSignsForm: FC<IForm> = ({ inputs, errors, handleInput, close, handleSubmit, loading, isUpdating }: any) => {
  const getNormalRanges = (type: string) => {
    if (type === 'dog') {
      return {
        temperature: '101-102.5°F',
        heartRate: '70-120 bpm',
        respiratoryRate: '10-30 breaths/min'
      }
    } else if (type === 'cat') {
      return {
        temperature: '100.5-102.5°F',
        heartRate: '140-220 bpm',
        respiratoryRate: '20-30 breaths/min'
      }
    }
    return {}
  }

  const normalRanges = getNormalRanges(inputs.petType)

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <div className="space-y-6">
          {/* Pet Selection */}
          <PetSelection inputs={inputs} errors={errors} handleInput={handleInput} formName="vitalSignsForm" />

          {/* Basic Vital Signs */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-red-500" />
                <label className="text-sm font-medium text-gray-700">Basic Vital Signs</label>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Thermometer className="w-4 h-4 inline mr-1" />
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={inputs.temperature || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="101.5"
                  />
                  {normalRanges.temperature && (
                    <p className="text-xs text-gray-500 mt-1">Normal: {normalRanges.temperature}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Heart className="w-4 h-4 inline mr-1" />
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    name="heartRate"
                    value={inputs.heartRate || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="90"
                  />
                  {normalRanges.heartRate && (
                    <p className="text-xs text-gray-500 mt-1">Normal: {normalRanges.heartRate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Activity className="w-4 h-4 inline mr-1" />
                    Respiratory Rate
                  </label>
                  <input
                    type="number"
                    name="respiratoryRate"
                    value={inputs.respiratoryRate || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="20"
                  />
                  {normalRanges.respiratoryRate && (
                    <p className="text-xs text-gray-500 mt-1">Normal: {normalRanges.respiratoryRate}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Physical Assessment */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Stethoscope className="w-5 h-5 text-purple-600" />
                <label className="text-sm font-medium text-gray-700">Physical Assessment</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Weight className="w-4 h-4 inline mr-1" />
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={inputs.weight || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="25.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={inputs.bloodPressure || ''}
                    onChange={handleInput}
                    className={InputStyle}
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Capillary Refill Time
                  </label>
                  <select
                    name="capillaryRefillTime"
                    value={inputs.capillaryRefillTime || ''}
                    onChange={handleInput}
                    className={InputStyle}
                  >
                    <option value="">Select...</option>
                    <option value="LESS_THAN_ONE_SECOND">{'<1 second (Normal)'}</option>
                    <option value="ONE_TO_TWO_SECONDS">1-2 seconds (Normal)</option>
                    <option value="TWO_TO_THREE_SECONDS">2-3 seconds (Mild dehydration)</option>
                    <option value="MORE_THAN_THREE_SECONDS">{'>3 seconds (Concerning)'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Mucous Membranes
                  </label>
                  <select
                    name="mucousMembranes"
                    value={inputs.mucousMembranes || ''}
                    onChange={handleInput}
                    className={InputStyle}
                  >
                    <option value="">Select...</option>
                    <option value="PINK_AND_MOIST">Pink and moist (Normal)</option>
                    <option value="PALE">Pale</option>
                    <option value="WHITE">White</option>
                    <option value="BLUE_CYANOTIC">Blue/Cyanotic</option>
                    <option value="YELLOW_ICTERIC">Yellow/Icteric</option>
                    <option value="RED_INJECTED">Red/Injected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hydration Status</label>
                  <select
                    name="hydrationStatus"
                    value={inputs.hydrationStatus || ''}
                    onChange={handleInput}
                    className={InputStyle}
                  >
                    <option value="">Select...</option>
                    <option value="NORMAL">Normal</option>
                    <option value="MILD_DEHYDRATION">Mild dehydration (3-5%)</option>
                    <option value="MODERATE_DEHYDRATION">Moderate dehydration (5-10%)</option>
                    <option value="SEVERE_DEHYDRATION">Severe dehydration ({'>10%'})</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Time Recorded */}
          <TimeRecorded errors={errors} handleInput={handleInput} inputs={inputs} />

          {/* Notes */}
          <Notes inputs={inputs} handleInput={handleInput} />
        </div>
      </div>
      {/* Fixed Footer */}
      <FixedFooter
        inputs={inputs}
        loading={loading}
        tokens={isUpdating ? vitalSignsUpdateTokenCost : vitalSignsCreateTokenCost}
        text="Vital Sign"
        close={close}
        func={() => isVitalSignsFormValid(inputs)}
        isUpdating={isUpdating}
      />
    </form>
  )
}

export default VitalSignsForm
