import { useMemo } from 'react'
import { mockDataset, type HoaDon, type HocSinh } from '../../mock-data'
import type { ChiTietFiltersApi } from './useChiTietFilters'

export interface ChiTietRow {
  hocSinh: HocSinh
  hoaDon: HoaDon | null
  isFirstOfStudent: boolean
}

export function useChiTietData(filters: ChiTietFiltersApi) {
  return useMemo(() => {
    const { truongList, phuongXaList, hocSinhList, hoaDonList } = mockDataset

    const truong = truongList.find((t) => t.id === filters.truongId)
    const phuongXa = truong ? phuongXaList.find((px) => px.id === truong.phuongXaId) : undefined

    const hocSinhTruong = hocSinhList.filter((hs) => hs.truongId === filters.truongId)
    const lopOptions = [...new Set(hocSinhTruong.map((hs) => hs.lop))].sort((a, b) => a.localeCompare(b, 'vi'))

    const q = filters.q.trim().toLowerCase()
    const hocSinhScoped = hocSinhTruong
      .filter((hs) => filters.lop === 'all' || hs.lop === filters.lop)
      .filter((hs) => !q || hs.hoTen.toLowerCase().includes(q) || hs.maHocSinh.toLowerCase().includes(q))
      .sort((a, b) => a.lop.localeCompare(b.lop, 'vi') || a.hoTen.localeCompare(b.hoTen, 'vi'))

    const hoaDonByHocSinh = new Map<string, HoaDon[]>()
    for (const hd of hoaDonList) {
      if (hd.truongId !== filters.truongId) continue
      const list = hoaDonByHocSinh.get(hd.hocSinhId) ?? []
      list.push(hd)
      hoaDonByHocSinh.set(hd.hocSinhId, list)
    }

    function passInvoiceFilters(hd: HoaDon): boolean {
      if (filters.ky !== 'all' && hd.ky !== filters.ky) return false
      if (filters.trangThai !== 'all' && hd.trangThai !== filters.trangThai) return false
      if (filters.hinhThucThanhToan !== 'all' && hd.hinhThucThanhToan !== filters.hinhThucThanhToan) return false
      if (filters.hanTu && hd.hanThanhToan < filters.hanTu) return false
      if (filters.hanDen && hd.hanThanhToan > `${filters.hanDen}T23:59:59`) return false
      return true
    }

    const rows: ChiTietRow[] = []
    for (const hocSinh of hocSinhScoped) {
      const hoaDonHocSinh = (hoaDonByHocSinh.get(hocSinh.id) ?? [])
        .filter(passInvoiceFilters)
        .sort((a, b) => new Date(a.ngayLap).getTime() - new Date(b.ngayLap).getTime())

      if (hoaDonHocSinh.length === 0) {
        rows.push({ hocSinh, hoaDon: null, isFirstOfStudent: true })
      } else {
        hoaDonHocSinh.forEach((hoaDon, index) => {
          rows.push({ hocSinh, hoaDon, isFirstOfStudent: index === 0 })
        })
      }
    }

    return { truong, phuongXa, lopOptions, rows }
  }, [
    filters.truongId,
    filters.q,
    filters.lop,
    filters.ky,
    filters.trangThai,
    filters.hinhThucThanhToan,
    filters.hanTu,
    filters.hanDen,
  ])
}

export type ChiTietData = ReturnType<typeof useChiTietData>
