const exportUserPetsData = (pets: any[]) => {
  try {
    const headers = [
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
      'Notes',
      'File Name',
      'File Path',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...pets.map((pet) =>
        [
          pet.name || '',
          pet.type || '',
          pet.breed || '',
          pet.age || '',
          pet.gender || '',
          pet.weight || '',
          pet.spayedNeutered || '',
          pet.microchipId || '',
          pet.allergies || '',
          pet.emergencyContactName || '',
          pet.emergencyContactPhone || '',
          pet.notes || '',
          pet.fileName || '',
          pet.filePath || '',
          new Date(pet.createdAt).toLocaleDateString(),
          new Date(pet.updatedAt).toLocaleDateString()
        ]
          .map((field) =>
            // Escape commas and quotes in CSV fields
            typeof field === 'string' && (field.includes(',') || field.includes('"'))
              ? `"${field.replace(/"/g, '""')}"`
              : field
          )
          .join(',')
      )
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
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

export default exportUserPetsData
