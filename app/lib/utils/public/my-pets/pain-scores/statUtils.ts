export const getAveragePainScore = (todaysPainScores: any[], todaysPainScoresCount: number) =>
  (todaysPainScores.reduce((sum, score) => sum + score.score, 0) / todaysPainScoresCount).toFixed(1)
