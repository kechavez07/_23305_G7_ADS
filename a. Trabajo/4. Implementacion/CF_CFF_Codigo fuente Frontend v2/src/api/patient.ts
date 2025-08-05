import type { RegistratePatientDto } from '../types/patient'
import api from './api'

export async function registerPatientRequest(
  dto: RegistratePatientDto
): Promise<void> {
  await api.post('/auth/register', dto)
}
