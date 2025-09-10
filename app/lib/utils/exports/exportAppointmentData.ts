const exportAppointmentsData = (appointments: any[], petId?: string) => {
  try {
    // Filter appointments for the given pet if petId is provided
    const filtered = petId ? appointments.filter((a) => a.petId === petId) : appointments

    if (filtered.length === 0) {
      alert('No appointment data found for this pet.')
      return
    }

    const headers = [
      'Pet ID',
      'Date',
      'Time',
      'Reminder Time',
      'Reminder Enabled',
      'Service Type',
      'Description',
      'Status',
      'Veterinarian',
      'Notes',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...filtered.map((a) =>
        [
          a.petId,
          new Date(a.date).toLocaleDateString(),
          a.time || '',
          a.reminderTime || '',
          a.reminderEnabled ? 'Yes' : 'No',
          a.serviceType || '',
          a.description || '',
          a.status || '',
          a.veterinarian || '',
          a.notes || '',
          new Date(a.createdAt).toLocaleString(),
          new Date(a.updatedAt).toLocaleString()
        ].join(',')
      )
    ].join('\n')

    // Create CSV blob and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `appointments-${petId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log(`Exported ${filtered.length} appointment records for pet ${petId || 'all pets'}`)
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export appointment data')
  }
}

export default exportAppointmentsData
