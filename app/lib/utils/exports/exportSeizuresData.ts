const exportSeizuresData = (seizures: any[], petId?: string) => {
  try {
    // Filter seizures for the given pet if petId is provided
    const filtered = petId ? seizures.filter((s) => s.petId === petId) : seizures

    if (filtered.length === 0) {
      alert('No seizure data found for this pet.')
      return
    }

    const headers = [
      'Pet ID',
      'Time Recorded',
      'Duration (seconds)',
      'Notes',
      'Video URL',
      'Video Filename',
      'Seizure Type',
      'Severity',
      'Trigger Factor',
      'Recovery Time (minutes)',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...filtered.map((s) =>
        [
          s.petId,
          new Date(s.timeRecorded).toLocaleString(),
          s.duration ?? '',
          s.notes || '',
          s.videoUrl || '',
          s.videoFilename || '',
          s.seizureType || '',
          s.severity || '',
          s.triggerFactor || '',
          s.recoveryTime ?? '',
          new Date(s.createdAt).toLocaleString(),
          new Date(s.updatedAt).toLocaleString()
        ].join(',')
      )
    ].join('\n')

    // Create CSV blob and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `seizures-${petId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log(`Exported ${filtered.length} seizure records for pet ${petId || 'all pets'}`)
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export seizure data')
  }
}

export default exportSeizuresData
