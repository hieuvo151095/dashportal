import type { CapHoc, DanhMucKhoanThu, DonViTinh, HeThongDoiTac, HinhThucThanhToan, NguonThu, NhomPhi } from './types'

// Ngày mốc cố định dùng làm "hôm nay" khi sinh dữ liệu, để số liệu (quá hạn, trạng thái...)
// không đổi giữa các lần chạy vào ngày khác nhau.
export const TODAY = new Date('2026-07-27T00:00:00')

export const NIEN_KHOA = '2025-2026'

export const NIEN_KHOA_LIST = ['2023-2024', '2024-2025', NIEN_KHOA]

// Danh sách 168 Phường/Xã/Đặc khu TP.HCM theo mô hình chính quyền 2 cấp (sáp nhập
// 01/7/2025) — nguồn: docs/DS Phường Xã HCM.xlsx (113 Phường + 54 Xã + 1 Đặc khu Côn Đảo).
export const PHUONG_XA_SEED: { ten: string; loai: 'Phường' | 'Xã' | 'Đặc khu'; diaBanCu: string }[] = [
  { ten: 'Sài Gòn', loai: 'Phường', diaBanCu: 'Quận 1' },
  { ten: 'Tân Định', loai: 'Phường', diaBanCu: 'Quận 1' },
  { ten: 'Bến Thành', loai: 'Phường', diaBanCu: 'Quận 1' },
  { ten: 'Cầu Ông Lãnh', loai: 'Phường', diaBanCu: 'Quận 1' },
  { ten: 'Bàn Cờ', loai: 'Phường', diaBanCu: 'Quận 3' },
  { ten: 'Xuân Hòa', loai: 'Phường', diaBanCu: 'Quận 3' },
  { ten: 'Nhiêu Lộc', loai: 'Phường', diaBanCu: 'Quận 3' },
  { ten: 'Xóm Chiếu', loai: 'Phường', diaBanCu: 'Quận 4' },
  { ten: 'Khánh Hội', loai: 'Phường', diaBanCu: 'Quận 4' },
  { ten: 'Vĩnh Hội', loai: 'Phường', diaBanCu: 'Quận 4' },
  { ten: 'Chợ Quán', loai: 'Phường', diaBanCu: 'Quận 5' },
  { ten: 'An Đông', loai: 'Phường', diaBanCu: 'Quận 5' },
  { ten: 'Chợ Lớn', loai: 'Phường', diaBanCu: 'Quận 5' },
  { ten: 'Bình Tây', loai: 'Phường', diaBanCu: 'Quận 6' },
  { ten: 'Bình Tiên', loai: 'Phường', diaBanCu: 'Quận 6' },
  { ten: 'Bình Phú', loai: 'Phường', diaBanCu: 'Quận 6 - Quận 8' },
  { ten: 'Phú Lâm', loai: 'Phường', diaBanCu: 'Quận 6' },
  { ten: 'Tân Thuận', loai: 'Phường', diaBanCu: 'Quận 7' },
  { ten: 'Phú Thuận', loai: 'Phường', diaBanCu: 'Quận 7' },
  { ten: 'Tân Mỹ', loai: 'Phường', diaBanCu: 'Quận 7' },
  { ten: 'Tân Hưng', loai: 'Phường', diaBanCu: 'Quận 7' },
  { ten: 'Chánh Hưng', loai: 'Phường', diaBanCu: 'Quận 8' },
  { ten: 'Phú Định', loai: 'Phường', diaBanCu: 'Quận 8' },
  { ten: 'Bình Đông', loai: 'Phường', diaBanCu: 'Quận 8' },
  { ten: 'Diên Hồng', loai: 'Phường', diaBanCu: 'Quận 10' },
  { ten: 'Vườn Lài', loai: 'Phường', diaBanCu: 'Quận 10' },
  { ten: 'Hòa Hưng', loai: 'Phường', diaBanCu: 'Quận 10' },
  { ten: 'Minh Phụng', loai: 'Phường', diaBanCu: 'Quận 11' },
  { ten: 'Bình Thới', loai: 'Phường', diaBanCu: 'Quận 11' },
  { ten: 'Hòa Bình', loai: 'Phường', diaBanCu: 'Quận 11' },
  { ten: 'Phú Thọ', loai: 'Phường', diaBanCu: 'Quận 11' },
  { ten: 'Đông Hưng Thuận', loai: 'Phường', diaBanCu: 'Quận 12' },
  { ten: 'Trung Mỹ Tây', loai: 'Phường', diaBanCu: 'Quận 12' },
  { ten: 'Tân Thới Hiệp', loai: 'Phường', diaBanCu: 'Quận 12' },
  { ten: 'Thới An', loai: 'Phường', diaBanCu: 'Quận 12' },
  { ten: 'An Phú Đông', loai: 'Phường', diaBanCu: 'Quận 12' },
  { ten: 'An Lạc', loai: 'Phường', diaBanCu: 'Bình Tân' },
  { ten: 'Bình Tân', loai: 'Phường', diaBanCu: 'Bình Tân' },
  { ten: 'Tân Tạo', loai: 'Phường', diaBanCu: 'Bình Tân' },
  { ten: 'Bình Trị Đông', loai: 'Phường', diaBanCu: 'Bình Tân' },
  { ten: 'Bình Hưng Hòa', loai: 'Phường', diaBanCu: 'Bình Tân' },
  { ten: 'Gia Định', loai: 'Phường', diaBanCu: 'Bình Thạnh' },
  { ten: 'Bình Thạnh', loai: 'Phường', diaBanCu: 'Bình Thạnh' },
  { ten: 'Bình Lợi Trung', loai: 'Phường', diaBanCu: 'Bình Thạnh' },
  { ten: 'Thạnh Mỹ Tây', loai: 'Phường', diaBanCu: 'Bình Thạnh' },
  { ten: 'Bình Quới', loai: 'Phường', diaBanCu: 'Bình Thạnh' },
  { ten: 'Hạnh Thông', loai: 'Phường', diaBanCu: 'Gò Vấp' },
  { ten: 'An Nhơn', loai: 'Phường', diaBanCu: 'Gò Vấp' },
  { ten: 'Gò Vấp', loai: 'Phường', diaBanCu: 'Gò Vấp' },
  { ten: 'An Hội Đông', loai: 'Phường', diaBanCu: 'Gò Vấp' },
  { ten: 'Thông Tây Hội', loai: 'Phường', diaBanCu: 'Gò Vấp' },
  { ten: 'An Hội Tây', loai: 'Phường', diaBanCu: 'Gò Vấp' },
  { ten: 'Đức Nhuận', loai: 'Phường', diaBanCu: 'Phú Nhuận' },
  { ten: 'Cầu Kiệu', loai: 'Phường', diaBanCu: 'Phú Nhuận' },
  { ten: 'Phú Nhuận', loai: 'Phường', diaBanCu: 'Phú Nhuận' },
  { ten: 'Tân Sơn Hòa', loai: 'Phường', diaBanCu: 'Tân Bình' },
  { ten: 'Tân Sơn Nhất', loai: 'Phường', diaBanCu: 'Tân Bình' },
  { ten: 'Tân Hòa', loai: 'Phường', diaBanCu: 'Tân Bình' },
  { ten: 'Bảy Hiền', loai: 'Phường', diaBanCu: 'Tân Bình' },
  { ten: 'Tân Bình', loai: 'Phường', diaBanCu: 'Tân Bình' },
  { ten: 'Tân Sơn', loai: 'Phường', diaBanCu: 'Tân Bình' },
  { ten: 'Tây Thạnh', loai: 'Phường', diaBanCu: 'Tân Phú' },
  { ten: 'Tân Sơn Nhì', loai: 'Phường', diaBanCu: 'Tân Phú' },
  { ten: 'Phú Thọ Hòa', loai: 'Phường', diaBanCu: 'Tân Phú' },
  { ten: 'Tân Phú', loai: 'Phường', diaBanCu: 'Tân Phú' },
  { ten: 'Phú Thạnh', loai: 'Phường', diaBanCu: 'Tân Phú' },
  { ten: 'Hiệp Bình', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Thủ Đức', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Tam Bình', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Linh Xuân', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Tăng Nhơn Phú', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Long Bình', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Long Phước', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Long Trường', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Cát Lái', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Bình Trưng', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Phước Long', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'An Khánh', loai: 'Phường', diaBanCu: 'TP. Thủ Đức' },
  { ten: 'Đông Hòa', loai: 'Phường', diaBanCu: 'Dĩ An' },
  { ten: 'Dĩ An', loai: 'Phường', diaBanCu: 'Dĩ An' },
  { ten: 'Tân Đông Hiệp', loai: 'Phường', diaBanCu: 'Dĩ An' },
  { ten: 'An Phú', loai: 'Phường', diaBanCu: 'Thuận An' },
  { ten: 'Bình Hòa', loai: 'Phường', diaBanCu: 'Thuận An' },
  { ten: 'Lái Thiêu', loai: 'Phường', diaBanCu: 'Thuận An' },
  { ten: 'Thuận An', loai: 'Phường', diaBanCu: 'Thuận An' },
  { ten: 'Thuận Giao', loai: 'Phường', diaBanCu: 'Thuận An' },
  { ten: 'Thủ Dầu Một', loai: 'Phường', diaBanCu: 'Thủ Dầu Một' },
  { ten: 'Phú Lợi', loai: 'Phường', diaBanCu: 'Thủ Dầu Một' },
  { ten: 'Chánh Hiệp', loai: 'Phường', diaBanCu: 'Thủ Dầu Một' },
  { ten: 'Bình Dương', loai: 'Phường', diaBanCu: 'Thủ Dầu Một' },
  { ten: 'Hòa Lợi', loai: 'Phường', diaBanCu: 'Bến Cát' },
  { ten: 'Phú An', loai: 'Phường', diaBanCu: 'Bến Cát' },
  { ten: 'Tây Nam', loai: 'Phường', diaBanCu: 'Bến Cát' },
  { ten: 'Long Nguyên', loai: 'Phường', diaBanCu: 'Bến Cát' },
  { ten: 'Bến Cát', loai: 'Phường', diaBanCu: 'Bến Cát - Bàu Bàng' },
  { ten: 'Chánh Phú Hòa', loai: 'Phường', diaBanCu: 'Bến Cát' },
  { ten: 'Vĩnh Tân', loai: 'Phường', diaBanCu: 'Tân Uyên' },
  { ten: 'Bình Cơ', loai: 'Phường', diaBanCu: 'Bắc Tân Uyên' },
  { ten: 'Tân Uyên', loai: 'Phường', diaBanCu: 'Tân Uyên' },
  { ten: 'Tân Hiệp', loai: 'Phường', diaBanCu: 'Tân Uyên' },
  { ten: 'Tân Khánh', loai: 'Phường', diaBanCu: 'Tân Uyên' },
  { ten: 'Vũng Tàu', loai: 'Phường', diaBanCu: 'TP. Vũng Tàu' },
  { ten: 'Tam Thắng', loai: 'Phường', diaBanCu: 'TP. Vũng Tàu' },
  { ten: 'Rạch Dừa', loai: 'Phường', diaBanCu: 'TP. Vũng Tàu' },
  { ten: 'Phước Thắng', loai: 'Phường', diaBanCu: 'TP. Vũng Tàu' },
  { ten: 'Long Hương', loai: 'Phường', diaBanCu: 'TP. Bà Rịa' },
  { ten: 'Bà Rịa', loai: 'Phường', diaBanCu: 'TP. Bà Rịa' },
  { ten: 'Tam Long', loai: 'Phường', diaBanCu: 'TP. Bà Rịa' },
  { ten: 'Tân Hải', loai: 'Phường', diaBanCu: 'TP. Phú Mỹ' },
  { ten: 'Tân Phước', loai: 'Phường', diaBanCu: 'TP. Phú Mỹ' },
  { ten: 'Phú Mỹ', loai: 'Phường', diaBanCu: 'TP. Phú Mỹ' },
  { ten: 'Tân Thành', loai: 'Phường', diaBanCu: 'TP. Phú Mỹ' },
  { ten: 'Vĩnh Lộc', loai: 'Xã', diaBanCu: 'Bình Chánh' },
  { ten: 'Tân Vĩnh Lộc', loai: 'Xã', diaBanCu: 'Bình Chánh' },
  { ten: 'Bình Lợi', loai: 'Xã', diaBanCu: 'Bình Chánh' },
  { ten: 'Tân Nhựt', loai: 'Xã', diaBanCu: 'Bình Chánh' },
  { ten: 'Bình Chánh', loai: 'Xã', diaBanCu: 'Bình Chánh' },
  { ten: 'Hưng Long', loai: 'Xã', diaBanCu: 'Bình Chánh' },
  { ten: 'Bình Hưng', loai: 'Xã', diaBanCu: 'Bình Chánh' },
  { ten: 'Bình Khánh', loai: 'Xã', diaBanCu: 'Cần Giờ' },
  { ten: 'An Thới Đông', loai: 'Xã', diaBanCu: 'Cần Giờ' },
  { ten: 'Cần Giờ', loai: 'Xã', diaBanCu: 'Cần Giờ' },
  { ten: 'Củ Chi', loai: 'Xã', diaBanCu: 'Củ Chi' },
  { ten: 'Tân An Hội', loai: 'Xã', diaBanCu: 'Củ Chi' },
  { ten: 'Thái Mỹ', loai: 'Xã', diaBanCu: 'Củ Chi' },
  { ten: 'An Nhơn Tây', loai: 'Xã', diaBanCu: 'Củ Chi' },
  { ten: 'Nhuận Đức', loai: 'Xã', diaBanCu: 'Củ Chi' },
  { ten: 'Phú Hòa Đông', loai: 'Xã', diaBanCu: 'Củ Chi' },
  { ten: 'Bình Mỹ', loai: 'Xã', diaBanCu: 'Củ Chi' },
  { ten: 'Đông Thạnh', loai: 'Xã', diaBanCu: 'Hóc Môn' },
  { ten: 'Hóc Môn', loai: 'Xã', diaBanCu: 'Hóc Môn' },
  { ten: 'Xuân Thới Sơn', loai: 'Xã', diaBanCu: 'Hóc Môn' },
  { ten: 'Bà Điểm', loai: 'Xã', diaBanCu: 'Hóc Môn' },
  { ten: 'Nhà Bè', loai: 'Xã', diaBanCu: 'Nhà Bè' },
  { ten: 'Hiệp Phước', loai: 'Xã', diaBanCu: 'Nhà Bè' },
  { ten: 'Thường Tân', loai: 'Xã', diaBanCu: 'Bắc Tân Uyên' },
  { ten: 'Bắc Tân Uyên', loai: 'Xã', diaBanCu: 'Bắc Tân Uyên' },
  { ten: 'Phú Giáo', loai: 'Xã', diaBanCu: 'Phú Giáo' },
  { ten: 'Phước Hòa', loai: 'Xã', diaBanCu: 'Phú Giáo' },
  { ten: 'Phước Thành', loai: 'Xã', diaBanCu: 'Phú Giáo' },
  { ten: 'An Long', loai: 'Xã', diaBanCu: 'Phú Giáo' },
  { ten: 'Trừ Văn Thố', loai: 'Xã', diaBanCu: 'Bàu Bàng' },
  { ten: 'Bàu Bàng', loai: 'Xã', diaBanCu: 'Bàu Bàng' },
  { ten: 'Long Hòa', loai: 'Xã', diaBanCu: 'Dầu Tiếng' },
  { ten: 'Thanh An', loai: 'Xã', diaBanCu: 'Dầu Tiếng' },
  { ten: 'Dầu Tiếng', loai: 'Xã', diaBanCu: 'Dầu Tiếng' },
  { ten: 'Minh Thạnh', loai: 'Xã', diaBanCu: 'Dầu Tiếng' },
  { ten: 'Châu Pha', loai: 'Xã', diaBanCu: 'TP. Phú Mỹ' },
  { ten: 'Long Hải', loai: 'Xã', diaBanCu: 'Long Điền' },
  { ten: 'Long Điền', loai: 'Xã', diaBanCu: 'Long Điền' },
  { ten: 'Phước Hải', loai: 'Xã', diaBanCu: 'Long Đất' },
  { ten: 'Đất Đỏ', loai: 'Xã', diaBanCu: 'Long Đất' },
  { ten: 'Nghĩa Thành', loai: 'Xã', diaBanCu: 'Châu Đức' },
  { ten: 'Ngãi Giao', loai: 'Xã', diaBanCu: 'Châu Đức' },
  { ten: 'Kim Long', loai: 'Xã', diaBanCu: 'Châu Đức' },
  { ten: 'Châu Đức', loai: 'Xã', diaBanCu: 'Châu Đức' },
  { ten: 'Bình Giã', loai: 'Xã', diaBanCu: 'Châu Đức' },
  { ten: 'Xuân Sơn', loai: 'Xã', diaBanCu: 'Châu Đức' },
  { ten: 'Hồ Tràm', loai: 'Xã', diaBanCu: 'Xuyên Mộc' },
  { ten: 'Xuyên Mộc', loai: 'Xã', diaBanCu: 'Xuyên Mộc' },
  { ten: 'Hòa Hội', loai: 'Xã', diaBanCu: 'Xuyên Mộc' },
  { ten: 'Bàu Lâm', loai: 'Xã', diaBanCu: 'Xuyên Mộc' },
  { ten: 'Côn Đảo', loai: 'Đặc khu', diaBanCu: 'Côn Đảo' },
  { ten: 'Thới Hòa', loai: 'Phường', diaBanCu: 'Bến Cát' },
  { ten: 'Long Sơn', loai: 'Xã', diaBanCu: 'TP. Vũng Tàu' },
  { ten: 'Hòa Hiệp', loai: 'Xã', diaBanCu: 'Xuyên Mộc' },
  { ten: 'Bình Châu', loai: 'Xã', diaBanCu: 'Xuyên Mộc' },
  { ten: 'Thạnh An', loai: 'Xã', diaBanCu: 'Cần Giờ' },
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
