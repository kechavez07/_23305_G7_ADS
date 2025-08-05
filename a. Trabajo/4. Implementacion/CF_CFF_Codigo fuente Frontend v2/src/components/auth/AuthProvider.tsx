import { useState } from 'react'
import { AuthContext } from '../../contexts/authContext'
import type { AuthUser } from '../../types/auth'
import { getAuthUser } from '../../services/auth'

interface Props {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getAuthUser)

  return (
    <AuthContext
      value={{
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext>
  )
}
