export function formatHour(date: Date | null) {
  const hour = date?.getHours().toString().padStart(2, '0')
  const minutes = date?.getMinutes().toString().padStart(2, '0')
  return `${hour}:${minutes}`
}

export function roundUpToNextHour(date: Date): Date {
  const result = new Date(date)
  const needsRounding = date.getMinutes() !== 0
  const nextHour = result.getHours() + (needsRounding ? 1 : 0)
  result.setHours(nextHour, 0, 0, 0)
  return result
}

export function roundDownHour(date: Date): Date {
  const result = new Date(date)
  result.setHours(date.getHours(), 0, 0, 0)
  return result
}

export function getStartWeek(currentDate?: Date): Date {
  const today = new Date()
  const currentDay = currentDate ? new Date(currentDate) : today
  const startWeek = new Date()
  startWeek.setHours(0, 0, 0)
  startWeek.setDate(currentDay.getDate() - currentDay.getDay())
  return startWeek
}

export function getEndWeek(currentDate?: Date): Date {
  const today = new Date()
  const currentDay = currentDate ? new Date(currentDate) : today
  const endWeek = new Date()
  const saturday = 6
  const daysUntilEndWeek = saturday - currentDay.getDay()
  endWeek.setHours(23, 59, 59)
  endWeek.setDate(currentDay.getDate() + daysUntilEndWeek)
  return endWeek
}

export function getStartDay(currentDate?: Date): Date {
  const today = new Date()
  const currentDay = currentDate ? new Date(currentDate) : today
  currentDay.setHours(0, 0, 0)
  return currentDay
}

export function getEndDay(currentDate?: Date): Date {
  const today = new Date()
  const currentDay = currentDate ? new Date(currentDate) : today
  currentDay.setHours(23, 59, 59)
  return currentDay
}
