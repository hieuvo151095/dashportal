import {
  CAP_HOC_LIST,
  HE_THONG_DOI_TAC_LIST,
  NHAN_VAT_LICH_SU_LIST,
  TEN_HOA_DIA_DANH_LIST,
  TODAY,
} from './constants'
import { createRng } from './random'
import type { CapHoc, PhuongXa, Truong } from './types'

// Phân bổ đều 4 cấp học, tổng 50 trường.
const SO_TRUONG_THEO_CAP: Record<CapHoc, number> = {
  'Mầm non': 14,
  'Tiểu học': 13,
  THCS: 12,
  THPT: 11,
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

export function generateTruongList(phuongXaList: PhuongXa[]): Truong[] {
  const rng = createRng(1000)
  const maTruongSet = new Set<string>()
  const tenTruongSet = new Set<string>()
  const truongList: Truong[] = []

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

      const phuongXa = rng.pick(phuongXaList)
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
