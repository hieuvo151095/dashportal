import { useSearchParams } from 'react-router-dom'
import { mockDataset } from '../../mock-data'
import { getKyOptions } from '../../utils/ky'

const KY_OPTIONS = getKyOptions()

const DEFAULTS = {
  truong: mockDataset.truongList[0]?.id ?? '',
  maHocSinh: '',
  khoi: 'all',
  lop: 'all',
  kyTu: KY_OPTIONS[0],
  kyDen: KY_OPTIONS[KY_OPTIONS.length - 1],
  nhomTuoiNo: 'all',
} as const

type ParamKey = keyof typeof DEFAULTS

export interface ChiTietFiltersApi {
  truongId: string
  maHocSinh: string
  khoi: string
  lop: string
  kyTu: string
  kyDen: string
  nhomTuoiNo: string
  setTruongId: (value: string) => void
  setMaHocSinh: (value: string) => void
  setKhoi: (value: string) => void
  setLop: (value: string) => void
  setKyTu: (value: string) => void
  setKyDen: (value: string) => void
  setNhomTuoiNo: (value: string) => void
}

// Dùng chung 1 useSearchParams — đổi Trường phải reset Khối+Lớp, đổi Khối phải reset Lớp,
// trong cùng 1 lần điều hướng (xem ghi chú tương tự ở Module 2/3).
export function useChiTietFilters(): ChiTietFiltersApi {
  const [params, setParams] = useSearchParams()

  function get(key: ParamKey): string {
    return params.get(key) ?? DEFAULTS[key]
  }

  function update(patch: Partial<Record<ParamKey, string>>) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(patch) as [ParamKey, string][]) {
          if (value === DEFAULTS[key]) {
            next.delete(key)
          } else {
            next.set(key, value)
          }
        }
        return next
      },
      { replace: true },
    )
  }

  return {
    truongId: get('truong'),
    maHocSinh: get('maHocSinh'),
    khoi: get('khoi'),
    lop: get('lop'),
    kyTu: get('kyTu'),
    kyDen: get('kyDen'),
    nhomTuoiNo: get('nhomTuoiNo'),
    setTruongId: (value) => update({ truong: value, khoi: DEFAULTS.khoi, lop: DEFAULTS.lop }),
    setMaHocSinh: (value) => update({ maHocSinh: value }),
    setKhoi: (value) => update({ khoi: value, lop: DEFAULTS.lop }),
    setLop: (value) => update({ lop: value }),
    setKyTu: (value) => update({ kyTu: value }),
    setKyDen: (value) => update({ kyDen: value }),
    setNhomTuoiNo: (value) => update({ nhomTuoiNo: value }),
  }
}
