import { Navigate, Outlet } from 'react-router'
import type { UserRole } from '../../types/user'
import { ROLE_HOME_PATHS } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const { authUser } = useAuth()

  if (!authUser) {
    return <Navigate to={'/'} replace />
  }

  if (!allowedRoles.includes(authUser.role)) {
    return <Navigate to={ROLE_HOME_PATHS[authUser.role]} replace />
  }

  return <Outlet />
}
