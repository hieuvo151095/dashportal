import type { CapHoc, DanhMucKhoanThu, DonViTinh, HeThongDoiTac, HinhThucThanhToan, NguonThu, NhomPhi } from './types'

// Ngày mốc cố định dùng làm "hôm nay" khi sinh dữ liệu, để số liệu (quá hạn, trạng thái...)
// không đổi giữa các lần chạy vào ngày khác nhau.
export const TODAY = new Date('2026-07-27T00:00:00')

export const NIEN_KHOA = '2025-2026'

export const NIEN_KHOA_LIST = ['2023-2024', '2024-2025', NIEN_KHOA]

// Tên Xã/Phường thật của TP.HCM theo mô hình chính quyền 2 cấp (Nghị quyết 1685/NQ-UBTVQH15,
// hiệu lực 01/7/2025) — nguồn: tphcm.chinhphu.vn. Chỉ dùng tên Phường/Xã, không dùng tên Quận/Huyện cũ.
export const PHUONG_XA_SEED: { ten: string; loai: 'Phường' | 'Xã' }[] = [
  { ten: 'Sài Gòn', loai: 'Phường' },
  { ten: 'Tân Định', loai: 'Phường' },
  { ten: 'Bến Thành', loai: 'Phường' },
  { ten: 'Bàn Cờ', loai: 'Phường' },
  { ten: 'Nhiêu Lộc', loai: 'Phường' },
  { ten: 'Khánh Hội', loai: 'Phường' },
  { ten: 'Chợ Lớn', loai: 'Phường' },
  { ten: 'An Đông', loai: 'Phường' },
  { ten: 'Bình Tây', loai: 'Phường' },
  { ten: 'Xuân Hòa', loai: 'Phường' },
  { ten: 'Củ Chi', loai: 'Xã' },
  { ten: 'Hóc Môn', loai: 'Xã' },
  { ten: 'Bình Hưng', loai: 'Xã' },
  { ten: 'Cần Giờ', loai: 'Xã' },
]

export const CAP_HOC_LIST: CapHoc[] = ['Mầm non', 'Tiểu học', 'THCS', 'THPT']

export const HE_THONG_DOI_TAC_LIST: HeThongDoiTac[] = [
  'SSC',
  'Misa',
  'Viettel',
  'VNPT',
  'eNetViet',
  'YoYoSchool',
  'ECO School',
]

export const NGUON_THU_LIST: NguonThu[] = ['Học phí', 'Dịch vụ', 'Bán trú']

export const NHOM_PHI_LIST: NhomPhi[] = ['Thu theo tháng', 'Thu theo năm', 'Thu không định kỳ']

export const DANH_MUC_KHOAN_THU_LIST: DanhMucKhoanThu[] = [
  'Học phí',
  'Bán trú',
  'Đưa đón',
  'Bảo hiểm y tế',
  'Đồng phục',
  'Ngoại khoá',
  'Khoản thu khác',
]

export const HINH_THUC_THANH_TOAN_LIST: HinhThucThanhToan[] = [
  'Tiền mặt',
  'Chuyển khoản',
  'Ví điện tử',
  'QR Code',
]

