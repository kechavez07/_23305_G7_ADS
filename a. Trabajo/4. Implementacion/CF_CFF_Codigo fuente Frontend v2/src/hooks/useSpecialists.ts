import { useEffect, useState } from 'react'
import type {
  CreateSpecialist,
  Specialist,
  UpdateSpecialist,
} from '../types/specialist'
import {
  createSpecialistService,
  deleteSpecialistService,
  getSpecialistsService,
  updateSpecialistService,
} from '../services/specialist'

interface Options {
  includeInactive?: boolean
}

export function useSpecialists({ includeInactive = true }: Options = {}) {
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSpecialistsService({ includeInactive })
      .then((s) => setSpecialists(s))
      .catch(() => setSpecialists([]))
      .finally(() => setLoading(false))
  }, [includeInactive])

  const createSpecialist = async (specialist: CreateSpecialist) => {
    const newSpecialist = await createSpecialistService(specialist)

    setSpecialists((prev) => [...prev, newSpecialist])
  }

  const updateSpecialist = async (id: string, specialist: UpdateSpecialist) => {
    const updatedSpecialist = await updateSpecialistService(id, specialist)

    setSpecialists((specialists) =>
      specialists.map((s) => (s.id === id ? updatedSpecialist : s))
    )
  }

  const deleteSpecialist = async (id: string) => {
    await deleteSpecialistService(id)

    setSpecialists((specialists) =>
      specialists.map((s) =>
        s.id === id
          ? {
              ...s,
              isActive: false,
            }
          : s
      )
    )
  }

  return {
    specialists,
    loading,
    createSpecialist,
    updateSpecialist,
    deleteSpecialist,
  }
}
