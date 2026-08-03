import type { Truong } from '../mock-data'

// Hạn chót đồng bộ dữ liệu của 1 kỳ = ngày 7 tháng kế tiếp (vd kỳ 07/2026 → hạn 07/08/2026).
export function hanChotDongBoCuaKy(ky: string): Date {
  const [thangStr, namStr] = ky.split('/')
  // Date(năm, tháng, ngày) coi tham số tháng là 0-based — truyền thẳng số tháng 1-based của kỳ
  // vào đúng bằng chỉ số 0-based của tháng KẾ TIẾP, khỏi phải +1 rồi xử lý tràn năm thủ công.
  return new Date(Number(namStr), Number(thangStr), 7)
}

const MS_MOT_NGAY = 24 * 60 * 60 * 1000

// Số ngày trễ hạn đồng bộ của 1 trường ở 1 kỳ — 0 nếu đồng bộ đúng hạn hoặc sớm hơn (không âm).
export function soNgayTreCuaTruong(truong: Truong, ky: string): number {
  const ngayDongBo = truong.ngayDongBoTheoKy[ky]
  if (!ngayDongBo) return 0
  const soNgay = (new Date(ngayDongBo).getTime() - hanChotDongBoCuaKy(ky).getTime()) / MS_MOT_NGAY
  return Math.max(0, Math.round(soNgay))
}

// "Ngày cập nhật" hiển thị ở các bảng không gắn với đúng 1 Kỳ báo cáo cụ thể (Danh mục Phí 2.1
// không có filter Kỳ; Công nợ 4.1 dùng khoảng Kỳ Tu-Đến chứ không phải 1 kỳ) — lấy mốc đồng bộ
// gần nhất trong 6 kỳ làm chỉ số "cập nhật gần đây nhất" chung, giữ đúng ý nghĩa cột cũ.
export function ngayDongBoGanNhat(truong: Truong): string {
  return Object.values(truong.ngayDongBoTheoKy).reduce((moiNhat, ngay) =>
    new Date(ngay) > new Date(moiNhat) ? ngay : moiNhat,
  )
}
