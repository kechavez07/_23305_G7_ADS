import { SEX_VALUES } from '../constants/sex'
import type { Sex, SexOption } from '../types/sex'

export function getSexLabel(sex: Sex): string {
  const dictionary: Record<Sex, string> = {
    FEMENINO: 'Mujer',
    MASCULINO: 'Hombre',
    OTRO: 'Otro',
  }

  return dictionary[sex] ?? 'Desconocido'
}

export function getSexOptions(): SexOption[] {
  return SEX_VALUES.map((s) => {
    return { value: s, label: getSexLabel(s) }
  })
}

export function isSex(option: string): option is Sex {
  return SEX_VALUES.includes(option as Sex)
}
