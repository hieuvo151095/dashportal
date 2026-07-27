import { CAP_HOC_LIST, TODAY, type CapHoc } from '../../mock-data'
import { formatMonthYear } from '../../utils/date'
import { useQueryParam, useQueryParamArray } from '../../utils/useQueryParam'

export const DEFAULT_KY = formatMonthYear(TODAY)

export interface DashboardFilters {
  ky: string
  phuongXaId: string
  capHocList: CapHoc[]
}

export interface DashboardFiltersApi extends DashboardFilters {
  setKy: (value: string) => void
  setPhuongXaId: (value: string) => void
  setCapHocList: (value: CapHoc[]) => void
}

export function getKyOptions(): string[] {
  const options: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1)
    options.push(formatMonthYear(d))
  }
  return options
}

export function useDashboardFilters(): DashboardFiltersApi {
  const [ky, setKy] = useQueryParam('ky', DEFAULT_KY)
  const [phuongXaId, setPhuongXaId] = useQueryParam('xa', 'all')
  const [capHocList, setCapHocList] = useQueryParamArray('cap', CAP_HOC_LIST)

  return {
    ky,
    phuongXaId,
    capHocList: capHocList as CapHoc[],
    setKy,
    setPhuongXaId,
    setCapHocList,
  }
}
