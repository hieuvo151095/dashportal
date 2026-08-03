import {
  CAP_HOC_LIST,
  HE_THONG_DOI_TAC_LIST,
  NHAN_VAT_LICH_SU_LIST,
  TEN_HOA_DIA_DANH_LIST,
  TODAY,
} from './constants'
import { createRng, type Rng } from './random'
import type { CapHoc, PhuongXa, Truong } from './types'
import { formatMonthYear } from '../utils/date'

// 6 kỳ gần nhất — cùng logic getKyOptions() ở utils/ky.ts, nhưng viết lại tại chỗ (không
// import utils/ky.ts) để tránh import cycle: utils/ky.ts đọc TODAY từ barrel mock-data/index.ts,
// mà index.ts lại import chính truong.ts này.
const SO_KY_DONG_BO = 6
function sinhDanhSachKy(): string[] {
  const result: string[] = []
  for (let i = SO_KY_DONG_BO - 1; i >= 0; i--) {
    result.push(formatMonthYear(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1)))
  }
  return result
}
const DANH_SACH_KY = sinhDanhSachKy()

// Hạn chót đồng bộ dữ liệu của 1 kỳ = ngày 7 tháng kế tiếp (vd kỳ 07/2026 → hạn 07/08/2026).
function hanChotDongBoCuaKy(ky: string): Date {
  const [thangStr, namStr] = ky.split('/')
  // Date(năm, tháng, ngày) coi tham số tháng là 0-based — truyền thẳng số tháng 1-based của kỳ
  // vào đúng bằng chỉ số 0-based của tháng KẾ TIẾP, khỏi phải +1 rồi xử lý tràn năm thủ công.
  return new Date(Number(namStr), Number(thangStr), 7)
}

// Mỗi trường có 1 mốc "ngày đồng bộ" riêng cho từng kỳ trong 6 kỳ gần nhất — kỳ càng gần hiện
// tại thì xác suất đã đồng bộ đúng hạn càng thấp (kỳ hiện tại còn chưa hết hạn), giống cách
// chonTrangThai() ở hoaDon.ts thiên vị theo khoảng cách tới hôm nay.
// Export để tái dùng cho dữ liệu demo riêng của widget "Tình trạng đồng bộ dữ liệu"
// (xem src/pages/DashboardPage/syncComplianceMockData.ts) — giữ đúng 1 phân phối xác suất
// đúng hạn/trễ hạn cho mọi nơi sinh "ngày đồng bộ", không viết lại logic riêng.
export function sinhNgayDongBoTheoKy(rng: Rng): Record<string, string> {
  const result: Record<string, string> = {}
  DANH_SACH_KY.forEach((ky, idx) => {
    const soKyTruoc = DANH_SACH_KY.length - 1 - idx
    const xacSuatDungHan = soKyTruoc === 0 ? 0.3 : soKyTruoc === 1 ? 0.6 : 0.9
    const hanChot = hanChotDongBoCuaKy(ky)
    const ngayDongBo = new Date(hanChot)
    if (rng.chance(xacSuatDungHan)) {
      ngayDongBo.setDate(ngayDongBo.getDate() - rng.int(1, 7))
    } else {
      // Biên độ trễ trải rộng tới 25 ngày (không chỉ 1-10) để có đủ trường rơi vào cả 2 mốc
      // phân loại "Chậm từ 7 ngày" (8-15) và "Chậm từ 15 ngày" (>=15) ở Dashboard.
      ngayDongBo.setDate(ngayDongBo.getDate() + rng.int(1, 25))
    }
    result[ky] = ngayDongBo.toISOString()
  })
  return result
}

// Phân bổ đều 4 cấp học, tổng 180 trường (đủ để hầu hết 167 Phường/Xã có dân — trừ Đặc khu
// Côn Đảo — đều có ít nhất 1 trường, xem phân bổ round-robin bên dưới).
const SO_TRUONG_THEO_CAP: Record<CapHoc, number> = {
  'Mầm non': 45,
  'Tiểu học': 45,
  THCS: 45,
  THPT: 45,
}

