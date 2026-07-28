import { NIEN_KHOA } from '../../mock-data'
import { useUrlFilters } from '../../utils/useUrlFilters'

const DEFAULTS: Record<'xa' | 'truong' | 'nienKhoa' | 'nhomPhi' | 'nguonThu' | 'q' | 'page', string> = {
  xa: 'all',
  truong: 'all',
  nienKhoa: NIEN_KHOA,
  nhomPhi: 'all',
  nguonThu: 'all',
  q: '',
  page: '1',
}

export interface TongHopFilters {
  phuongXaId: string
  truongId: string
  nienKhoa: string
  nhomPhi: string
  nguonThu: string
  q: string
}

export interface TongHopFiltersApi extends TongHopFilters {
  page: number
  setPhuongXaId: (value: string) => void
  setTruongId: (value: string) => void
  setNienKhoa: (value: string) => void
  setNhomPhi: (value: string) => void
  setNguonThu: (value: string) => void
  setQ: (value: string) => void
  setPage: (value: number) => void
  apply: (draft: TongHopFilters) => void
  reset: () => void
}

// Dùng chung 1 useUrlFilters cho toàn bộ filter — vì các filter cần cập nhật đồng thời
// (vd chọn Xã/Phường phải reset Trường + trang) trong 1 lần điều hướng, gọi setSearchParams
// nhiều lần liên tiếp trong cùng 1 handler sẽ đè lẫn nhau.
export function useTongHopFilters(): TongHopFiltersApi {
  const { get, update, reset } = useUrlFilters(DEFAULTS)

  return {
    phuongXaId: get('xa'),
    truongId: get('truong'),
    nienKhoa: get('nienKhoa'),
    nhomPhi: get('nhomPhi'),
    nguonThu: get('nguonThu'),
    q: get('q'),
    page: Number(get('page')) || 1,
    setPhuongXaId: (value) => update({ xa: value, truong: DEFAULTS.truong, page: DEFAULTS.page }),
    setTruongId: (value) => update({ truong: value, page: DEFAULTS.page }),
    setNienKhoa: (value) => update({ nienKhoa: value, page: DEFAULTS.page }),
    setNhomPhi: (value) => update({ nhomPhi: value, page: DEFAULTS.page }),
    setNguonThu: (value) => update({ nguonThu: value, page: DEFAULTS.page }),
    setQ: (value) => update({ q: value, page: DEFAULTS.page }),
    setPage: (value) => update({ page: String(value) }),
    apply: (draft) =>
      update({
        xa: draft.phuongXaId,
        truong: draft.truongId,
        nienKhoa: draft.nienKhoa,
        nhomPhi: draft.nhomPhi,
        nguonThu: draft.nguonThu,
        q: draft.q,
        page: DEFAULTS.page,
      }),
    reset,
  }
}
