const AUTH_STORAGE_KEY = 'portal-thu-hoc-phi:auth'

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === '1'
}

export function login(): void {
  localStorage.setItem(AUTH_STORAGE_KEY, '1')
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
