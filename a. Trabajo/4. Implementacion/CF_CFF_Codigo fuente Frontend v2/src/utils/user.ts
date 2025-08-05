import type { User, UserDto, UserRole } from '../types/user'

export function isUserRole(role: string): role is UserRole {
  const roles: UserRole[] = ['ADMIN', 'CLIENTE', 'ESPECIALISTA']
  return roles.includes(role as UserRole)
}

export function mapFromUserDto(userDto: UserDto): User {
  if (!isUserRole(userDto.role)) throw new Error('Rol de usuario incorrecto')

  return {
    email: userDto.email,
    fullName: userDto.full_name,
    id: userDto.id,
    role: userDto.role,
  }
}
