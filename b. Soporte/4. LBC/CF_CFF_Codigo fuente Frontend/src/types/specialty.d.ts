export interface Specialty {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface CreateSpecialty {
  name: string
  description: string
}

export interface UpdateSpecialty {
  name?: string
  description?: string
}

export interface SpecialtyDto {
  id: string
  name: string
  description: string
  is_active: boolean
  created_at: Date
}

export interface CreateSpecialtyDto {
  name: string
  description: string
}

export interface UpdateSpecialtyDto {
  name?: string
  description?: string
}
