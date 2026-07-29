import { NIEN_KHOA, mockDataset } from '../../mock-data'
import { useUrlFilters } from '../../utils/useUrlFilters'

const DEFAULT_TRUONG_ID = mockDataset.truongList[0]?.id ?? ''

const DEFAULTS: Record<'truong' | 'q' | 'nguonThu' | 'nhomPhi' | 'nienKhoa', string> = {
  truong: DEFAULT_TRUONG_ID,
  q: '',
  nguonThu: 'all',
  nhomPhi: 'all',
  nienKhoa: NIEN_KHOA,
}

export interface ChiTietFilters {
  q: string
  nguonThu: string
  nhomPhi: string
  nienKhoa: string
}

export interface ChiTietFiltersApi extends ChiTietFilters {
  truongId: string
  setTruongId: (value: string) => void
  setQ: (value: string) => void
  setNguonThu: (value: string) => void
  setNhomPhi: (value: string) => void
  setNienKhoa: (value: string) => void
  apply: (draft: ChiTietFilters) => void
  reset: () => void
}

export function useChiTietFilters(): ChiTietFiltersApi {
  const { get, update } = useUrlFilters(DEFAULTS)

  return {
    truongId: get('truong'),
    q: get('q'),
    nguonThu: get('nguonThu'),
    nhomPhi: get('nhomPhi'),
    nienKhoa: get('nienKhoa'),
    // Chọn trường (SchoolHeader) là điều hướng ngữ cảnh trang, áp dụng ngay — không qua draft.
    setTruongId: (value) => update({ truong: value }),
    setQ: (value) => update({ q: value }),
    setNguonThu: (value) => update({ nguonThu: value }),
    setNhomPhi: (value) => update({ nhomPhi: value }),
    setNienKhoa: (value) => update({ nienKhoa: value }),
    apply: (draft) =>
      update({
        q: draft.q,
        nguonThu: draft.nguonThu,
        nhomPhi: draft.nhomPhi,
        nienKhoa: draft.nienKhoa,
      }),
    // "Làm mới" chỉ reset các field của FilterBar — không đụng đến trường đang chọn
    // (truongId là ngữ cảnh trang, chọn ở SchoolHeader, không phải 1 filter).
    reset: () =>
      update({
        q: DEFAULTS.q,
        nguonThu: DEFAULTS.nguonThu,
        nhomPhi: DEFAULTS.nhomPhi,
        nienKhoa: DEFAULTS.nienKhoa,
      }),
  }
}
