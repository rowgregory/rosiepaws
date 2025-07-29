export const getDaysSinceUpdate = (updatedAt: Date) => {
  const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24))
  return daysSinceUpdate === 0 ? 'Today' : `${daysSinceUpdate} days ago`
}
