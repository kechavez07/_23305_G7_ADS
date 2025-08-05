import { ACCESS_TOKEN_KEY } from '../constants/storage'

export function setToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}
