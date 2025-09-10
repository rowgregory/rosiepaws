const exportBloodSugarsData = (bloodSugars: any[], petId?: string) => {
  try {
    // Filter blood sugar records for the given pet if petId is provided
    const filtered = petId ? bloodSugars.filter((b) => b.petId === petId) : bloodSugars

    if (filtered.length === 0) {
      alert('No blood sugar data found for this pet.')
      return
    }

    const headers = [
      'Pet ID',
      'Value',
      'Notes',
      'Time Recorded',
      'Meal Relation',
      'Measurement Unit',
      'Target Range',
      'Symptoms',
      'Medication Given',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...filtered.map((b) =>
        [
          b.petId,
          b.value || '',
          b.notes || '',
          new Date(b.timeRecorded).toLocaleString(),
          b.mealRelation || '',
          b.measurementUnit || '',
          b.targetRange || '',
          b.symptoms || '',
          b.medicationGiven ? 'Yes' : 'No',
          new Date(b.createdAt).toLocaleString(),
          new Date(b.updatedAt).toLocaleString()
        ].join(',')
      )
    ].join('\n')

    // Create CSV blob and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `blood-sugars-${petId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch {
    alert('Failed to export blood sugar data')
  }
}

export default exportBloodSugarsData
