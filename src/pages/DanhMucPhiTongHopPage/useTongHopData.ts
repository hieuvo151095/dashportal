import { useMemo } from 'react'
import { mockDataset, type PhuongXa } from '../../mock-data'
import type { TongHopFiltersApi } from './useTongHopFilters'

export interface TongHopRow {
  truong: (typeof mockDataset.truongList)[number]
  phuongXa: PhuongXa
  soMucPhi: number
}

export function useTongHopData(filters: TongHopFiltersApi): { rows: TongHopRow[] } {
  return useMemo(() => {
    const { phuongXaList, truongList, khoanPhiList } = mockDataset
    const phuongXaById = new Map<string, PhuongXa>(phuongXaList.map((px) => [px.id, px]))

    const khoanPhiScoped = khoanPhiList.filter(
      (k) =>
        k.nienKhoa === filters.nienKhoa &&
        (filters.nhomPhi === 'all' || k.nhomPhi === filters.nhomPhi) &&
        (filters.nguonThu === 'all' || k.nguonThu === filters.nguonThu),
    )
    const soMucPhiByTruong = new Map<string, number>()
    for (const k of khoanPhiScoped) {
      soMucPhiByTruong.set(k.truongId, (soMucPhiByTruong.get(k.truongId) ?? 0) + 1)
    }

    const q = filters.q.trim().toLowerCase()
    const rows: TongHopRow[] = truongList
      .filter((t) => filters.phuongXaId === 'all' || t.phuongXaId === filters.phuongXaId)
      .filter((t) => filters.truongId === 'all' || t.id === filters.truongId)
      .filter((t) => !q || t.tenTruong.toLowerCase().includes(q) || t.maTruong.includes(q))
      .map((t) => ({
        truong: t,
        phuongXa: phuongXaById.get(t.phuongXaId)!,
        soMucPhi: soMucPhiByTruong.get(t.id) ?? 0,
      }))

    return { rows }
  }, [filters.phuongXaId, filters.truongId, filters.nienKhoa, filters.nhomPhi, filters.nguonThu, filters.q])
}
