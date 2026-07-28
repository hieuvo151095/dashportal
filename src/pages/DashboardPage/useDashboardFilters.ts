import { CAP_HOC_LIST, type CapHoc } from '../../mock-data'
import { DEFAULT_KY } from '../../utils/ky'
import { useQueryParam, useQueryParamArray } from '../../utils/useQueryParam'

export { DEFAULT_KY, getKyOptions } from '../../utils/ky'

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
