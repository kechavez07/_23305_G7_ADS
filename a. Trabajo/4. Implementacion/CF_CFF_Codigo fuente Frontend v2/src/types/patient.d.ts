import type { Sex } from './sex'

export interface Patient {
  fullName: string
  age: number
  sex: Sex
  condition: string
}

export interface RegistratePatient {
  email: string
  fullName: string
  phoneNumber: string
  patient: Patient
}

export interface PatientDto {
  full_name: string
  age: number
  gender: Sex
  condition?: string
}

export interface RegistratePatientDto {
  email: string
  full_name: string
  phone_number: string
  patient: PatientDto
}
