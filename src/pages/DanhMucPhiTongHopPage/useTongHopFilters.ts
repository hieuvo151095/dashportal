import { useSearchParams } from 'react-router-dom'
import { NIEN_KHOA } from '../../mock-data'

const DEFAULTS = {
  xa: 'all',
  truong: 'all',
  nienKhoa: NIEN_KHOA,
  nhomPhi: 'all',
  nguonThu: 'all',
  q: '',
  page: '1',
} as const

type ParamKey = keyof typeof DEFAULTS

export interface TongHopFiltersApi {
  phuongXaId: string
  truongId: string
  nienKhoa: string
  nhomPhi: string
  nguonThu: string
  q: string
  page: number
  setPhuongXaId: (value: string) => void
  setTruongId: (value: string) => void
  setNienKhoa: (value: string) => void
  setNhomPhi: (value: string) => void
  setNguonThu: (value: string) => void
  setQ: (value: string) => void
  setPage: (value: number) => void
}

// Dùng chung 1 useSearchParams cho toàn bộ filter — vì các filter cần cập nhật
// đồng thời (vd chọn Xã/Phường phải reset Trường + trang) trong 1 lần điều hướng,
// gọi setSearchParams nhiều lần liên tiếp trong cùng 1 handler sẽ đè lẫn nhau.
export function useTongHopFilters(): TongHopFiltersApi {
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
    phuongXaId: get('xa'),
    truongId: get('truong'),
    nienKhoa: get('nienKhoa'),
    nhomPhi: get('nhomPhi'),
    nguonThu: get('nguonThu'),
    q: get('q'),
    page: Number(get('page')) || 1,
    setPhuongXaId: (value) => update({ xa: value, truong: DEFAULTS.truong, page: DEFAULTS.page }),
    setTruongId: (value) => update({ truong: value, page: DEFAULTS.page }),
    setNienKhoa: (value) => update({ nienKhoa: value, page: DEFAULTS.page }),
    setNhomPhi: (value) => update({ nhomPhi: value, page: DEFAULTS.page }),
    setNguonThu: (value) => update({ nguonThu: value, page: DEFAULTS.page }),
    setQ: (value) => update({ q: value, page: DEFAULTS.page }),
    setPage: (value) => update({ page: String(value) }),
  }
}
