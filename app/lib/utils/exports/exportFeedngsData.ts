const exportFeedingsData = (feedings: any[], petId?: string) => {
  try {
    // Filter feedings for the given pet if petId is provided
    const filteredFeedings = petId ? feedings.filter((f) => f.petId === petId) : feedings

    if (filteredFeedings.length === 0) {
      alert('No feeding data found for this pet.')
      return
    }

    const headers = [
      'Pet ID',
      'Food Type',
      'Food Amount',
      'Mood Rating',
      'Brand',
      'Notes',
      'Time Recorded',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...filteredFeedings.map((f) =>
        [
          f.petId,
          f.foodType || '',
          f.foodAmount || '',
          f.moodRating ?? 0,
          f.brand || '',
          f.notes || '',
          new Date(f.timeRecorded).toLocaleString(),
          new Date(f.createdAt).toLocaleString(),
          new Date(f.updatedAt).toLocaleString()
        ].join(',')
      )
    ].join('\n')

    // Create CSV blob and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `feedings-${petId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch {
    alert('Failed to export feeding data')
  }
}

export default exportFeedingsData
