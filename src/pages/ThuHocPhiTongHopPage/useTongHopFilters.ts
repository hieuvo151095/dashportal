import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CAP_HOC_LIST, type CapHoc } from '../../mock-data'
import { DEFAULT_KY } from '../../utils/ky'

export type TabId = 'tong-quan' | 'da-thanh-toan' | 'mot-phan' | 'chua-thanh-toan'

const DEFAULTS = {
  ky: DEFAULT_KY,
  xa: 'all',
  truong: 'all',
  cap: CAP_HOC_LIST.join(','),
  hinhThuc: 'all',
  tab: 'tong-quan',
  page: '1',
} as const

type ParamKey = keyof typeof DEFAULTS

export interface TongHopFiltersApi {
  ky: string
  phuongXaId: string
  truongId: string
  capHocList: CapHoc[]
  hinhThucThanhToan: string
  tab: TabId
  page: number
  setKy: (value: string) => void
  setPhuongXaId: (value: string) => void
  setTruongId: (value: string) => void
  setCapHocList: (value: CapHoc[]) => void
  setHinhThucThanhToan: (value: string) => void
  setTab: (value: TabId) => void
  setPage: (value: number) => void
}

// Dùng chung 1 useSearchParams để cập nhật nhiều key đồng thời trong 1 lần điều hướng
// (vd chọn Xã/Phường phải reset Trường) — tránh đè lẫn nhau như bug đã gặp ở Module 2.
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

  // Memo hoá theo giá trị chuỗi để giữ nguyên tham chiếu mảng giữa các lần render —
  // tránh vòng lặp render vô hạn ở nơi dùng capHocList làm dependency (so sánh Object.is).
  const capRaw = get('cap')
  const capHocList = useMemo(() => (capRaw === '' ? [] : capRaw.split(',')) as CapHoc[], [capRaw])

  return {
    ky: get('ky'),
    phuongXaId: get('xa'),
    truongId: get('truong'),
    capHocList,
    hinhThucThanhToan: get('hinhThuc'),
    tab: get('tab') as TabId,
    page: Number(get('page')) || 1,
    setKy: (value) => update({ ky: value, page: DEFAULTS.page }),
    setPhuongXaId: (value) => update({ xa: value, truong: DEFAULTS.truong, page: DEFAULTS.page }),
    setTruongId: (value) => update({ truong: value, page: DEFAULTS.page }),
    setCapHocList: (value) => update({ cap: value.join(','), page: DEFAULTS.page }),
    setHinhThucThanhToan: (value) => update({ hinhThuc: value, page: DEFAULTS.page }),
    setTab: (value) => update({ tab: value, page: DEFAULTS.page }),
    setPage: (value) => update({ page: String(value) }),
  }
}
