import type { FormValues } from '../components/forms/SpecialtyForm'
import type {
  CreateSpecialtyDto,
  UpdateSpecialtyDto,
  Specialty,
  SpecialtyDto,
  CreateSpecialty,
  UpdateSpecialty,
} from '../types/specialty'

export function mapToCreateSpecialty(form: FormValues): CreateSpecialty {
  return {
    description: form.description,
    name: form.name,
  }
}

export function mapToUpdateSpecialty(form: FormValues): UpdateSpecialty {
  return {
    description: form.description,
    name: form.name,
  }
}

export function mapFromSpecialtyDto(specialtyDto: SpecialtyDto): Specialty {
  return {
    description: specialtyDto.description,
    name: specialtyDto.name,
    id: specialtyDto.id,
    isActive: specialtyDto.is_active,
  }
}

export function mapToCreateSpecialtyDto(
  specialty: CreateSpecialty
): CreateSpecialtyDto {
  return {
    description: specialty.description,
    name: specialty.name,
  }
}

export function mapToUpdateSpecialtyDto(
  specialty: UpdateSpecialty
): UpdateSpecialtyDto {
  return {
    description: specialty.description,
    name: specialty.name,
  }
}
