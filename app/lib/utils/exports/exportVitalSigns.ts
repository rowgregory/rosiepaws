const exportVitalSignsData = (vitalSigns: any[], petId?: string) => {
  try {
    // Filter vital signs for the given pet if petId is provided
    const filtered = petId ? vitalSigns.filter((v) => v.petId === petId) : vitalSigns

    if (filtered.length === 0) {
      alert('No vital signs data found for this pet.')
      return
    }

    const headers = [
      'Pet ID',
      'Temperature (F)',
      'Heart Rate (bpm)',
      'Respiratory Rate (breaths/min)',
      'Weight (lbs)',
      'Blood Pressure',
      'Capillary Refill Time',
      'Mucous Membranes',
      'Hydration Status',
      'Notes',
      'Time Recorded',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...filtered.map((v) =>
        [
          v.petId,
          v.temperature ?? '',
          v.heartRate ?? '',
          v.respiratoryRate ?? '',
          v.weight ?? '',
          v.bloodPressure || '',
          v.capillaryRefillTime || '',
          v.mucousMembranes || '',
          v.hydrationStatus || '',
          v.notes || '',
          new Date(v.timeRecorded).toLocaleString(),
          new Date(v.createdAt).toLocaleString(),
          new Date(v.updatedAt).toLocaleString()
        ].join(',')
      )
    ].join('\n')

    // Create CSV blob and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `vital-signs-${petId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch {
    alert('Failed to export vital signs data')
  }
}

export default exportVitalSignsData
