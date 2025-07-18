export const formatDate = (dateStr: Date) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const formatDateFull = (dateStr: Date) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export const isPainScoreFormValid = (inputs: any) => {
  return inputs?.petId && inputs?.score && inputs?.timeRecorded
}

export const getTodaysPainScores = (painScores: any[]) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return painScores.filter((painScore) => {
    const painScoreDate = new Date(painScore?.createdAt)
    painScoreDate.setHours(0, 0, 0, 0)
    return painScoreDate.getTime() === today.getTime()
  })
}
