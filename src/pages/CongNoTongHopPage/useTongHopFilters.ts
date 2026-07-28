import { useSearchParams } from 'react-router-dom'
import { getKyOptions } from '../../utils/ky'

const KY_OPTIONS = getKyOptions()

const DEFAULTS = {
  xa: 'all',
  truong: 'all',
  kyTu: KY_OPTIONS[0],
  kyDen: KY_OPTIONS[KY_OPTIONS.length - 1],
  nhomTuoiNo: 'all',
} as const

type ParamKey = keyof typeof DEFAULTS

export interface TongHopFiltersApi {
  phuongXaId: string
  truongId: string
  kyTu: string
  kyDen: string
  nhomTuoiNo: string
  setPhuongXaId: (value: string) => void
  setTruongId: (value: string) => void
  setKyTu: (value: string) => void
  setKyDen: (value: string) => void
  setNhomTuoiNo: (value: string) => void
}

// Dùng chung 1 useSearchParams để cập nhật nhiều key đồng thời trong 1 lần điều hướng
// (chọn Xã/Phường phải reset Trường) — tránh đè lẫn nhau (xem ghi chú ở Module 2/3).
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
    kyTu: get('kyTu'),
    kyDen: get('kyDen'),
    nhomTuoiNo: get('nhomTuoiNo'),
    setPhuongXaId: (value) => update({ xa: value, truong: DEFAULTS.truong }),
    setTruongId: (value) => update({ truong: value }),
    setKyTu: (value) => update({ kyTu: value }),
    setKyDen: (value) => update({ kyDen: value }),
    setNhomTuoiNo: (value) => update({ nhomTuoiNo: value }),
  }
}
