import { useEffect, useState } from 'react'
import {
  type CreateSpecialty,
  type Specialty,
  type UpdateSpecialty,
} from '../types/specialty'
import {
  createSpecialtyService,
  deleteSpecialtyService,
  getSpecialtiesService,
  updateSpecialtyService,
} from '../services/specialty'

interface Options {
  includeInactive?: boolean
}

export function useSpecialties({ includeInactive = true }: Options = {}) {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSpecialtiesService({ includeInactive })
      .then((s) => setSpecialties(s))
      .catch(() => setSpecialties([]))
      .finally(() => setLoading(false))
  }, [includeInactive])

  const createSpecialty = async (specialty: CreateSpecialty) => {
    const newSpecialty = await createSpecialtyService(specialty)

    setSpecialties((specialties) => {
      const newSpecialties = [...specialties]
      newSpecialties.push(newSpecialty)
      return newSpecialties
    })
  }

  const updateSpecialty = async (id: string, specialty: UpdateSpecialty) => {
    const specialtyUpdated = await updateSpecialtyService(id, specialty)

    setSpecialties((specialties) => {
      const updatedSpecialties = specialties.map((specialty) =>
        specialty.id === specialtyUpdated.id ? specialtyUpdated : specialty
      )
      return updatedSpecialties
    })
  }

  const deleteSpecialty = async (id: string) => {
    await deleteSpecialtyService(id)

    setSpecialties((specialties) =>
      specialties.map((specialty) =>
        specialty.id === id
          ? {
              ...specialty,
              isActive: false,
            }
          : specialty
      )
    )
  }

  return {
    specialties,
    loading,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  }
}
