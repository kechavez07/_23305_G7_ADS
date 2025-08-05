import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import * as api from '../../api/auth'
import * as storage from '../../utils/storage'
import * as utilsAuth from '../../utils/auth'
import * as utilsUser from '../../utils/user'
import { login, logout, getAuthUser } from '../auth'

import type {
  LoginDto,
  LoginResponseDto,
  AuthUser,
  AccessTokenPayload,
} from '../../types/auth'
import type { User } from '../../types/user'
import { jwtDecode } from 'jwt-decode'

vi.mock('jwt-decode', async () => {
  const actual = await vi.importActual<typeof jwtDecode>('jwt-decode')
  return {
    ...actual,
    jwtDecode: vi.fn(),
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authService', () => {
  describe('login', () => {
    it('debería hacer login correctamente y devolver el usuario autenticado', async () => {
      const loginDto: LoginDto = {
        email: 'test@mail.com',
        password: '123456',
      }

      const loginResponseDto: LoginResponseDto = {
        token: 'token.jwt.mock',
        user: {
          id: 'u1',
          email: 'test@mail.com',
          full_name: 'Test User',
          role: 'ADMIN',
        },
      }

      const mappedUser: User = {
        id: 'u1',
        email: 'test@mail.com',
        fullName: 'Test User',
        role: 'ADMIN',
      }

      vi.spyOn(api, 'loginRequest').mockResolvedValue(loginResponseDto)
      vi.spyOn(storage, 'setToken').mockImplementation(() => {})
      vi.spyOn(utilsUser, 'mapFromUserDto').mockReturnValue(mappedUser)

      const result = await login(loginDto)

      expect(api.loginRequest).toHaveBeenCalledWith(loginDto)
      expect(storage.setToken).toHaveBeenCalledWith(loginResponseDto.token)
      expect(utilsUser.mapFromUserDto).toHaveBeenCalledWith(
        loginResponseDto.user
      )
      expect(result).toEqual(mappedUser)
    })

    it('debería lanzar error si falla el login', async () => {
      const loginDto: LoginDto = {
        email: 'fail@mail.com',
        password: 'wrong',
      }

      vi.spyOn(api, 'loginRequest').mockRejectedValue(new Error('Login failed'))

      await expect(login(loginDto)).rejects.toThrow(
        'Email o contraseña incorrectos'
      )
    })
  })

  describe('logout', () => {
    it('debería llamar a removeToken para cerrar sesión', () => {
      const removeTokenMock = vi
        .spyOn(storage, 'removeToken')
        .mockImplementation(() => {})
      logout()
      expect(removeTokenMock).toHaveBeenCalled()
    })
  })

  describe('getAuthUser', () => {
    it('debería devolver el usuario autenticado si el token es válido', () => {
      const token = 'token.jwt.mock'
      const tokenPayload: AccessTokenPayload = {
        id: 'u1',
        email: 'test@mail.com',
        role: 'ADMIN',
        iat: 123456,
        exp: 123999,
      }

      const mappedAuthUser: AuthUser = {
        id: 'u1',
        email: 'test@mail.com',
        role: 'ADMIN',
      }

      vi.spyOn(storage, 'getToken').mockReturnValue(token)
      ;(jwtDecode as unknown as Mock).mockReturnValue(tokenPayload)
      vi.spyOn(utilsAuth, 'mapFromAccessTokenPayload').mockReturnValue(
        mappedAuthUser
      )

      const result = getAuthUser()

      expect(storage.getToken).toHaveBeenCalled()
      expect(jwtDecode).toHaveBeenCalledWith(token)
      expect(utilsAuth.mapFromAccessTokenPayload).toHaveBeenCalledWith(
        tokenPayload
      )
      expect(result).toEqual(mappedAuthUser)
    })

    it('debería devolver null si no hay token', () => {
      vi.spyOn(storage, 'getToken').mockReturnValue(null)
      const result = getAuthUser()
      expect(result).toBeNull()
    })

    it('debería devolver null si el token es inválido', () => {
      const token = 'token.jwt.mock'

      vi.spyOn(storage, 'getToken').mockReturnValue(token)
      ;(jwtDecode as unknown as Mock).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = getAuthUser()
      expect(result).toBeNull()
    })
  })
})
