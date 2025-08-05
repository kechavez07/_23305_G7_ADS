import { jwtDecode } from 'jwt-decode'
import { loginRequest } from '../api/auth'
import type { AccessTokenPayload, AuthUser, LoginDto } from '../types/auth'
import { mapFromAccessTokenPayload } from '../utils/auth'
import { getToken, removeToken, setToken } from '../utils/storage'
import { mapFromUserDto } from '../utils/user'

export async function login(data: LoginDto): Promise<AuthUser> {
  try {
    const loginResponseDto = await loginRequest(data)
    setToken(loginResponseDto.token)
    const user = mapFromUserDto(loginResponseDto.user)
    return user
  } catch {
    throw new Error('Email o contraseña incorrectos')
  }
}

export async function logout() {
  removeToken()
}

export function getAuthUser(): AuthUser | null {
  const token = getToken()
  if (!token) return null

  try {
    const tokenPayload = jwtDecode<AccessTokenPayload>(token)
    return mapFromAccessTokenPayload(tokenPayload)
  } catch {
    return null
  }
}
