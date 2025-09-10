const exportPainScoresData = (painScores: any[], petId?: string) => {
  try {
    // Filter scores for the given pet
    const filteredScores = painScores.filter((ps) => ps.petId === petId)

    if (filteredScores.length === 0) {
      alert('No pain scores found for this pet.')
      return
    }

    const headers = [
      'Pet ID',
      'Score',
      'Time Recorded',
      'Symptoms',
      'Location',
      'Triggers',
      'Relief',
      'Notes',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),

      ...filteredScores.map((ps) =>
        [
          ps.petId,
          ps.score,
          new Date(ps.timeRecorded).toLocaleString(), // More detailed than date only
          ps.symptoms || '',
          ps.location || '',
          ps.triggers || '',
          ps.relief || '',
          ps.notes || '',
          new Date(ps.createdAt).toLocaleString(),
          new Date(ps.updatedAt).toLocaleString()
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    // Create download link
    const a = document.createElement('a')
    a.href = url
    a.download = `pain-scores-${petId}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch {
    alert('Failed to export pain scores data')
  }
}

export default exportPainScoresData
