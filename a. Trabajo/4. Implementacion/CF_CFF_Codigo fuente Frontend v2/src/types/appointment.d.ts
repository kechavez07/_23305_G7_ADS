import type { APPOINTMENT_STATUS } from '../constants/appointment'
import type { Availability, AvailabilityDto } from './availability'
import type { SpecialistProfileDto } from './specialist'

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[number]

export interface AppointmentDto {
  id: string
  patiend_id: string
  specialist_id: string
  availability_id: string
  status: AppointmentStatus
  notes: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patiendId: string
  specialistId: string
  availabilityId: string
  status: AppointmentStatus
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface UserAppointmentDto extends AppointmentDto {
  specialist: {
    full_name: string
    specialist_profile: SpecialistProfileDto & {
      specialty: {
        name: string
      }
    }
  }
  availability: Pick<AvailabilityDto, 'start_time' | 'end_time'>
}

export interface UserAppointment extends Appointment {
  specialistName: string
  specialtyName: string
  availability: Pick<Availability, 'startTime' | 'endTime'>
}

export interface ReserveAppointment {
  availabilityId: string
  patiendId: string
}

export interface ReserveAppointmentDto {
  availability_id: string
  patiend_id: string
}
