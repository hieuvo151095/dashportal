import { useMemo } from 'react'
import { mockDataset, type HoaDon, type HocSinh } from '../../mock-data'
import { nhomTuoiNoCua, soNgayQuaHan } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import type { ChiTietFiltersApi } from './useChiTietFilters'

const KY_OPTIONS = getKyOptions()
const KY_INDEX = new Map(KY_OPTIONS.map((ky, index) => [ky, index]))

const LY_DO_NO_LIST = [
  'Phụ huynh chưa thanh toán',
  'Đang chờ xác nhận chuyển khoản',
  'Học sinh tạm nghỉ học',
  'Gia đình xin gia hạn đóng phí',
  'Chưa liên hệ được phụ huynh',
  'Hồ sơ miễn giảm đang chờ duyệt',
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function lyDoNoCua(hoaDon: HoaDon): string {
  return LY_DO_NO_LIST[hashString(hoaDon.id) % LY_DO_NO_LIST.length]
}

function trongPhamViKy(ky: string, kyTu: string, kyDen: string): boolean {
  const idx = KY_INDEX.get(ky)
  if (idx === undefined) return true
  const idxTu = KY_INDEX.get(kyTu) ?? 0
  const idxDen = KY_INDEX.get(kyDen) ?? KY_OPTIONS.length - 1
  return idx >= idxTu && idx <= idxDen
}

export interface DebtRow {
  hocSinh: HocSinh
  hoaDon: HoaDon
  soNgayQuaHan: number
  nhomTuoiNo: ReturnType<typeof nhomTuoiNoCua>
  lyDoNo: string
}

export function useChiTietData(filters: ChiTietFiltersApi) {
  return useMemo(() => {
    const { truongList, phuongXaList, hocSinhList, hoaDonList } = mockDataset

    const truong = truongList.find((t) => t.id === filters.truongId)
    const phuongXa = truong ? phuongXaList.find((px) => px.id === truong.phuongXaId) : undefined

    const hocSinhTruong = hocSinhList.filter((hs) => hs.truongId === filters.truongId)
    const khoiOptions = [...new Set(hocSinhTruong.map((hs) => hs.khoi))].sort((a, b) => a.localeCompare(b, 'vi'))

    // Map khối → danh sách lớp (không phụ thuộc draft.khoiList đang chọn) — FilterBar dùng map
    // này để tính lại option Lớp hiển thị + cascading (bỏ lớp không còn thuộc khối mới chọn)
    // mà không cần truy cập thẳng dữ liệu học sinh thô.
    const lopOptionsTheoKhoi: Record<string, string[]> = {}
    for (const khoi of khoiOptions) {
      lopOptionsTheoKhoi[khoi] = [...new Set(hocSinhTruong.filter((hs) => hs.khoi === khoi).map((hs) => hs.lop))].sort(
        (a, b) => a.localeCompare(b, 'vi'),
      )
    }
    const hocSinhById = new Map<string, HocSinh>(hocSinhTruong.map((hs) => [hs.id, hs]))
    const q = filters.q.trim().toLowerCase()

    const rows: DebtRow[] = hoaDonList
      .filter((hd) => hd.truongId === filters.truongId && hd.trangThai !== 'Đã thanh toán')
      .filter((hd) => trongPhamViKy(hd.ky, filters.kyTu, filters.kyDen))
      .filter((hd) => !filters.hanTu || hd.hanThanhToan >= filters.hanTu)
      .filter((hd) => !filters.hanDen || hd.hanThanhToan <= `${filters.hanDen}T23:59:59`)
      .map((hoaDon) => ({ hoaDon, hocSinh: hocSinhById.get(hoaDon.hocSinhId) }))
      .filter((row): row is { hoaDon: HoaDon; hocSinh: HocSinh } => Boolean(row.hocSinh))
      .filter((row) => filters.khoiList.length === 0 || filters.khoiList.includes(row.hocSinh.khoi))
      .filter((row) => filters.lopList.length === 0 || filters.lopList.includes(row.hocSinh.lop))
      .filter(
        (row) =>
          !q || row.hocSinh.maHocSinh.toLowerCase().includes(q) || row.hocSinh.hoTen.toLowerCase().includes(q),
      )
      .map((row) => ({
        hocSinh: row.hocSinh,
        hoaDon: row.hoaDon,
        soNgayQuaHan: soNgayQuaHan(row.hoaDon.hanThanhToan),
        nhomTuoiNo: nhomTuoiNoCua(row.hoaDon),
        lyDoNo: lyDoNoCua(row.hoaDon),
      }))
      .filter((row) => filters.nhomTuoiNo === 'all' || row.nhomTuoiNo === filters.nhomTuoiNo)
      .sort((a, b) => b.soNgayQuaHan - a.soNgayQuaHan)

    return { truong, phuongXa, khoiOptions, lopOptionsTheoKhoi, rows }
  }, [
    filters.truongId,
    filters.q,
    filters.khoiList,
    filters.lopList,
    filters.kyTu,
    filters.kyDen,
    filters.hanTu,
    filters.hanDen,
    filters.nhomTuoiNo,
  ])
}

export type ChiTietData = ReturnType<typeof useChiTietData>
