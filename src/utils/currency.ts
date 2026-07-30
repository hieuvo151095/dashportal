const numberFormatter = new Intl.NumberFormat('vi-VN')

// Dùng cho ô số tiền trong bảng dữ liệu (case c) — không lặp lại đơn vị ở từng dòng, trang
// hiển thị 1 dòng "Đơn vị: Đồng" duy nhất ở tiêu đề/module thay cho việc lặp "đ" mỗi ô.
export function formatCurrency(amount: number): string {
  return numberFormatter.format(amount)
}

// Dùng cho KPI card / donut / bar / line chart (case b) — mỗi giá trị tiền hiển thị (legend,
// tooltip, label) tự mang đơn vị riêng, không dùng dòng "Đơn vị: Đồng" cho khu vực này.
// KHÔNG dùng cho nhãn trục rút gọn kiểu "550tr" — giữ nguyên dạng viết tắt đó.
export function formatCurrencyWithUnit(amount: number): string {
  return `${numberFormatter.format(amount)}đ`
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

const billionFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

// Dạng viết tắt "X tỷ" cho nhãn/chart chật chỗ (giống cách trục biểu đồ rút gọn "Xtr") —
// không thêm hậu tố "đ" vì "tỷ" đã ngầm định là tỷ đồng theo ngữ cảnh app.
export function formatBillion(amount: number): string {
  return `${billionFormatter.format(amount / 1_000_000_000)} tỷ`
}

const millionFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })

// Như formatBillion nhưng tự chuyển sang đơn vị "triệu" khi giá trị dưới 1 tỷ — formatBillion
// làm tròn 1 chữ số thập phân nên các giá trị dưới ~50 triệu bị mất thông tin, hiện thành "0 tỷ"
// (bug thật gặp ở Top 10 Xã/Phường, nơi "Còn thu" của nhiều xã chỉ ở mức trăm triệu).
export function formatBillionOrMillion(amount: number): string {
  if (Math.abs(amount) < 1_000_000_000) {
    return `${millionFormatter.format(amount / 1_000_000)} triệu`
  }
  return `${billionFormatter.format(amount / 1_000_000_000)} tỷ`
}
