export interface AvailabilityDto {
  id: string
  specialist_id: string
  start_time: string
  end_time: string
  is_booked: boolean
  created_at: string
}

export interface Availability {
  id: string
  specialistId: string
  startTime: Date
  endTime: Date
  isBooked: boolean
  createdAt: Date
}

export interface CreateAvailability {
  startTime: Date
  endTime: Date
}

export interface CreateAvailabilityDto {
  start_time: string
  end_time: string
}

export interface UpdateAvailability {
  startTime: Date
  endTime: Date
}

export interface UpdateAvailabilityDto {
  start_time: string
  end_time: string
}
