export const getTodaysPainScores = (painScores: any[]) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return painScores.filter((painScore) => {
    const painScoreDate = new Date(painScore?.createdAt)
    painScoreDate.setHours(0, 0, 0, 0)
    return painScoreDate.getTime() === today.getTime()
  })
}
