import type {
  Availability,
  AvailabilityDto,
  CreateAvailability,
  CreateAvailabilityDto,
  UpdateAvailability,
  UpdateAvailabilityDto,
} from '../types/availability'

export function mapFromAvailabilityDto(dto: AvailabilityDto): Availability {
  return {
    id: dto.id,
    specialistId: dto.specialist_id,
    startTime: new Date(dto.start_time),
    endTime: new Date(dto.end_time),
    isBooked: dto.is_booked,
    createdAt: new Date(dto.created_at),
  }
}

export function mapToCreateAvailabilityDto(
  availability: CreateAvailability
): CreateAvailabilityDto {
  return {
    end_time: availability.endTime.toISOString(),
    start_time: availability.startTime.toISOString(),
  }
}

export function mapToUpdateAvailabilityDto(
  availability: UpdateAvailability
): UpdateAvailabilityDto {
  return {
    end_time: availability.endTime.toISOString(),
    start_time: availability.startTime.toISOString(),
  }
}

export function getAvailabilityStatusColor(isBooked: boolean) {
  return isBooked ? '#f87171' : '#a3e635'
}

export function getAvailabilityStatusLabel(isBooked: boolean) {
  return isBooked ? 'Reservado' : 'Disponible'
}
