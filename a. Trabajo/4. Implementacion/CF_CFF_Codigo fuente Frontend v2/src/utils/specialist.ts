import type { FormValues } from '../components/forms/SpecialistForm'
import type {
  CreateSpecialist,
  CreateSpecialistDto,
  Specialist,
  SpecialistDto,
  UpdateSpecialist,
  UpdateSpecialistDto,
} from '../types/specialist'

export function mapFromSpecialistDto(dto: SpecialistDto): Specialist {
  return {
    email: dto.email,
    fullName: dto.full_name,
    id: dto.id,
    specialtyId: dto.specialist_profile.specialty_id,
    title: dto.specialist_profile.title,
    isActive: dto.is_active,
    role: dto.role,
    phoneNumber: dto.phone_number,
  }
}

export function mapToCreateSpecialistDto(
  specialist: CreateSpecialist
): CreateSpecialistDto {
  return {
    email: specialist.email,
    full_name: specialist.fullName,
    specialty_id: specialist.specialtyId,
    title: specialist.title,
    phone_number: specialist.phoneNumber,
  }
}

export function mapToCreateSpecialist(form: FormValues): CreateSpecialist {
  return {
    email: form.email,
    fullName: form.fullName,
    phoneNumber: form.phoneNumber,
    specialtyId: form.specialtyId,
    title: form.title,
  }
}

export function mapToUpdateSpecialistDto(
  specialist: UpdateSpecialist
): UpdateSpecialistDto {
  return {
    full_name: specialist.fullName,
    specialty_id: specialist.specialtyId,
    title: specialist.title,
    is_active: specialist.isActive,
    phone_number: specialist.phoneNumber,
  }
}

export function mapToUpdateSpecialist(form: FormValues): UpdateSpecialist {
  return {
    fullName: form.fullName,
    phoneNumber: form.phoneNumber,
    specialtyId: form.specialtyId,
    title: form.title,
    isActive: form.isActive,
  }
}
