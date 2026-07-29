import {
  CAP_HOC_LIST,
  HE_THONG_DOI_TAC_LIST,
  NHAN_VAT_LICH_SU_LIST,
  TEN_HOA_DIA_DANH_LIST,
  TODAY,
} from './constants'
import { createRng } from './random'
import type { CapHoc, PhuongXa, Truong } from './types'

// Phân bổ đều 4 cấp học, tổng 180 trường (đủ để hầu hết 167 Phường/Xã có dân — trừ Đặc khu
// Côn Đảo — đều có ít nhất 1 trường, xem phân bổ round-robin bên dưới).
const SO_TRUONG_THEO_CAP: Record<CapHoc, number> = {
  'Mầm non': 45,
  'Tiểu học': 45,
  THCS: 45,
  THPT: 45,
}

const PREFIX_THEO_CAP: Record<CapHoc, string> = {
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
      const ngayCapNhat = new Date(TODAY)
      ngayCapNhat.setDate(ngayCapNhat.getDate() - rng.int(0, 60))

      truongList.push({
        id: `truong-${String(sttToanCuc).padStart(3, '0')}`,
        maTruong,
        tenTruong,
        phuongXaId: phuongXa.id,
        capHoc,
        heThongDoiTac,
        ngayCapNhat: ngayCapNhat.toISOString(),
      })
      sttToanCuc++
    }
  }

  return truongList
}
