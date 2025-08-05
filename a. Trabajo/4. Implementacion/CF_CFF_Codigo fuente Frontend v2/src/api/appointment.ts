import type {
  AppointmentDto,
  ReserveAppointmentDto,
  UserAppointmentDto,
} from '../types/appointment'
import api from './api'

export async function getMyAppointmentsRequest(): Promise<
  UserAppointmentDto[]
> {
  const result = await api.get('/appointments/my-appointments')
  return result.data as UserAppointmentDto[]
}

export async function reserveAppointmentRequest(
  dto: ReserveAppointmentDto
): Promise<AppointmentDto> {
  const result = await api.post('/appointments', dto)
  return result.data as AppointmentDto
}
