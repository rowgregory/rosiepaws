'use client'

import GuardianActionMenuButton from '@/app/components/guardian/GuardianActionMenuButton'
import { exportPetsWithDetailedHealthData } from '@/app/lib/utils/exports/exportAllPetsData'
import exportAppointmentsData from '@/app/lib/utils/exports/exportAppointmentData'
import exportBloodSugarsData from '@/app/lib/utils/exports/exportBloodSugarData'
import exportFeedingsData from '@/app/lib/utils/exports/exportFeedngsData'
import exportMedicationsData from '@/app/lib/utils/exports/exportMedicationData'
import exportMovementsData from '@/app/lib/utils/exports/exportMovementsData'
import exportPainScoresData from '@/app/lib/utils/exports/exportPainScoresData'
import exportSeizuresData from '@/app/lib/utils/exports/exportSeizuresData'
import exportVitalSignsData from '@/app/lib/utils/exports/exportVitalSigns'
import exportWaterData from '@/app/lib/utils/exports/exportWaterData'
import { usePetSelector } from '@/app/redux/store'
import { motion } from 'framer-motion'
import { Calendar, Download, Droplets, FileDown, Heart, Hospital, MapPin, PillBottle, Zap } from 'lucide-react'

// Mock pets data

const Exports = () => {
  const { pets } = usePetSelector()

  const handleExport = (type: string, data: any, petId?: string) => {
    // Replace these with your actual CSV export functions
    const exportHandlers: Record<string, (petId?: string) => void> = {
      pain_scores: () => exportPainScoresData(data, petId),
      feedings: () => exportFeedingsData(data, petId),
      waters: () => exportWaterData(data, petId),
      movements: () => exportMovementsData(data, petId),
      vital_signs: () => exportVitalSignsData(data, petId),
      appointments: () => exportAppointmentsData(data, petId),
      medications: () => exportMedicationsData(data, petId),
      blood_sugars: () => exportBloodSugarsData(data, petId),
      seizures: () => exportSeizuresData(data, petId),
      all_data: () => exportPetsWithDetailedHealthData(data)
    }

    if (exportHandlers[type]) {
      exportHandlers[type]()
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 flex items-center gap-x-4 pl-6 border-b border-b-gray-200 z-30 bg-white h-[64px]">
        <GuardianActionMenuButton />
        <span className="text-xl lg:text-2xl font-semibold">Exports</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Export All Pets Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-50 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">All Pets</h2>
          <button onClick={() => handleExport('all_data', pets)} className="flex items-center gap-2">
            <FileDown size={18} />
            Export All Data
          </button>
        </motion.div>

        {/* Individual Pets Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-lg font-semibold">Individual Pets</h2>
          <div className="grid gap-6">
            {pets.map((pet, idx) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="bg-white border rounded-2xl shadow p-5 flex flex-col space-y-4"
              >
                <h3 className="text-md font-semibold">{pet.name}</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleExport('all_data', pet.id)} className="flex items-center gap-2">
                    <Download size={16} />
                    All Data
                  </button>
                  <button
                    onClick={() => handleExport('pain_scores', pet.painScores, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Pain Scores
                  </button>
                  <button
                    onClick={() => handleExport('feedings', pet.feedings, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Feedings
                  </button>
                  <button
                    onClick={() => handleExport('waters', pet.waters, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <Droplets size={16} />
                    Waters
                  </button>
                  <button
                    onClick={() => handleExport('movements', pet.movements, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <MapPin size={16} />
                    Movements
                  </button>
                  <button
                    onClick={() => handleExport('vital_signs', pet.vitalSigns, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <Hospital size={16} />
                    Vital Signs
                  </button>
                  <button
                    onClick={() => handleExport('appointments', pet.appointments, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <Calendar size={16} />
                    Appointments
                  </button>
                  <button
                    onClick={() => handleExport('medications', pet.medications, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <PillBottle size={16} />
                    Medications
                  </button>
                  <button
                    onClick={() => handleExport('blood_sugars', pet.bloodSugars, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart size={16} />
                    Blood Sugars
                  </button>
                  <button
                    onClick={() => handleExport('seizures', pet.seizures, pet.id)}
                    className="flex items-center gap-2"
                  >
                    <Zap size={16} />
                    Seizures
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Exports
