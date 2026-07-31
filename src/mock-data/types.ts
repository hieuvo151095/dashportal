export type CapHoc = 'Mầm non' | 'Tiểu học' | 'THCS' | 'THPT'

export type HeThongDoiTac =
  | 'SSC'
  | 'Misa'
  | 'Viettel'
  | 'VNPT'
  | 'eNetViet'
  | 'YoYoSchool'
  | 'ECO School'

export type NhomPhi = 'Thu theo tháng' | 'Thu theo năm' | 'Thu không định kỳ'

export type NguonThu = 'Học phí' | 'Dịch vụ' | 'Bán trú'

export type DonViTinh = 'tháng' | 'giờ' | 'lần' | 'ngày' | 'năm' | 'chuyến'

export type DanhMucKhoanThu =
  | 'Học phí'
  | 'Bán trú'
  | 'Đưa đón'
  | 'Bảo hiểm y tế'
  | 'Đồng phục'
  | 'Ngoại khoá'
  | 'Khoản thu khác'

export type HinhThucThanhToan = 'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử' | 'QR Code'

export type TrangThaiHoaDon = 'Đã gửi' | 'Thanh toán một phần' | 'Đã thanh toán'

export type NhomTuoiNo = '≤30 ngày' | '31–60 ngày' | '61–90 ngày' | '>90 ngày'

export interface PhuongXa {
  id: string
  ten: string
  loai: 'Phường' | 'Xã' | 'Đặc khu'
  diaBanCu: string
}

export interface Truong {
  id: string
  maTruong: string
  tenTruong: string
  phuongXaId: string
  capHoc: CapHoc
  heThongDoiTac: HeThongDoiTac
  ngayCapNhat: string
}

export interface HocSinh {
  id: string
  maHocSinh: string
  hoTen: string
  truongId: string
  khoi: string
  lop: string
}

export interface KhoanPhi {
  id: string
  maPhi: string
  tenPhi: string
  soTien: number
  donViTinh: DonViTinh
  nguonThu: NguonThu
  nhomPhi: NhomPhi
  danhMucKhoanThu: DanhMucKhoanThu
  nienKhoa: string
  truongId: string
  thamChieuPhapLy: string
  ghiChu: string
}

export interface HoaDon {
  id: string
  soHoaDon: string
  hocSinhId: string
  truongId: string
  khoanPhiId: string
  ky: string
  ngayLap: string
  hanThanhToan: string
  ngayThanhToan: string | null
  soTien: number
  daTra: number
  conLai: number
  trangThai: TrangThaiHoaDon
  hinhThucThanhToan: HinhThucThanhToan | null
  taoBoi: string
  xacNhanBoi: string | null
}

export interface MockDataset {
  phuongXaList: PhuongXa[]
  truongList: Truong[]
  hocSinhList: HocSinh[]
  khoanPhiList: KhoanPhi[]
  hoaDonList: HoaDon[]
}
