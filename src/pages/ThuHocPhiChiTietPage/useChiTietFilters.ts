import { useSearchParams } from 'react-router-dom'
import { mockDataset } from '../../mock-data'

const DEFAULTS = {
  truong: mockDataset.truongList[0]?.id ?? '',
  q: '',
  lop: 'all',
  ky: 'all',
  trangThai: 'all',
  hinhThuc: 'all',
  hanTu: '',
  hanDen: '',
} as const

type ParamKey = keyof typeof DEFAULTS

export interface ChiTietFiltersApi {
  truongId: string
  q: string
  lop: string
  ky: string
  trangThai: string
  hinhThucThanhToan: string
  hanTu: string
  hanDen: string
  setTruongId: (value: string) => void
  setQ: (value: string) => void
  setLop: (value: string) => void
  setKy: (value: string) => void
  setTrangThai: (value: string) => void
  setHinhThucThanhToan: (value: string) => void
  setHanTu: (value: string) => void
  setHanDen: (value: string) => void
}

// Dùng chung 1 useSearchParams — chọn Trường khác phải reset Lớp trong cùng 1 lần điều
// hướng (xem ghi chú tương tự ở Module 2/3.1).
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
    q: get('q'),
    lop: get('lop'),
    ky: get('ky'),
    trangThai: get('trangThai'),
    hinhThucThanhToan: get('hinhThuc'),
    hanTu: get('hanTu'),
    hanDen: get('hanDen'),
    setTruongId: (value) => update({ truong: value, lop: DEFAULTS.lop }),
    setQ: (value) => update({ q: value }),
    setLop: (value) => update({ lop: value }),
    setKy: (value) => update({ ky: value }),
    setTrangThai: (value) => update({ trangThai: value }),
    setHinhThucThanhToan: (value) => update({ hinhThuc: value }),
    setHanTu: (value) => update({ hanTu: value }),
    setHanDen: (value) => update({ hanDen: value }),
  }
}
