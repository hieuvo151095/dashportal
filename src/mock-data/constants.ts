import type { CapHoc, DanhMucKhoanThu, DonViTinh, HeThongDoiTac, HinhThucThanhToan, NguonThu, NhomPhi } from './types'

// Ngày mốc cố định dùng làm "hôm nay" khi sinh dữ liệu, để số liệu (quá hạn, trạng thái...)
// không đổi giữa các lần chạy vào ngày khác nhau.
export const TODAY = new Date('2026-07-27T00:00:00')

export const NIEN_KHOA = '2025-2026'

export const NIEN_KHOA_LIST = ['2023-2024', '2024-2025', NIEN_KHOA]

// Danh sách 168 Phường/Xã/Đặc khu TP.HCM theo mô hình chính quyền 2 cấp (sáp nhập
// 01/7/2025) — nguồn: docs/DS Phường Xã HCM.xlsx (113 Phường + 54 Xã + 1 Đặc khu Côn Đảo).
export const PHUONG_XA_SEED: { ten: string; loai: 'Phường' | 'Xã' | 'Đặc khu' }[] = [
  { ten: 'Sài Gòn', loai: 'Phường' },
  { ten: 'Tân Định', loai: 'Phường' },
  { ten: 'Bến Thành', loai: 'Phường' },
  { ten: 'Cầu Ông Lãnh', loai: 'Phường' },
  { ten: 'Bàn Cờ', loai: 'Phường' },
  { ten: 'Xuân Hòa', loai: 'Phường' },
  { ten: 'Nhiêu Lộc', loai: 'Phường' },
  { ten: 'Xóm Chiếu', loai: 'Phường' },
  { ten: 'Khánh Hội', loai: 'Phường' },
  { ten: 'Vĩnh Hội', loai: 'Phường' },
  { ten: 'Chợ Quán', loai: 'Phường' },
  { ten: 'An Đông', loai: 'Phường' },
  { ten: 'Chợ Lớn', loai: 'Phường' },
  { ten: 'Bình Tây', loai: 'Phường' },
  { ten: 'Bình Tiên', loai: 'Phường' },
  { ten: 'Bình Phú', loai: 'Phường' },
  { ten: 'Phú Lâm', loai: 'Phường' },
  { ten: 'Tân Thuận', loai: 'Phường' },
  { ten: 'Phú Thuận', loai: 'Phường' },
  { ten: 'Tân Mỹ', loai: 'Phường' },
  { ten: 'Tân Hưng', loai: 'Phường' },
  { ten: 'Chánh Hưng', loai: 'Phường' },
  { ten: 'Phú Định', loai: 'Phường' },
  { ten: 'Bình Đông', loai: 'Phường' },
  { ten: 'Diên Hồng', loai: 'Phường' },
  { ten: 'Vườn Lài', loai: 'Phường' },
  { ten: 'Hòa Hưng', loai: 'Phường' },
  { ten: 'Minh Phụng', loai: 'Phường' },
  { ten: 'Bình Thới', loai: 'Phường' },
  { ten: 'Hòa Bình', loai: 'Phường' },
  { ten: 'Phú Thọ', loai: 'Phường' },
  { ten: 'Đông Hưng Thuận', loai: 'Phường' },
  { ten: 'Trung Mỹ Tây', loai: 'Phường' },
  { ten: 'Tân Thới Hiệp', loai: 'Phường' },
  { ten: 'Thới An', loai: 'Phường' },
  { ten: 'An Phú Đông', loai: 'Phường' },
  { ten: 'An Lạc', loai: 'Phường' },
  { ten: 'Bình Tân', loai: 'Phường' },
  { ten: 'Tân Tạo', loai: 'Phường' },
  { ten: 'Bình Trị Đông', loai: 'Phường' },
  { ten: 'Bình Hưng Hòa', loai: 'Phường' },
  { ten: 'Gia Định', loai: 'Phường' },
  { ten: 'Bình Thạnh', loai: 'Phường' },
  { ten: 'Bình Lợi Trung', loai: 'Phường' },
  { ten: 'Thạnh Mỹ Tây', loai: 'Phường' },
  { ten: 'Bình Quới', loai: 'Phường' },
  { ten: 'Hạnh Thông', loai: 'Phường' },
  { ten: 'An Nhơn', loai: 'Phường' },
  { ten: 'Gò Vấp', loai: 'Phường' },
  { ten: 'An Hội Đông', loai: 'Phường' },
  { ten: 'Thông Tây Hội', loai: 'Phường' },
  { ten: 'An Hội Tây', loai: 'Phường' },
  { ten: 'Đức Nhuận', loai: 'Phường' },
  { ten: 'Cầu Kiệu', loai: 'Phường' },
  { ten: 'Phú Nhuận', loai: 'Phường' },
  { ten: 'Tân Sơn Hòa', loai: 'Phường' },
  { ten: 'Tân Sơn Nhất', loai: 'Phường' },
  { ten: 'Tân Hòa', loai: 'Phường' },
  { ten: 'Bảy Hiền', loai: 'Phường' },
  { ten: 'Tân Bình', loai: 'Phường' },
  { ten: 'Tân Sơn', loai: 'Phường' },
  { ten: 'Tây Thạnh', loai: 'Phường' },
  { ten: 'Tân Sơn Nhì', loai: 'Phường' },
  { ten: 'Phú Thọ Hòa', loai: 'Phường' },
  { ten: 'Tân Phú', loai: 'Phường' },
  { ten: 'Phú Thạnh', loai: 'Phường' },
  { ten: 'Hiệp Bình', loai: 'Phường' },
  { ten: 'Thủ Đức', loai: 'Phường' },
  { ten: 'Tam Bình', loai: 'Phường' },
  { ten: 'Linh Xuân', loai: 'Phường' },
  { ten: 'Tăng Nhơn Phú', loai: 'Phường' },
  { ten: 'Long Bình', loai: 'Phường' },
  { ten: 'Long Phước', loai: 'Phường' },
  { ten: 'Long Trường', loai: 'Phường' },
  { ten: 'Cát Lái', loai: 'Phường' },
  { ten: 'Bình Trưng', loai: 'Phường' },
  { ten: 'Phước Long', loai: 'Phường' },
  { ten: 'An Khánh', loai: 'Phường' },
  { ten: 'Đông Hòa', loai: 'Phường' },
  { ten: 'Dĩ An', loai: 'Phường' },
  { ten: 'Tân Đông Hiệp', loai: 'Phường' },
  { ten: 'An Phú', loai: 'Phường' },
  { ten: 'Bình Hòa', loai: 'Phường' },
  { ten: 'Lái Thiêu', loai: 'Phường' },
  { ten: 'Thuận An', loai: 'Phường' },
  { ten: 'Thuận Giao', loai: 'Phường' },
  { ten: 'Thủ Dầu Một', loai: 'Phường' },
  { ten: 'Phú Lợi', loai: 'Phường' },
  { ten: 'Chánh Hiệp', loai: 'Phường' },
  { ten: 'Bình Dương', loai: 'Phường' },
  { ten: 'Hòa Lợi', loai: 'Phường' },
  { ten: 'Phú An', loai: 'Phường' },
  { ten: 'Tây Nam', loai: 'Phường' },
  { ten: 'Long Nguyên', loai: 'Phường' },
  { ten: 'Bến Cát', loai: 'Phường' },
  { ten: 'Chánh Phú Hòa', loai: 'Phường' },
  { ten: 'Vĩnh Tân', loai: 'Phường' },
  { ten: 'Bình Cơ', loai: 'Phường' },
  { ten: 'Tân Uyên', loai: 'Phường' },
  { ten: 'Tân Hiệp', loai: 'Phường' },
  { ten: 'Tân Khánh', loai: 'Phường' },
  { ten: 'Vũng Tàu', loai: 'Phường' },
  { ten: 'Tam Thắng', loai: 'Phường' },
  { ten: 'Rạch Dừa', loai: 'Phường' },
  { ten: 'Phước Thắng', loai: 'Phường' },
  { ten: 'Long Hương', loai: 'Phường' },
  { ten: 'Bà Rịa', loai: 'Phường' },
  { ten: 'Tam Long', loai: 'Phường' },
  { ten: 'Tân Hải', loai: 'Phường' },
  { ten: 'Tân Phước', loai: 'Phường' },
  { ten: 'Phú Mỹ', loai: 'Phường' },
  { ten: 'Tân Thành', loai: 'Phường' },
  { ten: 'Vĩnh Lộc', loai: 'Xã' },
  { ten: 'Tân Vĩnh Lộc', loai: 'Xã' },
  { ten: 'Bình Lợi', loai: 'Xã' },
  { ten: 'Tân Nhựt', loai: 'Xã' },
  { ten: 'Bình Chánh', loai: 'Xã' },
  { ten: 'Hưng Long', loai: 'Xã' },
  { ten: 'Bình Hưng', loai: 'Xã' },
  { ten: 'Bình Khánh', loai: 'Xã' },
  { ten: 'An Thới Đông', loai: 'Xã' },
  { ten: 'Cần Giờ', loai: 'Xã' },
  { ten: 'Củ Chi', loai: 'Xã' },
  { ten: 'Tân An Hội', loai: 'Xã' },
  { ten: 'Thái Mỹ', loai: 'Xã' },
  { ten: 'An Nhơn Tây', loai: 'Xã' },
  { ten: 'Nhuận Đức', loai: 'Xã' },
  { ten: 'Phú Hòa Đông', loai: 'Xã' },
  { ten: 'Bình Mỹ', loai: 'Xã' },
  { ten: 'Đông Thạnh', loai: 'Xã' },
  { ten: 'Hóc Môn', loai: 'Xã' },
  { ten: 'Xuân Thới Sơn', loai: 'Xã' },
  { ten: 'Bà Điểm', loai: 'Xã' },
  { ten: 'Nhà Bè', loai: 'Xã' },
  { ten: 'Hiệp Phước', loai: 'Xã' },
  { ten: 'Thường Tân', loai: 'Xã' },
  { ten: 'Bắc Tân Uyên', loai: 'Xã' },
  { ten: 'Phú Giáo', loai: 'Xã' },
  { ten: 'Phước Hòa', loai: 'Xã' },
  { ten: 'Phước Thành', loai: 'Xã' },
  { ten: 'An Long', loai: 'Xã' },
  { ten: 'Trừ Văn Thố', loai: 'Xã' },
  { ten: 'Bàu Bàng', loai: 'Xã' },
  { ten: 'Long Hòa', loai: 'Xã' },
  { ten: 'Thanh An', loai: 'Xã' },
  { ten: 'Dầu Tiếng', loai: 'Xã' },
  { ten: 'Minh Thạnh', loai: 'Xã' },
  { ten: 'Châu Pha', loai: 'Xã' },
  { ten: 'Long Hải', loai: 'Xã' },
  { ten: 'Long Điền', loai: 'Xã' },
  { ten: 'Phước Hải', loai: 'Xã' },
  { ten: 'Đất Đỏ', loai: 'Xã' },
  { ten: 'Nghĩa Thành', loai: 'Xã' },
  { ten: 'Ngãi Giao', loai: 'Xã' },
  { ten: 'Kim Long', loai: 'Xã' },
  { ten: 'Châu Đức', loai: 'Xã' },
  { ten: 'Bình Giã', loai: 'Xã' },
  { ten: 'Xuân Sơn', loai: 'Xã' },
  { ten: 'Hồ Tràm', loai: 'Xã' },
  { ten: 'Xuyên Mộc', loai: 'Xã' },
  { ten: 'Hòa Hội', loai: 'Xã' },
  { ten: 'Bàu Lâm', loai: 'Xã' },
  { ten: 'Côn Đảo', loai: 'Đặc khu' },
  { ten: 'Thới Hòa', loai: 'Phường' },
  { ten: 'Long Sơn', loai: 'Xã' },
  { ten: 'Hòa Hiệp', loai: 'Xã' },
  { ten: 'Bình Châu', loai: 'Xã' },
  { ten: 'Thạnh An', loai: 'Xã' },
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
