import { NIEN_KHOA, mockDataset } from '../../mock-data'
import { useUrlFilters } from '../../utils/useUrlFilters'

const DEFAULT_TRUONG_ID = mockDataset.truongList[0]?.id ?? ''

const DEFAULTS: Record<'truong' | 'tenPhi' | 'maPhi' | 'nguonThu' | 'nhomPhi' | 'nienKhoa', string> = {
  truong: DEFAULT_TRUONG_ID,
  tenPhi: '',
  maPhi: '',
  nguonThu: 'all',
  nhomPhi: 'all',
  nienKhoa: NIEN_KHOA,
}

export interface ChiTietFilters {
  tenPhi: string
  maPhi: string
  nguonThu: string
  nhomPhi: string
  nienKhoa: string
}

export interface ChiTietFiltersApi extends ChiTietFilters {
  truongId: string
  setTruongId: (value: string) => void
  setTenPhi: (value: string) => void
  setMaPhi: (value: string) => void
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
    tenPhi: get('tenPhi'),
    maPhi: get('maPhi'),
    nguonThu: get('nguonThu'),
    nhomPhi: get('nhomPhi'),
    nienKhoa: get('nienKhoa'),
    // Chọn trường (SchoolHeader) là điều hướng ngữ cảnh trang, áp dụng ngay — không qua draft.
    setTruongId: (value) => update({ truong: value }),
    setTenPhi: (value) => update({ tenPhi: value }),
    setMaPhi: (value) => update({ maPhi: value }),
    setNguonThu: (value) => update({ nguonThu: value }),
    setNhomPhi: (value) => update({ nhomPhi: value }),
    setNienKhoa: (value) => update({ nienKhoa: value }),
    apply: (draft) =>
      update({
        tenPhi: draft.tenPhi,
        maPhi: draft.maPhi,
        nguonThu: draft.nguonThu,
        nhomPhi: draft.nhomPhi,
        nienKhoa: draft.nienKhoa,
      }),
    // "Làm mới" chỉ reset các field của FilterBar — không đụng đến trường đang chọn
    // (truongId là ngữ cảnh trang, chọn ở SchoolHeader, không phải 1 filter).
    reset: () =>
      update({
        tenPhi: DEFAULTS.tenPhi,
        maPhi: DEFAULTS.maPhi,
        nguonThu: DEFAULTS.nguonThu,
        nhomPhi: DEFAULTS.nhomPhi,
        nienKhoa: DEFAULTS.nienKhoa,
      }),
  }
}
