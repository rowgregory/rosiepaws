export const formatDate = (dateCreated: string | number | Date, options?: any): string => {
  return new Date(dateCreated).toLocaleDateString('en-US', {
    ...options,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour12: true,
    timeZone: 'America/New_York'
  })
}
