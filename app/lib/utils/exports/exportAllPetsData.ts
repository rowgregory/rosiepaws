export const exportAllPetsData = (pets: any[]) => {
  try {
    const headers = [
      'ID',
      'Name',
      'Type',
      'Breed',
      'Age',
      'Gender',
      'Weight',
      'Spayed/Neutered',
      'Microchip ID',
      'Allergies',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Last Visit',
      'Next Visit',
      'Owner ID',
      'Notes',
      'File Name',
      'File Path',
      'Pain Scores Count',
      'Appointments Count',
      'Medications Count',
      'Feedings Count',
      'Seizures Count',
      'Water Records Count',
      'Blood Sugar Records Count',
      'Gallery Items Count',
      'Movement Records Count',
      'Vital Signs Count',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...pets.map((pet) =>
        [
          pet.id || '',
          `"${pet.name || ''}"`, // Wrap in quotes to handle commas in names
          pet.type || '',
          `"${pet.breed || ''}"`,
          pet.age || '',
          pet.gender || '',
          pet.weight || '',
          pet.spayedNeutered || '',
          pet.microchipId || '',
          `"${pet.allergies || ''}"`, // Wrap in quotes for potential commas
          `"${pet.emergencyContactName || ''}"`,
          pet.emergencyContactPhone || '',
          pet.lastVisit ? new Date(pet.lastVisit).toLocaleDateString() : '',
          pet.nextVisit ? new Date(pet.nextVisit).toLocaleDateString() : '',
          pet.ownerId || '',
          `"${pet.notes || ''}"`, // Wrap in quotes for potential commas/line breaks
          `"${pet.fileName || ''}"`,
          `"${pet.filePath || ''}"`,
          pet._count?.painScores || pet.painScores?.length || 0,
          pet._count?.appointments || pet.appointments?.length || 0,
          pet._count?.medications || pet.medications?.length || 0,
          pet._count?.feedings || pet.feedings?.length || 0,
          pet._count?.seizures || pet.seizures?.length || 0,
          pet._count?.waters || pet.waters?.length || 0,
          pet._count?.bloodSugars || pet.bloodSugars?.length || 0,
          pet._count?.galleryItems || pet.galleryItems?.length || 0,
          pet._count?.movements || pet.movements?.length || 0,
          pet._count?.vitalSigns || pet.vitalSigns?.length || 0,
          pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : '',
          pet.updatedAt ? new Date(pet.updatedAt).toLocaleDateString() : ''
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    // Create download link
    const a = document.createElement('a')
    a.href = url
    a.download = `pets-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log(`Exported ${pets.length} pets successfully`)
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export pets data')
  }
}

// Alternative version with detailed health records export
export const exportPetsWithDetailedHealthData = (pets: any[]) => {
  console.log(pets)
  try {
    // Main pet data
    const petHeaders = [
      'Pet ID',
      'Name',
      'Type',
      'Breed',
      'Age',
      'Gender',
      'Weight',
      'Spayed/Neutered',
      'Microchip ID',
      'Allergies',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Last Visit',
      'Next Visit',
      'Owner ID',
      'Notes',
      'Created At',
      'Updated At'
    ]

    const petCsvData = [
      petHeaders.join(','),
      ...pets.map((pet) =>
        [
          pet.id || '',
          `"${pet.name || ''}"`,
          pet.type || '',
          `"${pet.breed || ''}"`,
          pet.age || '',
          pet.gender || '',
          pet.weight || '',
          pet.spayedNeutered || '',
          pet.microchipId || '',
          `"${pet.allergies || ''}"`,
          `"${pet.emergencyContactName || ''}"`,
          pet.emergencyContactPhone || '',
          pet.lastVisit ? new Date(pet.lastVisit).toLocaleDateString() : '',
          pet.nextVisit ? new Date(pet.nextVisit).toLocaleDateString() : '',
          pet.ownerId || '',
          `"${pet.notes || ''}"`,
          pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : '',
          pet.updatedAt ? new Date(pet.updatedAt).toLocaleDateString() : ''
        ].join(',')
      )
    ].join('\n')

    // Create and download main pets file
    const petBlob = new Blob([petCsvData], { type: 'text/csv' })
    const petUrl = window.URL.createObjectURL(petBlob)

    const petLink = document.createElement('a')
    petLink.href = petUrl
    petLink.download = `pets-summary-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(petLink)
    petLink.click()

    // Small delay to ensure first download starts
    setTimeout(() => {
      window.URL.revokeObjectURL(petUrl)
      document.body.removeChild(petLink)
    }, 1000)

    // Export detailed health records if they exist
    const allHealthRecords: any[] = []

    pets.forEach((pet) => {
      // Pain scores
      if (pet.painScores && pet.painScores.length > 0) {
        pet.painScores.forEach((score: { score: any; createdAt: any; date: any; notes: any }) => {
          allHealthRecords.push({
            petId: pet.id,
            petName: pet.name,
            recordType: 'Pain Score',
            value: score.score,
            date: score.createdAt || score.date,
            notes: score.notes || ''
          })
        })
      }
      if (pet.feedings && pet.feedings.length > 0) {
        pet.feedings.forEach((feeding: { foodType: any; foodAmount: any; brand: any; createdAt: any; notes: any }) => {
          allHealthRecords.push({
            petId: pet.id,
            petName: pet.name,
            recordType: 'Feeding',
            value: `${feeding.foodAmount} cups of ${feeding.brand} ${feeding.foodType}`,
            date: feeding.createdAt,
            notes: feeding.notes || ''
          })
        })
      }
      if (pet.water && pet.water.length > 0) {
        pet.waters.forEach((water: { milliliters: any; createdAt: any; notes: any }) => {
          allHealthRecords.push({
            petId: pet.id,
            petName: pet.name,
            recordType: 'Water',
            value: `${water.milliliters}mL`,
            date: water.createdAt,
            notes: water.notes || ''
          })
        })
      }

      // Medications
      if (pet.medications && pet.medications.length > 0) {
        pet.medications.forEach(
          (med: { name: any; medication: any; createdAt: any; date: any; dosage: any; frequency: any }) => {
            allHealthRecords.push({
              petId: pet.id,
              petName: pet.name,
              recordType: 'Medication',
              value: med.name || med.medication,
              date: med.createdAt || med.date,
              notes: `Dosage: ${med.dosage || ''}, Frequency: ${med.frequency || ''}`
            })
          }
        )
      }

      if (pet.movements && pet.movements.length > 0) {
        pet.movements.forEach((movement: { movementType: any; createdAt: any; activityLevel: any; notes: any }) => {
          allHealthRecords.push({
            petId: pet.id,
            petName: pet.name,
            recordType: 'Movement',
            value: movement.movementType,
            date: movement.createdAt,
            notes: movement.notes || `Activity level: ${movement.activityLevel}`
          })
        })
      }

      if (pet.appointments && pet.appointments.length > 0) {
        pet.appointments.forEach((appointment: { serviceType: any; createdAt: any; status: any; notes: any }) => {
          allHealthRecords.push({
            petId: pet.id,
            petName: pet.name,
            recordType: 'Appointment',
            value: appointment.serviceType,
            date: appointment.createdAt,
            notes: appointment.notes || `Status: ${appointment.status}`
          })
        })
      }
      if (pet.bloodSugars && pet.bloodSugars.length > 0) {
        pet.bloodSugars.forEach((bloodSugar: { mealRelation: any; createdAt: any; value: any; notes: any }) => {
          allHealthRecords.push({
            petId: pet.id,
            petName: pet.name,
            recordType: 'Blood Sugar',
            value: bloodSugar.value,
            date: bloodSugar.createdAt,
            notes: bloodSugar.notes || `Meal relation: ${bloodSugar.mealRelation}`
          })
        })
      }
      if (pet.seizures && pet.seizures.length > 0) {
        pet.seizures.forEach((seizure: { duration: any; createdAt: any; seizureType: any; notes: any }) => {
          allHealthRecords.push({
            petId: pet.id,
            petName: pet.name,
            recordType: 'Seizure',
            value: seizure.duration,
            date: seizure.createdAt,
            notes: seizure.notes || `Seizure type: ${seizure.seizureType}`
          })
        })
      }
    })

    if (allHealthRecords.length > 0) {
      const healthHeaders = ['Pet ID', 'Pet Name', 'Record Type', 'Value', 'Date', 'Notes']
      const healthCsvData = [
        healthHeaders.join(','),
        ...allHealthRecords.map((record) =>
          [
            record.petId,
            `"${record.petName}"`,
            record.recordType,
            `"${record.value}"`,
            record.date ? new Date(record.date).toLocaleDateString() : '',
            `"${record.notes}"`
          ].join(',')
        )
      ].join('\n')

      const healthBlob = new Blob([healthCsvData], { type: 'text/csv' })
      const healthUrl = window.URL.createObjectURL(healthBlob)

      const healthLink = document.createElement('a')
      healthLink.href = healthUrl
      healthLink.download = `pets-health-records-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(healthLink)
      healthLink.click()

      setTimeout(() => {
        window.URL.revokeObjectURL(healthUrl)
        document.body.removeChild(healthLink)
      }, 1000)
    }
  } catch {
    alert('Failed to export detailed pets data')
  }
}

// Usage example:
// exportAllPetsData(petsArray)
// exportPetsWithDetailedHealthData(petsArrayWithHealthRecords)
