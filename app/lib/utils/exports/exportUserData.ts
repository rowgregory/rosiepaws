const exportUsersData = (users: any[]) => {
  try {
    const headers = ['Name', 'Email', 'Role', 'Created At', 'Tokens', 'Pets Count']
    const csvData = [
      headers.join(','),
      ...users.map((user) =>
        [
          user.name || '',
          user.email,
          user.role,
          new Date(user.createdAt).toLocaleDateString(),
          user.tokens,
          user._count?.pets || 0
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    // Create download link
    const a = document.createElement('a')
    a.href = url
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log(`Exported ${users.length} users successfully`)
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export users data')
  }
}

export default exportUsersData
