export const getDashboardNextAppointment = (appointments: any[]) => {
  const now = new Date()

  const nextAppointment = appointments
    .filter((appointment) => {
      // Parse the date and time - assuming MM/DD/YYYY format and 24-hour time
      const [month, day, year] = appointment.date.split('/')
      const [hours, minutes] = appointment.time.split(':')

      // Create date object (month is 0-indexed in JavaScript)
      const appointmentDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      )

      return appointmentDateTime > now
    })
    .sort((a, b) => {
      // Sort by datetime
      const [monthA, dayA, yearA] = a.date.split('/')
      const [hoursA, minutesA] = a.time.split(':')
      const dateTimeA = new Date(
        parseInt(yearA),
        parseInt(monthA) - 1,
        parseInt(dayA),
        parseInt(hoursA),
        parseInt(minutesA)
      )

      const [monthB, dayB, yearB] = b.date.split('/')
      const [hoursB, minutesB] = b.time.split(':')
      const dateTimeB = new Date(
        parseInt(yearB),
        parseInt(monthB) - 1,
        parseInt(dayB),
        parseInt(hoursB),
        parseInt(minutesB)
      )

      return Number(dateTimeA) - Number(dateTimeB)
    })[0]

  return nextAppointment || null
}
