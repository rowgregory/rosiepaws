import React, { FC, useState } from 'react'
import { motion } from 'framer-motion'
import { setOpenSeizureCalendarDrawer } from '@/app/redux/features/dashboardSlice'
import { generateSeizurePDFReport } from '@/app/lib/utils/reports/seizure-pdf-report-generator'
import { setInputs } from '@/app/redux/features/formSlice'
import { AlertTriangle, FileText, Calendar } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { ISeizure } from '@/app/types'
import { getLocalISOString } from '@/app/lib/utils'
import { setOpenSeizureDrawer } from '@/app/redux/features/seizureSlice'

interface IQuickActions {
  seizures: ISeizure[]
}

const QuickActions: FC<IQuickActions> = ({ seizures }) => {
  const dispatch = useAppDispatch()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    try {
      setIsGenerating(true)

      const doc = await generateSeizurePDFReport(seizures, {
        includeCharts: true,
        includeFullLog: true,
        ownerName: 'John Doe'
      })

      // Generate filename with date
      const today = new Date().toISOString().split('T')[0]
      const filename = `Seizure_Report_${today}.pdf`

      // Download the PDF
      doc.save(filename)
    } catch {
      alert('Error generating PDF report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></span>
        Quick Actions
      </h3>
      <div className="space-y-3">
        <button
          onClick={() => {
            dispatch(
              setInputs({
                formName: 'seizureForm',
                data: {
                  seizureType: 'TONIC_CLONIC',
                  severity: 'CRITICAL',
                  duration: 5,
                  timeRecorded: getLocalISOString(new Date())
                }
              })
            )
            dispatch(setOpenSeizureDrawer())
          }}
          className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl py-3 px-4 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Log Emergency Seizure</span>
        </button>
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl py-3 px-4 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Generat{isGenerating ? 'ing' : 'e'} Report for Vet</span>
        </button>
        <button
          onClick={() => dispatch(setOpenSeizureCalendarDrawer())}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl py-3 px-4 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>View Seizure Calendar</span>
        </button>
      </div>
    </motion.div>
  )
}

export default QuickActions
