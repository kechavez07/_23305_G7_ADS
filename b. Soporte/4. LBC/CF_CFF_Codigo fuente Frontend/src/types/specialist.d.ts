import type { User, UserRole } from './user'

export interface Specialist extends User {
  phoneNumber: string
  isActive: boolean
  specialtyId: string
  title: string
}

export interface SpecialistProfileDto {
  user_id: string
  specialty_id: string
  title: string
  created_at: string
}

export interface SpecialistDto {
  id: string
  email: string
  full_name: string
  phone_number: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
  specialist_profile: SpecialistProfileDto
}

export interface CreateSpecialist {
  email: string
  fullName: string
  phoneNumber: string
  title: string
  specialtyId: string
}

export interface CreateSpecialistDto {
  email: string
  full_name: string
  phone_number: string
  title: string
  specialty_id: string
}

export interface UpdateSpecialist {
  fullName: string
  phoneNumber: string
  isActive: boolean
  title: string
  specialtyId: string
}

export interface UpdateSpecialistDto {
  full_name?: string
  phone_number?: string
  is_active?: boolean
  specialty_id?: string
  title?: string
}
