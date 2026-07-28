import { useMemo } from 'react'
import { mockDataset } from '../../mock-data'
import type { ChiTietFiltersApi } from './useChiTietFilters'

export function useChiTietData(filters: ChiTietFiltersApi) {
  return useMemo(() => {
    const { truongList, phuongXaList, khoanPhiList } = mockDataset

    const truong = truongList.find((t) => t.id === filters.truongId)
    const phuongXa = truong ? phuongXaList.find((px) => px.id === truong.phuongXaId) : undefined

    const tenPhiQuery = filters.tenPhi.trim().toLowerCase()
    const maPhiQuery = filters.maPhi.trim().toLowerCase()

    const rows = khoanPhiList
      .filter((k) => k.truongId === filters.truongId)
      .filter((k) => k.nienKhoa === filters.nienKhoa)
      .filter((k) => filters.nguonThu === 'all' || k.nguonThu === filters.nguonThu)
      .filter((k) => filters.nhomPhi === 'all' || k.nhomPhi === filters.nhomPhi)
      .filter((k) => !tenPhiQuery || k.tenPhi.toLowerCase().includes(tenPhiQuery))
      .filter((k) => !maPhiQuery || k.maPhi.toLowerCase().includes(maPhiQuery))

    return { truong, phuongXa, rows }
  }, [filters.truongId, filters.tenPhi, filters.maPhi, filters.nguonThu, filters.nhomPhi, filters.nienKhoa])
}

export type ChiTietData = ReturnType<typeof useChiTietData>
