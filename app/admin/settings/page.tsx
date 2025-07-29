'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Settings, Check } from 'lucide-react'
import { useUpdateBackupFrequencyMutation } from '@/app/redux/services/adminApi'
import SlideMessage from '@/app/components/auth/SlideMessage'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { SelectInput } from '@/app/forms/elements/admin/SelectInput'
import { SettingCard } from '@/app/components/admin/settings/SettingsCard'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { SETTINGS_BACKUP_FREQUENCIES } from '@/app/lib/constants/admin/settings'

const AdminSettings = () => {
  const dispatch = useAppDispatch()
  const { handleInput } = createFormActions('settingsForm', dispatch)
  const [saved, setSaved] = useState(false)
  const [updateBackupFrequency, { isLoading, error }] = useUpdateBackupFrequencyMutation() as any
  const { settingsForm } = useAppSelector((state: RootState) => state.form)
  const { settings } = useAppSelector((state: RootState) => state.admin)

  useEffect(() => {
    dispatch(setInputs({ formName: 'settingsForm', data: { backupFrequency: settings.backupFrequency } }))
  }, [dispatch, settings.backupFrequency])

  const handleSaveSettings = async (e: any) => {
    e.preventDefault()

    try {
      await updateBackupFrequency({ frequency: settingsForm?.inputs?.backupFrequency }).unwrap()

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      dispatch(setOpenSlideMessage())
    }
  }

  return (
    <>
      <SlideMessage message={error?.data?.message} type="Error" />

      <div className="bg-gray-50 min-h-screen p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Configure platform settings and preferences</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-8 max-w-6xl">
          {/* System Configuration */}
          <SettingCard
            title="System Configuration"
            description="Core system settings and security options"
            icon={Settings}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <SelectInput
                name="backupFrequency"
                label="Backup Frequency"
                value={settingsForm?.inputs?.backupFrequency || ''}
                onChange={handleInput}
                options={SETTINGS_BACKUP_FREQUENCIES}
                description="How often to backup system data"
              />
            </div>
          </SettingCard>

          {/* Save Button */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Save Configuration</p>
                <p>Changes will be applied immediately.</p>
              </div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all ${
                  saved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Settings Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isLoading ? 'Saving...' : 'Save All Settings'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default AdminSettings
