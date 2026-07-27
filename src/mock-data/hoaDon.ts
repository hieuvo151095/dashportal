import { HINH_THUC_THANH_TOAN_LIST, NHAN_VIEN_KE_TOAN_LIST, NIEN_KHOA, TODAY } from './constants'
import { createRng, type Rng } from './random'
import type { HoaDon, HocSinh, KhoanPhi, TrangThaiHoaDon, Truong } from './types'

const SO_THANG_GAN_NHAT = 6

function taoDanhSachThang(soThang: number): Date[] {
  const result: Date[] = []
  for (let i = soThang - 1; i >= 0; i--) {
    result.push(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1))
  }
  return result
}

function formatKyThang(date: Date): string {
  const thang = String(date.getMonth() + 1).padStart(2, '0')
  return `${thang}/${date.getFullYear()}`
}

function soThangCachHomNay(date: Date): number {
  return (TODAY.getFullYear() - date.getFullYear()) * 12 + (TODAY.getMonth() - date.getMonth())
}

function lamTronNghin(soTien: number): number {
  return Math.round(soTien / 1000) * 1000
}

function weightedPick<T extends string>(rng: Rng, weights: [T, number][]): T {
  const total = weights.reduce((sum, [, w]) => sum + w, 0)
  let r = rng.next() * total
  for (const [value, w] of weights) {
    if (r < w) return value
    r -= w
  }
  return weights[weights.length - 1][0]
}

// Hoá đơn của tháng càng gần hiện tại thì xác suất còn "Đã gửi"/"Thanh toán một phần"
// càng cao — mô phỏng công nợ thực tế thường phát sinh gần đây, hoá đơn cũ đã tất toán.
function chonTrangThai(rng: Rng, soThangTruoc: number): TrangThaiHoaDon {
  const weights: [TrangThaiHoaDon, number][] =
    soThangTruoc <= 0
      ? [['Đã thanh toán', 35], ['Thanh toán một phần', 25], ['Đã gửi', 40]]
      : soThangTruoc === 1
        ? [['Đã thanh toán', 65], ['Thanh toán một phần', 15], ['Đã gửi', 20]]
        : soThangTruoc === 2
          ? [['Đã thanh toán', 85], ['Thanh toán một phần', 8], ['Đã gửi', 7]]
          : [['Đã thanh toán', 95], ['Thanh toán một phần', 3], ['Đã gửi', 2]]
  return weightedPick(rng, weights)
}

interface TaoHoaDonParams {
  rng: Rng
  index: number
  hocSinh: HocSinh
  truong: Truong
  khoanPhi: KhoanPhi
  ky: string
  ngayLap: Date
}

function taoHoaDon({ rng, index, hocSinh, truong, khoanPhi, ky, ngayLap }: TaoHoaDonParams): HoaDon {
  const hanThanhToan = new Date(ngayLap)
  hanThanhToan.setDate(hanThanhToan.getDate() + rng.int(15, 25))

  const trangThai = chonTrangThai(rng, soThangCachHomNay(ngayLap))
  const soTien = khoanPhi.soTien

  let daTra = 0
  let hinhThucThanhToan: HoaDon['hinhThucThanhToan'] = null
  if (trangThai === 'Đã thanh toán') {
    daTra = soTien
    hinhThucThanhToan = rng.pick(HINH_THUC_THANH_TOAN_LIST)
  } else if (trangThai === 'Thanh toán một phần') {
    daTra = lamTronNghin(soTien * rng.float(0.2, 0.8))
    hinhThucThanhToan = rng.pick(HINH_THUC_THANH_TOAN_LIST)
  }

  return {
    id: `hd-${String(index).padStart(6, '0')}`,
    soHoaDon: `HD${ngayLap.getFullYear()}${String(ngayLap.getMonth() + 1).padStart(2, '0')}${String(index).padStart(6, '0')}`,
    hocSinhId: hocSinh.id,
    truongId: truong.id,
    khoanPhiId: khoanPhi.id,
    ky,
    ngayLap: ngayLap.toISOString(),
    hanThanhToan: hanThanhToan.toISOString(),
    soTien,
    daTra,
    conLai: soTien - daTra,
    trangThai,
    hinhThucThanhToan,
    taoBoi: rng.pick(NHAN_VIEN_KE_TOAN_LIST),
    xacNhanBoi: trangThai === 'Đã gửi' ? null : rng.pick(NHAN_VIEN_KE_TOAN_LIST),
  }
}

function xacSuatDangKy(khoanPhi: KhoanPhi): number {
  if (khoanPhi.tenPhi === 'Học phí') return 1
  if (khoanPhi.nhomPhi === 'Thu theo tháng') return 0.55
  if (khoanPhi.nhomPhi === 'Thu theo năm') return 0.65
  return 0.35
}

export function generateHoaDonList(
  hocSinhList: HocSinh[],
  truongById: Map<string, Truong>,
  khoanPhiByTruong: Map<string, KhoanPhi[]>,
): HoaDon[] {
  const rng = createRng(4000)
  const danhSachThang = taoDanhSachThang(SO_THANG_GAN_NHAT)
  const hoaDonList: HoaDon[] = []
  let dem = 1

  for (const hocSinh of hocSinhList) {
    const truong = truongById.get(hocSinh.truongId)
    if (!truong) continue
    const khoanPhiList = khoanPhiByTruong.get(truong.id) ?? []

    for (const khoanPhi of khoanPhiList) {
      if (!rng.chance(xacSuatDangKy(khoanPhi))) continue

      if (khoanPhi.nhomPhi === 'Thu theo tháng') {
        for (const thang of danhSachThang) {
          const ngayLap = new Date(thang.getFullYear(), thang.getMonth(), rng.int(1, 5))
          hoaDonList.push(
            taoHoaDon({ rng, index: dem, hocSinh, truong, khoanPhi, ky: formatKyThang(thang), ngayLap }),
          )
          dem++
        }
      } else if (khoanPhi.nhomPhi === 'Thu theo năm') {
        const thangDauNienKhoa = danhSachThang[0]
        const ngayLap = new Date(thangDauNienKhoa.getFullYear(), thangDauNienKhoa.getMonth(), rng.int(1, 10))
        hoaDonList.push(taoHoaDon({ rng, index: dem, hocSinh, truong, khoanPhi, ky: NIEN_KHOA, ngayLap }))
        dem++
      } else {
        const soLan = rng.int(0, 2)
        for (let i = 0; i < soLan; i++) {
          const thang = rng.pick(danhSachThang)
          const ngayLap = new Date(thang.getFullYear(), thang.getMonth(), rng.int(1, 28))
          hoaDonList.push(
            taoHoaDon({ rng, index: dem, hocSinh, truong, khoanPhi, ky: formatKyThang(thang), ngayLap }),
          )
          dem++
        }
      }
    }
  }

  return hoaDonList
}
