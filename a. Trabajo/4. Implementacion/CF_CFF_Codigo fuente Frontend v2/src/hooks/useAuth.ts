import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'
import type { Login } from '../types/auth'
import {
  login as loginService,
  logout as logoutService,
} from '../services/auth'
import { useNavigate } from 'react-router'
import { ROLE_HOME_PATHS } from '../constants/routes'

export function useAuth() {
  const context = useContext(AuthContext)
  const navigate = useNavigate()

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  const { authUser, setAuthUser } = context

  const login = async (data: Login) => {
    const authUser = await loginService(data)
    setAuthUser(authUser)
    navigate(ROLE_HOME_PATHS[authUser.role], { replace: true })
  }

  const logout = () => {
    logoutService()
    setAuthUser(null)
    navigate('/', { replace: true })
  }

  return {
    authUser,
    login,
    logout,
  }
}
