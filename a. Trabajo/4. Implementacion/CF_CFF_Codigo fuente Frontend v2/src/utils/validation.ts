export const MIN_AGE = 1
export const MAX_AGE = 99

export function isValidFullName(text: string) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,})+$/.test(
    text.trim()
  )
}

export function isValidPhoneNumber(phone: string) {
  return /^0\d{9}$/.test(phone)
}

export function isAgeInRange(age: number) {
  return age >= MIN_AGE && age <= MAX_AGE
}
