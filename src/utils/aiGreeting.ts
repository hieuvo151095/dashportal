const LAST_GREETING_DATE_KEY = 'portal-thu-hoc-phi:ai-greeting-last-date'

// Ngày hiện tại theo giờ Việt Nam (GMT+7, 00:00-23:59), không phụ thuộc múi giờ máy người dùng —
// locale "en-CA" cho sẵn định dạng "YYYY-MM-DD", chỉ cần đổi timeZone.
function ngayHomNayGmt7(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
}

// true nếu đây là lần đầu mở Portal trong ngày (theo GMT+7) — chưa từng đánh dấu đã hiện lời chào
// hôm nay.
export function shouldShowDailyGreeting(): boolean {
  return localStorage.getItem(LAST_GREETING_DATE_KEY) !== ngayHomNayGmt7()
}

export function markDailyGreetingShown(): void {
  localStorage.setItem(LAST_GREETING_DATE_KEY, ngayHomNayGmt7())
}
