import { useEffect, useState } from 'react'
import type {
  Availability,
  CreateAvailability,
  UpdateAvailability,
} from '../types/availability'
import {
  createAvailabilityService,
  deleteAvailabilityService,
  getAvailablityBySpecialistIdService,
  updateAvailabilityService,
} from '../services/availability'
import { getEndWeek, getStartWeek } from '../utils/date'

const currentMonday = getStartWeek()
const currentSunday = getEndWeek()

interface Options {
  userId?: string
  start?: Date
  end?: Date
}

export function useAvailabilities({
  userId,
  start = currentMonday,
  end = currentSunday,
}: Options) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId?.length) {
      return
    }

    setLoading(true)

    getAvailablityBySpecialistIdService(userId, { start, end })
      .then((a) => setAvailabilities(a))
      .catch(() => setAvailabilities([]))
      .finally(() => setLoading(false))
  }, [userId, start, end])

  const createAvailability = async (availability: CreateAvailability) => {
    const createdAvailability = await createAvailabilityService(availability)
    setAvailabilities((prev) => [...prev, createdAvailability])
  }

  const updateAvailability = async (
    id: string,
    availability: UpdateAvailability
  ) => {
    const updatedAvailability = await updateAvailabilityService(
      id,
      availability
    )

    setAvailabilities((availabilities) =>
      availabilities.map((availability) =>
        availability.id === updatedAvailability.id
          ? updatedAvailability
          : availability
      )
    )
  }

  const deleteAvailability = async (id: string) => {
    await deleteAvailabilityService(id)
  }

  return {
    availabilities,
    loading,
    createAvailability,
    updateAvailability,
    deleteAvailability,
  }
}
