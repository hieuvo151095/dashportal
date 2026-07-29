import { useMemo } from 'react'
import { mockDataset } from '../../mock-data'
import type { ChiTietFiltersApi } from './useChiTietFilters'

export function useChiTietData(filters: ChiTietFiltersApi) {
  return useMemo(() => {
    const { truongList, phuongXaList, khoanPhiList } = mockDataset

    const truong = truongList.find((t) => t.id === filters.truongId)
    const phuongXa = truong ? phuongXaList.find((px) => px.id === truong.phuongXaId) : undefined

    const q = filters.q.trim().toLowerCase()

    const rows = khoanPhiList
      .filter((k) => k.truongId === filters.truongId)
      .filter((k) => k.nienKhoa === filters.nienKhoa)
      .filter((k) => filters.nguonThu === 'all' || k.nguonThu === filters.nguonThu)
      .filter((k) => filters.nhomPhi === 'all' || k.nhomPhi === filters.nhomPhi)
      .filter((k) => !q || k.tenPhi.toLowerCase().includes(q) || k.maPhi.toLowerCase().includes(q))

    return { truong, phuongXa, rows }
  }, [filters.truongId, filters.q, filters.nguonThu, filters.nhomPhi, filters.nienKhoa])
}

export type ChiTietData = ReturnType<typeof useChiTietData>
