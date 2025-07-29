export const toggleLogExpansion = (logId: unknown, setExpandedLogs: any) => {
  setExpandedLogs((prev: Iterable<unknown> | null | undefined) => {
    const newSet = new Set(prev)
    if (newSet.has(logId)) {
      newSet.delete(logId)
    } else {
      newSet.add(logId)
    }
    return newSet
  })
}

export const copyLogToClipboard = async (text: string, logId: string, setCopiedLogId: any) => {
  try {
    await navigator.clipboard.writeText(text)
    setCopiedLogId(logId)

    setTimeout(() => {
      setCopiedLogId(null)
    }, 2000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}
