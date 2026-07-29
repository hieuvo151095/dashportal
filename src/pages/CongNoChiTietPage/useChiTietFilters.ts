import { mockDataset } from '../../mock-data'
import { getKyOptions } from '../../utils/ky'
import { useUrlFilters } from '../../utils/useUrlFilters'

const KY_OPTIONS = getKyOptions()
const DEFAULT_TRUONG_ID = mockDataset.truongList[0]?.id ?? ''

const DEFAULTS: Record<'truong' | 'q' | 'khoi' | 'lop' | 'kyTu' | 'kyDen' | 'nhomTuoiNo', string> = {
  truong: DEFAULT_TRUONG_ID,
  q: '',
  khoi: 'all',
  lop: 'all',
  kyTu: KY_OPTIONS[0],
  kyDen: KY_OPTIONS[KY_OPTIONS.length - 1],
  nhomTuoiNo: 'all',
}

export interface ChiTietFilters {
  q: string
  khoi: string
  lop: string
  kyTu: string
  kyDen: string
  nhomTuoiNo: string
}

export interface ChiTietFiltersApi extends ChiTietFilters {
  truongId: string
  setTruongId: (value: string) => void
  setQ: (value: string) => void
  setKhoi: (value: string) => void
  setLop: (value: string) => void
  setKyTu: (value: string) => void
  setKyDen: (value: string) => void
  setNhomTuoiNo: (value: string) => void
  apply: (draft: ChiTietFilters) => void
  reset: () => void
}

// Dùng chung 1 useUrlFilters — đổi Trường phải reset Khối+Lớp, đổi Khối phải reset Lớp,
// trong cùng 1 lần điều hướng (xem ghi chú tương tự ở Module 2/3).
export function useChiTietFilters(): ChiTietFiltersApi {
  const { get, update } = useUrlFilters(DEFAULTS)

  return {
    truongId: get('truong'),
    q: get('q'),
    khoi: get('khoi'),
    lop: get('lop'),
    kyTu: get('kyTu'),
    kyDen: get('kyDen'),
    nhomTuoiNo: get('nhomTuoiNo'),
    // Chọn trường (SchoolHeader) là điều hướng ngữ cảnh trang, áp dụng ngay — không qua draft.
    setTruongId: (value) => update({ truong: value, khoi: DEFAULTS.khoi, lop: DEFAULTS.lop }),
    setQ: (value) => update({ q: value }),
    setKhoi: (value) => update({ khoi: value, lop: DEFAULTS.lop }),
    setLop: (value) => update({ lop: value }),
    setKyTu: (value) => update({ kyTu: value }),
    setKyDen: (value) => update({ kyDen: value }),
    setNhomTuoiNo: (value) => update({ nhomTuoiNo: value }),
    apply: (draft) =>
      update({
        q: draft.q,
        khoi: draft.khoi,
        lop: draft.lop,
        kyTu: draft.kyTu,
        kyDen: draft.kyDen,
        nhomTuoiNo: draft.nhomTuoiNo,
      }),
    // "Làm mới" chỉ reset field của FilterBar — không đụng trường đang chọn (truongId).
    reset: () =>
      update({
        q: DEFAULTS.q,
        khoi: DEFAULTS.khoi,
        lop: DEFAULTS.lop,
        kyTu: DEFAULTS.kyTu,
        kyDen: DEFAULTS.kyDen,
        nhomTuoiNo: DEFAULTS.nhomTuoiNo,
      }),
  }
}
