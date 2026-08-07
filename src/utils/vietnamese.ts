const COMBINING_DIACRITICS_REGEX = /[̀-ͯ]/g

// Chuẩn hoá tiếng Việt để SO SÁNH (không dùng để hiển thị) — bỏ dấu thanh/dấu phụ qua NFD +
// loại combining marks, xử lý riêng "đ"/"Đ" (không tách được bằng NFD vì là ký tự độc lập, không
// phải base + dấu phụ), chuyển thường. Nhờ NFD tách dấu thành combining mark riêng khỏi nguyên âm
// gốc, hàm này coi 2 quy ước đặt dấu khác nhau cho nguyên âm đôi (vd "Hoà"/"Hòa") là cùng 1 chuỗi
// sau chuẩn hoá — dấu bị bỏ bất kể đặt ở ký tự nào trong cụm nguyên âm.
export function chuanHoaTiengViet(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS_REGEX, '')
    .replace(/đ/g, 'd')
    .trim()
}
