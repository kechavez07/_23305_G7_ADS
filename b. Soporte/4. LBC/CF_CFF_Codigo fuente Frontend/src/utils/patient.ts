import type { FormValues } from '../components/forms/RegisterForm'
import type { RegistratePatient, RegistratePatientDto } from '../types/patient'

export function mapToRegistratePatientDto(
  register: RegistratePatient
): RegistratePatientDto {
  return {
    email: register.email,
    full_name: register.fullName,
    phone_number: register.phoneNumber,
    patient: {
      age: register.patient.age,
      full_name: register.patient.fullName,
      gender: register.patient.sex,
      condition: register.patient.condition,
    },
  }
}

export function mapToRegistratePatient(form: FormValues): RegistratePatient {
  return {
    email: form.representativeEmail,
    fullName: form.representativeName,
    phoneNumber: form.representativePhone,
    patient: {
      age: form.patientAge,
      condition: form.medicalCondition,
      fullName: form.patientName,
      sex: form.patientSex,
    },
  }
}
