import React, { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Calendar, Clock, Stethoscope, FileText, User, Bell, BellOff } from 'lucide-react'
import { containerVariants, itemVariants, serviceTypes, timeSlots } from '../lib/constants/public/appointment'
import { isAppointmentFormValid } from '../lib/utils/public/my-pets/appointments/dateUtils'
import { IForm } from '../types'
import { useAppDispatch } from '../redux/store'
import { setInputs } from '../redux/features/formSlice'
import PetSelection from '../components/common/forms/PetSelection'
import FixedFooter from '../components/common/forms/FixedFooter'
import { appointmentCreateTokenCost, appointmentUpdateTokenCost } from '../lib/constants/public/token'
import Notes from '../components/common/forms/Notes'
import { dateToInputFormat } from '../lib/utils'

const AppointmentForm: FC<IForm> = ({ inputs, errors, handleInput, close, handleSubmit, loading, isUpdating }) => {
  const dispatch = useAppDispatch()

  console.log(inputs)

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-full">
      <div className="overflow-y-auto px-5 pt-9 pb-12 h-[calc(100dvh-132px)]">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Pet Selection */}
          <PetSelection inputs={inputs} errors={errors} handleInput={handleInput} formName="appointmentForm" />

          {/* Date Selection */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="text-indigo-500" size={16} />
              Appointment Date
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="date"
              name="date"
              value={dateToInputFormat(inputs?.date) || ''}
              onChange={handleInput}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-3 border rounded-lg focus:outline-none transition-all ${
                errors?.date
                  ? 'border-red-500 focus:border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-indigo-500'
              }`}
            />
            {errors?.date && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                <span className="text-red-500">⚠️</span>
                {errors?.date}
              </motion.p>
            )}
          </motion.div>

          {/* Time Selection */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="text-indigo-500" size={16} />
              Time
            </label>
            <div className="space-y-3">
              {/* Quick Time Slots */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Popular Times</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time, index) => (
                    <motion.label
                      key={time}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 text-center rounded-lg border transition-all cursor-pointer text-sm ${
                        inputs.time === time
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : errors.time
                            ? 'border-red-300 bg-red-50 hover:border-red-400'
                            : 'border-gray-300 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <input type="radio" name="time" value={time || ''} onChange={handleInput} className="hidden" />
                      {time}
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Custom Time Input */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Or choose custom time:</span>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="time"
                  name="time"
                  value={inputs.time || ''}
                  onChange={handleInput}
                  min="08:00"
                  max="18:00"
                  step="900" // 15-minute intervals
                  className={`flex-1 p-2 border rounded-lg focus:outline-none transition-all text-sm ${
                    errors.time
                      ? 'border-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>
            {errors?.time && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                <span className="text-red-500">⚠️</span>
                {errors?.time}
              </motion.p>
            )}
          </motion.div>

          {/* Service Type */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Stethoscope className="text-indigo-500" size={16} />
              Service Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {serviceTypes.map((service, index) => (
                <motion.label
                  key={service.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg border transition-all text-left cursor-pointer ${
                    inputs?.serviceType === service.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : errors?.serviceType
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value={service.value || ''}
                    onChange={handleInput}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{service.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{service.label}</p>
                    </div>
                    <AnimatePresence>
                      {inputs?.serviceType === service.value && (
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
            </div>
            {errors?.serviceType && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                <span className="text-red-500">⚠️</span>
                {errors?.serviceType}
              </motion.p>
            )}
          </motion.div>

          {/* Veterinarian Input */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label htmlFor="veterinarian" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="text-indigo-500" size={16} />
              Veterinarian
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              name="veterinarian"
              value={inputs?.veterinarian || ''}
              onChange={handleInput}
              className={`w-full p-3 border rounded-lg focus:outline-none transition-all ${
                errors?.veterinarian
                  ? 'border-red-500 focus:border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-indigo-500'
              }`}
            />
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="text-indigo-500" size={16} />
              Description
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              name="description"
              value={inputs?.description || ''}
              onChange={handleInput}
              rows={3}
              placeholder="Describe the reason for the appointment..."
              className={`w-full p-3 border rounded-lg focus:outline-none transition-all resize-none ${
                errors?.description
                  ? 'border-red-500 focus:border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-indigo-500'
              }`}
            />
          </motion.div>

          {/* Reminder Settings */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Bell className="text-indigo-500" size={16} />
              Appointment Reminder
            </label>

            {/* Enable/Disable Reminder Toggle */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                inputs?.reminderEnabled ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
              }`}
              onClick={() => {
                dispatch(
                  setInputs({ formName: 'appointmentForm', data: { reminderEnabled: !inputs?.reminderEnabled } })
                )
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {inputs?.reminderEnabled ? (
                    <Bell className="text-indigo-600" size={20} />
                  ) : (
                    <BellOff className="text-gray-400" size={20} />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {inputs?.reminderEnabled ? 'Reminder Enabled' : 'Reminder Disabled'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {inputs?.reminderEnabled
                        ? "You'll receive a reminder on the day of your appointment"
                        : 'Click to enable appointment reminders'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="reminderEnabled"
                  checked={inputs?.reminderEnabled || false}
                  onChange={handleInput}
                  className="hidden"
                />
                <AnimatePresence>
                  {inputs?.reminderEnabled && (
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
            </motion.div>

            {/* Reminder Details (only show if enabled) */}
            <AnimatePresence>
              {inputs?.reminderEnabled && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden space-y-4 pt-2"
                >
                  {/* Reminder Time */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Reminder Time</label>
                    <motion.select
                      name="reminderTime"
                      value={inputs?.reminderTime}
                      onChange={handleInput}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-all"
                    >
                      <option value="06:00">6:00 AM</option>
                      <option value="07:00">7:00 AM</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="10:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </motion.select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Notes */}
          <Notes inputs={inputs} handleInput={handleInput} />
        </motion.div>
      </div>

      {/* Fixed */}
      <FixedFooter
        inputs={inputs}
        loading={loading}
        tokens={isUpdating ? appointmentUpdateTokenCost : appointmentCreateTokenCost}
        text="Appointment"
        close={close}
        func={() => isAppointmentFormValid(inputs)}
        isUpdating={isUpdating}
      />
    </form>
  )
}

export default AppointmentForm
