const exportWaterData = (waters: any[], petId?: string) => {
  try {
    // Filter waters for the given pet if petId is provided
    const filteredWaters = petId ? waters.filter((w) => w.petId === petId) : waters

    if (filteredWaters.length === 0) {
      alert('No water data found for this pet.')
      return
    }

    const headers = ['Pet ID', 'Milliliters', 'Mood Rating', 'Notes', 'Time Recorded', 'Created At', 'Updated At']

    const csvData = [
      headers.join(','),
      ...filteredWaters.map((w) =>
        [
          w.petId,
          w.milliliters || '',
          w.moodRating ?? 0,
          w.notes || '',
          new Date(w.timeRecorded).toLocaleString(),
          new Date(w.createdAt).toLocaleString(),
          new Date(w.updatedAt).toLocaleString()
        ].join(',')
      )
    ].join('\n')

    // Create CSV blob and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `waters-${petId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log(`Exported ${filteredWaters.length} water records for pet ${petId || 'all pets'}`)
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export water data')
  }
}

export default exportWaterData
