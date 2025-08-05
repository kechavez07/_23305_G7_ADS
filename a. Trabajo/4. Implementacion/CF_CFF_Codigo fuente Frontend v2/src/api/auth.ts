import type { LoginDto, LoginResponseDto } from '../types/auth'
import api from '../api/api'

export async function loginRequest(dto: LoginDto): Promise<LoginResponseDto> {
  const response = await api.post('/auth/login', dto)
  return response.data as LoginResponseDto
}
