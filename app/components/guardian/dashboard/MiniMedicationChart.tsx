import React, { useMemo } from 'react'
import { Pill, Calendar, Stethoscope } from 'lucide-react'

interface MedicationData {
  date: string
  time: string
  drugName: string
  dosage: string
  dosageUnit: string
}

interface GuardianMiniMedicationChartProps {
  medications?: MedicationData[]
  className?: string
}

const MiniMedicationChart: React.FC<GuardianMiniMedicationChartProps> = ({ medications = [], className = '' }) => {
  const uniqueMedications = useMemo(() => {
    const medicationMap = new Map()

    medications.forEach((med) => {
      const key = `${med.drugName}-${med.dosage}`
      if (!medicationMap.has(key)) {
        medicationMap.set(key, {
          name: med.drugName,
          dosage: med.dosage,
          dosageUnit: med.dosageUnit,
          displayName: med.drugName.length > 20 ? med.drugName.substring(0, 20) + '...' : med.drugName
        })
      }
    })

    return Array.from(medicationMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [medications])

  const medicationTypes = useMemo(() => {
    const types = new Set(medications.map((m) => m.drugName))
    return Array.from(types).sort()
  }, [medications])

  if (medications?.length === 0 || medications === null || medications === undefined) return

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Current Medications</h3>
            <p className="text-sm text-gray-500">Prescribed treatment plan</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{medicationTypes.length}</div>
          <div className="text-sm text-gray-500">Medications</div>
        </div>
      </div>

      {/* Medication List */}
      <div className="space-y-4 mb-6">
        <div className="grid gap-3">
          {uniqueMedications.map((med) => (
            <div
              key={`${med.name}-${med.dosage}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900" title={med.name}>
                    {med.displayName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {med.dosage} {med.dosageUnit}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Stethoscope className="w-4 h-4" />
            <span>
              {medicationTypes.length > 0
                ? `${medicationTypes.length} medication${medicationTypes.length !== 1 ? 's' : ''} prescribed`
                : 'No active prescriptions'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Current plan</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiniMedicationChart
