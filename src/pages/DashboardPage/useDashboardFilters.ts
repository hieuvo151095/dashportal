import { useMemo } from 'react'
import { CAP_HOC_LIST, type CapHoc } from '../../mock-data'
import { DEFAULT_KY } from '../../utils/ky'
import { useUrlFilters } from '../../utils/useUrlFilters'

export { DEFAULT_KY, getKyOptions } from '../../utils/ky'

const DEFAULTS: Record<'ky' | 'xa' | 'cap', string> = {
  ky: DEFAULT_KY,
  xa: 'all',
  cap: CAP_HOC_LIST.join(','),
}

export interface DashboardFilters {
  ky: string
  phuongXaId: string
  capHocList: CapHoc[]
}

export interface DashboardFiltersApi extends DashboardFilters {
  setKy: (value: string) => void
  setPhuongXaId: (value: string) => void
  setCapHocList: (value: CapHoc[]) => void
  apply: (draft: DashboardFilters) => void
  reset: () => void
}

export function useDashboardFilters(): DashboardFiltersApi {
  const { get, update, reset } = useUrlFilters(DEFAULTS)

  const capRaw = get('cap')
  // Memo hoá theo giá trị chuỗi để giữ nguyên tham chiếu mảng giữa các lần render —
  // tránh vòng lặp render vô hạn ở nơi dùng capHocList làm dependency (useSkeletonDelay).
  const capHocList = useMemo(() => (capRaw === '' ? [] : capRaw.split(',')) as CapHoc[], [capRaw])

  return {
    ky: get('ky'),
    phuongXaId: get('xa'),
    capHocList,
    setKy: (value) => update({ ky: value }),
    setPhuongXaId: (value) => update({ xa: value }),
    setCapHocList: (value) => update({ cap: value.join(',') }),
    apply: (draft) => update({ ky: draft.ky, xa: draft.phuongXaId, cap: draft.capHocList.join(',') }),
    reset,
  }
}
