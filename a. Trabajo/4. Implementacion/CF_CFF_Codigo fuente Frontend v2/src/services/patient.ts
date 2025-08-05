import type { RegistratePatient } from '../types/patient'
import { mapToRegistratePatientDto } from '../utils/patient'
import { registerPatientRequest } from '../api/patient'

export async function registerPatient(
  registration: RegistratePatient
): Promise<void> {
  try {
    const dto = mapToRegistratePatientDto(registration)
    await registerPatientRequest(dto)
  } catch {
    throw new Error('El usuario no pudo ser registrado')
  }
}