// Danh mục khoản phí mẫu tham khảo từ spec Mục 4.2, gắn kèm nhóm/nguồn/danh mục/đơn vị tính hợp lý.
export const KHOAN_PHI_TEMPLATES: {
  ten: string
  donViTinh: DonViTinh
  nguonThu: NguonThu
  nhomPhi: NhomPhi
  danhMuc: DanhMucKhoanThu
  soTienMin: number
  soTienMax: number
  bietLap?: CapHoc[]
}[] = [
  { ten: 'Học phí', donViTinh: 'tháng', nguonThu: 'Học phí', nhomPhi: 'Thu theo tháng', danhMuc: 'Học phí', soTienMin: 300000, soTienMax: 2500000 },
  { ten: 'Tiền ăn bán trú', donViTinh: 'tháng', nguonThu: 'Bán trú', nhomPhi: 'Thu theo tháng', danhMuc: 'Bán trú', soTienMin: 500000, soTienMax: 900000 },
  { ten: 'Ăn sáng', donViTinh: 'tháng', nguonThu: 'Bán trú', nhomPhi: 'Thu theo tháng', danhMuc: 'Bán trú', soTienMin: 150000, soTienMax: 300000 },
  { ten: 'Nước ép', donViTinh: 'tháng', nguonThu: 'Bán trú', nhomPhi: 'Thu theo tháng', danhMuc: 'Bán trú', soTienMin: 50000, soTienMax: 120000 },
  { ten: 'Xe buýt', donViTinh: 'chuyến', nguonThu: 'Dịch vụ', nhomPhi: 'Thu theo tháng', danhMuc: 'Đưa đón', soTienMin: 400000, soTienMax: 700000 },
  { ten: 'Đồng phục', donViTinh: 'lần', nguonThu: 'Dịch vụ', nhomPhi: 'Thu không định kỳ', danhMuc: 'Đồng phục', soTienMin: 250000, soTienMax: 600000 },
  { ten: 'Phí khám sức khoẻ định kỳ', donViTinh: 'lần', nguonThu: 'Dịch vụ', nhomPhi: 'Thu không định kỳ', danhMuc: 'Khoản thu khác', soTienMin: 80000, soTienMax: 200000 },
  { ten: 'Bảo hiểm y tế', donViTinh: 'năm', nguonThu: 'Dịch vụ', nhomPhi: 'Thu theo năm', danhMuc: 'Bảo hiểm y tế', soTienMin: 600000, soTienMax: 900000 },
  { ten: 'Cơ sở vật chất', donViTinh: 'năm', nguonThu: 'Dịch vụ', nhomPhi: 'Thu theo năm', danhMuc: 'Khoản thu khác', soTienMin: 300000, soTienMax: 800000 },
  { ten: 'Tiếng Anh', donViTinh: 'tháng', nguonThu: 'Dịch vụ', nhomPhi: 'Thu theo tháng', danhMuc: 'Ngoại khoá', soTienMin: 400000, soTienMax: 1200000 },
  { ten: 'Ngoại khoá', donViTinh: 'tháng', nguonThu: 'Dịch vụ', nhomPhi: 'Thu theo tháng', danhMuc: 'Ngoại khoá', soTienMin: 200000, soTienMax: 600000 },
  { ten: 'Học STEAM', donViTinh: 'tháng', nguonThu: 'Dịch vụ', nhomPhi: 'Thu theo tháng', danhMuc: 'Ngoại khoá', soTienMin: 300000, soTienMax: 700000 },
  { ten: 'Thể dục nhịp điệu', donViTinh: 'tháng', nguonThu: 'Dịch vụ', nhomPhi: 'Thu theo tháng', danhMuc: 'Ngoại khoá', soTienMin: 150000, soTienMax: 400000 },
  { ten: 'Hoạt động bơi lội', donViTinh: 'giờ', nguonThu: 'Dịch vụ', nhomPhi: 'Thu không định kỳ', danhMuc: 'Ngoại khoá', soTienMin: 60000, soTienMax: 150000 },
  { ten: 'Phí tăng ca trông trẻ', donViTinh: 'giờ', nguonThu: 'Dịch vụ', nhomPhi: 'Thu không định kỳ', danhMuc: 'Khoản thu khác', soTienMin: 30000, soTienMax: 80000, bietLap: ['Mầm non'] },
  { ten: 'Phí giữ trẻ ngày hè', donViTinh: 'ngày', nguonThu: 'Bán trú', nhomPhi: 'Thu không định kỳ', danhMuc: 'Khoản thu khác', soTienMin: 100000, soTienMax: 200000, bietLap: ['Mầm non', 'Tiểu học'] },
]

export const THAM_CHIEU_PHAP_LY_LIST = [
  'NQ 04/2023/NQ-HĐND',
  'TT 55/2011/TTLT-BGDĐT-BTC',
  'NĐ 81/2021/NĐ-CP',
  'QĐ 3488/QĐ-UBND',
]

export const HO_LIST = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô', 'Dương', 'Lý']

export const TEN_DEM_NAM_LIST = ['Văn', 'Hữu', 'Minh', 'Quốc', 'Đức', 'Thành', 'Anh', 'Xuân']
export const TEN_DEM_NU_LIST = ['Thị', 'Ngọc', 'Thu', 'Kim', 'Bảo', 'Anh', 'Minh', 'Diễm']

export const TEN_NAM_LIST = ['An', 'Bình', 'Cường', 'Dũng', 'Đạt', 'Duy', 'Hào', 'Hiếu', 'Huy', 'Khang', 'Khôi', 'Long', 'Minh', 'Nam', 'Phát', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Thắng', 'Thịnh', 'Tuấn', 'Vinh']
export const TEN_NU_LIST = ['An', 'Anh', 'Chi', 'Diệp', 'Hà', 'Hân', 'Hoa', 'Huyền', 'Lan', 'Linh', 'Mai', 'My', 'Ngân', 'Nhi', 'Như', 'Phương', 'Quỳnh', 'Thảo', 'Trâm', 'Trang', 'Vy', 'Yến']

export const NHAN_VAT_LICH_SU_LIST = [
  'Nguyễn Du', 'Trần Phú', 'Lê Lợi', 'Trần Hưng Đạo', 'Lý Tự Trọng', 'Hai Bà Trưng',
  'Nguyễn Trãi', 'Lê Quý Đôn', 'Nguyễn Bỉnh Khiêm', 'Chu Văn An', 'Nguyễn Thị Minh Khai',
  'Võ Thị Sáu', 'Trưng Vương', 'Ngô Quyền', 'Phan Chu Trinh', 'Nguyễn Huệ', 'Đinh Tiên Hoàng',
]

export const TEN_HOA_DIA_DANH_LIST = [
  'Hoa Mai', 'Hoa Sen', 'Hoa Hồng', 'Sơn Ca', 'Họa Mi', 'Ánh Dương', 'Bình Minh', 'Măng Non', 'Tuổi Thơ',
]

export const NHAN_VIEN_KE_TOAN_LIST = [
  'Nguyễn Thị Hồng', 'Trần Văn Bình', 'Lê Thị Lan', 'Phạm Văn Hùng', 'Hoàng Thị Nga',
  'Huỳnh Văn Phúc', 'Vũ Thị Thu', 'Đặng Văn Sơn', 'Bùi Thị Hạnh', 'Ngô Văn Tùng',
]
