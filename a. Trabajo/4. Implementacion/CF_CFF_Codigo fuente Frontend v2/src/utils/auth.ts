import type { FormValues } from '../components/forms/LoginForm'
import type { AccessTokenPayload, AuthUser, Login } from '../types/auth'

export function mapFromAccessTokenPayload(
  tokenPayload: AccessTokenPayload
): AuthUser {
  return {
    email: tokenPayload.email,
    id: tokenPayload.id,
    role: tokenPayload.role,
  }
}

export function mapToLogin(form: FormValues): Login {
  return {
    email: form.email,
    password: form.password,
  }
}
