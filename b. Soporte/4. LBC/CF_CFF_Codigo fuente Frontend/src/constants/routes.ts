import type { UserRole } from '../types/user'

export const ROLE_HOME_PATHS: Record<UserRole, string> = {
  ADMIN: '/admin',
  CLIENTE: '/client',
  ESPECIALISTA: '/specialist',
}
