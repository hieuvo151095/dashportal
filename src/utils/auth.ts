const AUTH_STORAGE_KEY = 'portal-thu-hoc-phi:auth'

// Đăng nhập là giả lập (không lưu email/tên thật, xem CLAUDE.md) — dùng chung 1 tên hiển thị mẫu
// cho mọi nơi cần "tên người dùng" (Avatar ở Header, lời chào của AI Assistant...).
export const TEN_NGUOI_DUNG = 'Lãnh đạo Sở GD&ĐT'

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === '1'
}

export function login(): void {
  localStorage.setItem(AUTH_STORAGE_KEY, '1')
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
