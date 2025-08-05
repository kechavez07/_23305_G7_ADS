import { useMemo } from 'react'
import { useSpecialists } from '../../hooks/useSpecialists'
import type { Specialist } from '../../types/specialist'
import { useSpecialtyCache } from '../../hooks/useSpecialtyCache'

interface Props {
  id?: string
  name?: string
  onChange?: (id: string) => void
}

export function SpecialistSelect({ id, name, onChange }: Props) {
  const { specialists } = useSpecialists({ includeInactive: false })
  const { getSpecialty } = useSpecialtyCache([
    ...new Set(specialists.map((specialist) => specialist.specialtyId)),
  ])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const specialistId = e.currentTarget.value
    onChange?.(specialistId)
  }

  const specialistsGroupBySpecialty = useMemo(() => {
    const specialistsBySpecialty: Record<string, Specialist[]> = {}

    for (const specialist of specialists) {
      const specialistsGrouped = specialistsBySpecialty[specialist.specialtyId]

      if (!specialistsGrouped) {
        specialistsBySpecialty[specialist.specialtyId] = new Array<Specialist>()
      }

      specialistsBySpecialty[specialist.specialtyId].push(specialist)
    }

    return specialistsBySpecialty
  }, [specialists])

  return (
    <select
      className="border border-gray-300 rounded-md p-2"
      id={id}
      name={name}
      onChange={handleChange}
    >
      <option value="">Seleccionar especialista</option>
      {Object.entries(specialistsGroupBySpecialty).map(
        ([specialtyId, specialists]) => (
          <optgroup key={specialtyId} label={getSpecialty(specialtyId)?.name}>
            {specialists.map((specialist) => (
              <option key={specialist.id} value={specialist.id}>
                {specialist.fullName}
              </option>
            ))}
          </optgroup>
        )
      )}
    </select>
  )
}
