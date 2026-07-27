import { HO_LIST, TEN_DEM_NAM_LIST, TEN_DEM_NU_LIST, TEN_NAM_LIST, TEN_NU_LIST } from './constants'
import { createRng } from './random'
import type { CapHoc, HocSinh, Truong } from './types'

const KHOI_THEO_CAP: Record<CapHoc, string[]> = {
  'Mầm non': ['Nhà trẻ', 'Mầm', 'Chồi', 'Lá'],
  'Tiểu học': ['1', '2', '3', '4', '5'],
  THCS: ['6', '7', '8', '9'],
  THPT: ['10', '11', '12'],
}

const CHU_CAI_LOP = ['A', 'B', 'C', 'D']

function taoLop(rng: ReturnType<typeof createRng>, capHoc: CapHoc, khoi: string): string {
  if (capHoc === 'Mầm non') {
    return `${khoi} ${rng.int(1, 3)}`
  }
  return `${khoi}${rng.pick(CHU_CAI_LOP.slice(0, 3))}`
}

function taoHoTen(rng: ReturnType<typeof createRng>): string {
  const laNam = rng.chance(0.5)
  const ho = rng.pick(HO_LIST)
  const tenDem = rng.pick(laNam ? TEN_DEM_NAM_LIST : TEN_DEM_NU_LIST)
  const ten = rng.pick(laNam ? TEN_NAM_LIST : TEN_NU_LIST)
  return `${ho} ${tenDem} ${ten}`
}

export function generateHocSinhList(truongList: Truong[]): HocSinh[] {
  const rng = createRng(2000)
  const hocSinhList: HocSinh[] = []
  let sttToanCuc = 1

  for (const truong of truongList) {
    const khoiList = KHOI_THEO_CAP[truong.capHoc]
    const soHocSinh = rng.int(16, 34)

    for (let i = 0; i < soHocSinh; i++) {
      const khoi = rng.pick(khoiList)
      const lop = taoLop(rng, truong.capHoc, khoi)
      const maHocSinh = `HS${truong.maTruong.slice(-4)}${String(i + 1).padStart(3, '0')}`

      hocSinhList.push({
        id: `hs-${String(sttToanCuc).padStart(4, '0')}`,
        maHocSinh,
        hoTen: taoHoTen(rng),
        truongId: truong.id,
        khoi,
        lop,
      })
      sttToanCuc++
    }
  }

  return hocSinhList
}
