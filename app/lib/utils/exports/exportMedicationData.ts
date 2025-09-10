const exportMedicationsData = (medications: any[], petId?: string) => {
  try {
    // Filter medications for the given pet if petId is provided
    const filteredMeds = petId ? medications.filter((m) => m.petId === petId) : medications

    if (filteredMeds.length === 0) {
      alert('No medication data found for this pet.')
      return
    }

    const headers = [
      'Pet ID',
      'Drug Name',
      'Dosage',
      'Dosage Unit',
      'Frequency',
      'Custom Frequency',
      'Start Date',
      'End Date',
      'Reminder Enabled',
      'Reminder Times',
      'Last Reminder Date',
      'Sent Reminders Today',
      'Notes',
      'Prescribed By',
      'Timezone Offset',
      'Created At',
      'Updated At'
    ]

    const csvData = [
      headers.join(','),
      ...filteredMeds.map((m) =>
        [
          m.petId,
          m.drugName || '',
          m.dosage || '',
          m.dosageUnit || '',
          m.frequency || '',
          m.customFrequency || '',
          new Date(m.startDate).toLocaleString(),
          m.endDate ? new Date(m.endDate).toLocaleString() : '',
          m.reminderEnabled ? 'Yes' : 'No',
          m.reminderTimes?.join(';') || '',
          m.lastReminderDate || '',
          m.sentRemindersToday?.join(';') || '',
          m.notes || '',
          m.prescribedBy || '',
          m.timezoneOffset ?? -5,
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
    a.download = `medications-${petId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log(`Exported ${filteredMeds.length} medication records for pet ${petId || 'all pets'}`)
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export medication data')
  }
}

export default exportMedicationsData
