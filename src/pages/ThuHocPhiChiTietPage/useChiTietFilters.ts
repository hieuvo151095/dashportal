import { mockDataset } from '../../mock-data'
import { useUrlFilters } from '../../utils/useUrlFilters'

const DEFAULT_TRUONG_ID = mockDataset.truongList[0]?.id ?? ''

const DEFAULTS: Record<'truong' | 'q' | 'lop' | 'ky' | 'trangThai' | 'hinhThuc' | 'hanTu' | 'hanDen', string> = {
  truong: DEFAULT_TRUONG_ID,
  q: '',
  lop: 'all',
  ky: 'all',
  trangThai: 'all',
  hinhThuc: 'all',
  hanTu: '',
  hanDen: '',
}

export interface ChiTietFilters {
  q: string
  lop: string
  ky: string
  trangThai: string
  hinhThucThanhToan: string
  hanTu: string
  hanDen: string
}

export interface ChiTietFiltersApi extends ChiTietFilters {
  truongId: string
  setTruongId: (value: string) => void
  setQ: (value: string) => void
  setLop: (value: string) => void
  setKy: (value: string) => void
  setTrangThai: (value: string) => void
  setHinhThucThanhToan: (value: string) => void
  setHanTu: (value: string) => void
  setHanDen: (value: string) => void
  apply: (draft: ChiTietFilters) => void
  reset: () => void
}

// Dùng chung 1 useUrlFilters — chọn Trường khác phải reset Lớp trong cùng 1 lần điều
// hướng (xem ghi chú tương tự ở Module 2/3.1).
export function useChiTietFilters(): ChiTietFiltersApi {
  const { get, update } = useUrlFilters(DEFAULTS)

  return {
    truongId: get('truong'),
    q: get('q'),
    lop: get('lop'),
    ky: get('ky'),
    trangThai: get('trangThai'),
    hinhThucThanhToan: get('hinhThuc'),
    hanTu: get('hanTu'),
    hanDen: get('hanDen'),
    // Chọn trường (SchoolHeader) là điều hướng ngữ cảnh trang, áp dụng ngay — không qua draft.
    setTruongId: (value) => update({ truong: value, lop: DEFAULTS.lop }),
    setQ: (value) => update({ q: value }),
    setLop: (value) => update({ lop: value }),
    setKy: (value) => update({ ky: value }),
    setTrangThai: (value) => update({ trangThai: value }),
    setHinhThucThanhToan: (value) => update({ hinhThuc: value }),
    setHanTu: (value) => update({ hanTu: value }),
    setHanDen: (value) => update({ hanDen: value }),
    apply: (draft) =>
      update({
        q: draft.q,
        lop: draft.lop,
        ky: draft.ky,
        trangThai: draft.trangThai,
        hinhThuc: draft.hinhThucThanhToan,
        hanTu: draft.hanTu,
        hanDen: draft.hanDen,
      }),
    // "Làm mới" chỉ reset field của FilterBar — không đụng trường đang chọn (truongId).
    reset: () =>
      update({
        q: DEFAULTS.q,
        lop: DEFAULTS.lop,
        ky: DEFAULTS.ky,
        trangThai: DEFAULTS.trangThai,
        hinhThuc: DEFAULTS.hinhThuc,
        hanTu: DEFAULTS.hanTu,
        hanDen: DEFAULTS.hanDen,
      }),
  }
}