export const PREFIX_THEO_CAP: Record<CapHoc, string> = {
  'Mầm non': 'Trường Mầm non',
  'Tiểu học': 'Trường Tiểu học',
  THCS: 'Trường THCS',
  THPT: 'Trường THPT',
}

function tenGocTheoCap(capHoc: CapHoc): readonly string[] {
  return capHoc === 'Mầm non' ? TEN_HOA_DIA_DANH_LIST : NHAN_VAT_LICH_SU_LIST
}

// Phân bổ trường về Phường/Xã theo round-robin thay vì random.pick thuần: với 180 trường
// trên 168 khu vực (167 khu có dân + 1 Đặc khu Côn Đảo dân số rất thấp, cố tình để 0 trường),
// random.pick độc lập từng trường có thể để trống ngẫu nhiên tới ~30% số khu vực (đã verify
// bằng xấp xỉ Poisson trước khi code). Round-robin đảm bảo cả 167 khu đều có >=1 trường:
// xáo trộn danh sách 167 khu, lặp vòng cho đủ 180 slot (13 khu đầu tiên trong thứ tự xáo trộn
// có 2 trường), rồi xáo trộn lại thứ tự 180 slot đó để tách rời khỏi thứ tự sinh theo cấp học.
function phanBoPhuongXaChoTruong(rng: ReturnType<typeof createRng>, phuongXaList: PhuongXa[], tongSoTruong: number): PhuongXa[] {
  const khuCoDanList = phuongXaList.filter((px) => px.loai !== 'Đặc khu')
  const khuCoDanXaoTron = rng.shuffle(khuCoDanList)

  const phanBoLapVong: PhuongXa[] = []
  for (let i = 0; i < tongSoTruong; i++) {
    phanBoLapVong.push(khuCoDanXaoTron[i % khuCoDanXaoTron.length])
  }

  return rng.shuffle(phanBoLapVong)
}

export function generateTruongList(phuongXaList: PhuongXa[]): Truong[] {
  const rng = createRng(1000)
  const maTruongSet = new Set<string>()
  const tenTruongSet = new Set<string>()
  const truongList: Truong[] = []

  const tongSoTruong = Object.values(SO_TRUONG_THEO_CAP).reduce((a, b) => a + b, 0)
  const phanBoPhuongXa = phanBoPhuongXaChoTruong(rng, phuongXaList, tongSoTruong)

  let sttToanCuc = 1
  for (const capHoc of CAP_HOC_LIST) {
    const soLuong = SO_TRUONG_THEO_CAP[capHoc]
    const tenGocList = tenGocTheoCap(capHoc)
    const tenGocShuffled = rng.shuffle(tenGocList)

    for (let i = 0; i < soLuong; i++) {
      let maTruong = `79${rng.int(100000, 999999)}`
      while (maTruongSet.has(maTruong)) {
        maTruong = `79${rng.int(100000, 999999)}`
      }
      maTruongSet.add(maTruong)

      const tenGoc = tenGocShuffled[i % tenGocShuffled.length]
      let tenTruong = `${PREFIX_THEO_CAP[capHoc]} ${tenGoc}`
      if (tenTruongSet.has(tenTruong)) {
        tenTruong = `${tenTruong} ${Math.floor(i / tenGocShuffled.length) + 2}`
      }
      tenTruongSet.add(tenTruong)

      const phuongXa = phanBoPhuongXa[sttToanCuc - 1]
      const heThongDoiTac = rng.pick(HE_THONG_DOI_TAC_LIST)
      const ngayDongBoTheoKy = sinhNgayDongBoTheoKy(rng)

      truongList.push({
        id: `truong-${String(sttToanCuc).padStart(3, '0')}`,
        maTruong,
        tenTruong,
        phuongXaId: phuongXa.id,
        capHoc,
        heThongDoiTac,
        ngayDongBoTheoKy,
      })
      sttToanCuc++
    }
  }

  return truongList
}
