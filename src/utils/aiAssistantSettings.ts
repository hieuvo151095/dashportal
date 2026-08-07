const API_KEY_STORAGE_KEY = 'portal-thu-hoc-phi:ai-api-key'

export function getAiApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) ?? ''
}

export function setAiApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey)
}

export function clearAiApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY)
}

export function hasAiApiKey(): boolean {
  return getAiApiKey().trim().length > 0
}
