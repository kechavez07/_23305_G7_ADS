export interface UserDto {
  id: string
  email: string
  full_name: string
  role: string
}

export type UserRole = 'ADMIN' | 'CLIENTE' | 'ESPECIALISTA'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
}
