import { mockDataset } from './index'
import { createRng } from './random'
import type { DonViTinh, HoaDon, KhoanPhi, NguonThu, NhomPhi } from './types'

export interface HoaDonBreakdownLine {
  maPhi: string
  tenPhi: string
  soTien: number
  donViTinh: DonViTinh
  nguonThu: NguonThu
  nhomPhi: NhomPhi
  nienKhoa: string
}

// Offset riêng cho rng của tầng breakdown này — không trùng offset 1000/2000/3000/4000 đang
// dùng để sinh Xã/Phường, Học sinh, Danh mục phí, Hoá đơn (xem random.ts) — tránh làm lệch
// chuỗi giá trị ngẫu nhiên đang dùng cho các dữ liệu/KPI hiện có.
const BREAKDOWN_RNG_OFFSET = 5000

let khoanPhiByTruongCache: Map<string, KhoanPhi[]> | null = null

function getKhoanPhiByTruong(): Map<string, KhoanPhi[]> {
  if (!khoanPhiByTruongCache) {
    khoanPhiByTruongCache = new Map()
    for (const kp of mockDataset.khoanPhiList) {
      const list = khoanPhiByTruongCache.get(kp.truongId) ?? []
      list.push(kp)
      khoanPhiByTruongCache.set(kp.truongId, list)
    }
  }
  return khoanPhiByTruongCache
}

function toLine(kp: KhoanPhi, soTien: number, tenPhi = kp.tenPhi): HoaDonBreakdownLine {
  return {
    maPhi: kp.maPhi,
    tenPhi,
    soTien,
    donViTinh: kp.donViTinh,
    nguonThu: kp.nguonThu,
    nhomPhi: kp.nhomPhi,
    nienKhoa: kp.nienKhoa,
  }
}

const breakdownCache = new Map<string, HoaDonBreakdownLine[]>()

/**
 * Breakdown khoản phí của 1 hoá đơn thành nhiều dòng (2-5 khoản, deterministic theo seed).
 * CHỈ ánh xạ hoá đơn → danh sách khoản phí thật của trường — không đổi hoaDon.soTien hiện có
 * (tổng breakdown luôn khớp tuyệt đối, đảm bảo bằng cách dựng chứ không làm tròn/xấp xỉ), và
 * không đụng tới mockDataset.hoaDonList/khoanPhiList.
 */
export function getHoaDonBreakdown(hoaDon: HoaDon): HoaDonBreakdownLine[] {
  const cached = breakdownCache.get(hoaDon.id)
  if (cached) return cached

  const chinhPhi = mockDataset.khoanPhiList.find((kp) => kp.id === hoaDon.khoanPhiId)
  if (!chinhPhi) {
    // Không nên xảy ra (mọi hoá đơn đều gắn 1 khoanPhiId hợp lệ khi sinh) — fallback an toàn.
    const result: HoaDonBreakdownLine[] = [
      { maPhi: '—', tenPhi: 'Khoản phí', soTien: hoaDon.soTien, donViTinh: 'lần', nguonThu: 'Dịch vụ', nhomPhi: 'Thu không định kỳ', nienKhoa: hoaDon.ky },
    ]
    breakdownCache.set(hoaDon.id, result)
    return result
  }

  const idx = Number.parseInt(hoaDon.id.slice(3), 10) || 0
  const rng = createRng(BREAKDOWN_RNG_OFFSET + idx)

  const catalog = getKhoanPhiByTruong().get(hoaDon.truongId) ?? []
  const khac = rng.shuffle(catalog.filter((kp) => kp.id !== chinhPhi.id))

  // Số khoản phí "khác" muốn ghép (giá niêm yết thật) — cộng với dòng khoản phí gốc bên dưới
  // là tổng 2-5 dòng theo yêu cầu.
  const targetSoKhoanKhac = rng.int(1, 4)
  const linesKhac: KhoanPhi[] = []
  let tongKhac = 0
  for (const kp of khac) {
    if (linesKhac.length >= targetSoKhoanKhac) break
    if (tongKhac + kp.soTien < hoaDon.soTien) {
      linesKhac.push(kp)
      tongKhac += kp.soTien
    }
  }

  let result: HoaDonBreakdownLine[]

  if (linesKhac.length === 0) {
    // Không có khoản phí thật nào khác trong danh mục trường có giá niêm yết thấp hơn tổng hoá
    // đơn này (hoá đơn thuộc nhóm khoản phí rẻ nhất trường) — không thể ghép thêm dòng giá niêm
    // yết mà vẫn còn dư dương. Tách khoản phí GỐC thành 2 đợt thu (vẫn đúng 1 khoản phí thật đó,
    // không bịa khoản phí/dòng chênh lệch giả) để vẫn đảm bảo tối thiểu 2 dòng.
    const ty = rng.float(0.3, 0.7)
    const rawSplit = Math.round((hoaDon.soTien * ty) / 1000) * 1000
    const dot1 = Math.min(Math.max(rawSplit, 1000), hoaDon.soTien - 1000)
    const dot2 = hoaDon.soTien - dot1
    result = [toLine(chinhPhi, dot1, `${chinhPhi.tenPhi} (đợt 1)`), toLine(chinhPhi, dot2, `${chinhPhi.tenPhi} (đợt 2)`)]
  } else {
    const conLai = hoaDon.soTien - tongKhac
    result = [...linesKhac.map((kp) => toLine(kp, kp.soTien)), toLine(chinhPhi, conLai)]
    result.sort((a, b) => b.soTien - a.soTien)
  }

  breakdownCache.set(hoaDon.id, result)
  return result
}
