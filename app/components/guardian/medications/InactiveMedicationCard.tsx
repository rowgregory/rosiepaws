import { setInputs } from '@/app/redux/features/formSlice'
import { setOpenUpdateMedicationDrawer } from '@/app/redux/features/petSlice'
import { useAppDispatch } from '@/app/redux/store'
import { IMedication } from '@/app/types'
import { BellOff } from 'lucide-react'
import React, { FC } from 'react'

const InactiveMedicationCard: FC<{ inactiveMedications: IMedication[] }> = ({ inactiveMedications }) => {
  const dispatch = useAppDispatch()
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Inactive Medications</h2>
      <div className="grid gap-4">
        {inactiveMedications.map((medication) => (
          <div
            key={medication.id}
            onClick={() => {
              dispatch(setInputs({ formName: 'medicationForm', data: medication }))
              dispatch(setOpenUpdateMedicationDrawer())
            }}
            className="bg-gray-50 rounded-lg border border-gray-200 p-6 opacity-75 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">{medication.drugName}</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    <BellOff className="h-3 w-3" />
                    Disabled
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div>
                    <p className="font-medium">Pet</p>
                    <p>{medication.pet?.name}</p>
                  </div>
                  <div>
                    <p className="font-medium">Dosage</p>
                    <p>
                      {medication.dosage} {medication.dosageUnit}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Frequency</p>
                    <p>{medication.frequency}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InactiveMedicationCard
