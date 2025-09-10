const exportMovementsData = (movements: any[], petId?: string) => {
  try {
    // Filter movements for the given pet if petId is provided
    const filteredMovements = petId ? movements.filter((m) => m.petId === petId) : movements

    if (filteredMovements.length === 0) {
      alert('No movement data found for this pet.')
      return
    }

    const headers = [
      'Pet ID',
      'User ID',
      'Time Recorded',
      'Movement Type',
      'Duration Minutes',
      'Distance Meters',
      'Activity Level',
      'Location',
      'Indoor',
      'Weather',
      'Temperature',
      'Energy Before',
      'Energy After',
      'Pain Before',
      'Pain After',
      'Gait Quality',
      'Mobility',
      'Assistance',
      'Wheelchair',
      'Harness',
      'Leash',
      'Enthusiasm',
      'Reluctance',
      'Limping',
      'Panting',
      'Rest Breaks',
      'Recovery Time',
      'Notes',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...filteredMovements.map((m) =>
        [
          m.petId,
          m.userId,
          new Date(m.timeRecorded).toLocaleString(),
          m.movementType || '',
          m.durationMinutes ?? '',
          m.distanceMeters ?? '',
          m.activityLevel || '',
          m.location || '',
          m.indoor ? 'Yes' : 'No',
          m.weather || '',
          m.temperature ?? '',
          m.energyBefore || '',
          m.energyAfter || '',
          m.painBefore ?? '',
          m.painAfter ?? '',
          m.gaitQuality || '',
          m.mobility || '',
          m.assistance || '',
          m.wheelchair ? 'Yes' : 'No',
          m.harness ? 'Yes' : 'No',
          m.leash ? 'Yes' : 'No',
          m.enthusiasm ?? '',
          m.reluctance ? 'Yes' : 'No',
          m.limping ? 'Yes' : 'No',
          m.panting || '',
          m.restBreaks ?? '',
          m.recoveryTime ?? '',
          m.notes || '',
          new Date(m.createdAt).toLocaleString(),
          new Date(m.updatedAt).toLocaleString()
        ].join(',')
      )
    ].join('\n')

    // Create CSV blob and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `movements-${petId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch {
    alert('Failed to export movement data')
  }
}

export default exportMovementsData
