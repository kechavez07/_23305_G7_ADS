import {
  getMyAppointmentsRequest,
  reserveAppointmentRequest,
} from '../api/appointment'
import type { ReserveAppointment } from '../types/appointment'
import {
  mapFromAppointmentDto,
  mapFromUserAppointmentDto,
  mapToReserveAppointmentDto,
} from '../utils/appointment'

export async function getMyAppointmentsService() {
  try {
    const dtos = await getMyAppointmentsRequest()
    return dtos.map(mapFromUserAppointmentDto)
  } catch {
    throw new Error('No se pudo obtener las especialidades del usuario')
  }
}

export async function reserveAppointmentService(
  appointment: ReserveAppointment
) {
  try {
    const dto = mapToReserveAppointmentDto(appointment)
    const result = await reserveAppointmentRequest(dto)
    return mapFromAppointmentDto(result)
  } catch {
    throw new Error('No se pudo reservar la cita')
  }
}
