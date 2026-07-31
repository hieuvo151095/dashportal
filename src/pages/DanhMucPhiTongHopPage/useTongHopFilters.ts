import { useMemo } from 'react'
import { NIEN_KHOA } from '../../mock-data'
import { useUrlFilters } from '../../utils/useUrlFilters'

const DEFAULTS: Record<'xa' | 'truong' | 'nienKhoa' | 'nhomPhi' | 'nguonThu' | 'q' | 'page', string> = {
  xa: '',
  truong: '',
  nienKhoa: NIEN_KHOA,
  nhomPhi: 'all',
  nguonThu: 'all',
  q: '',
  page: '1',
}

export interface TongHopFilters {
  phuongXaIds: string[]
  truongIds: string[]
  nienKhoa: string
  nhomPhi: string
  nguonThu: string
  q: string
}

export interface TongHopFiltersApi extends TongHopFilters {
  page: number
  setPhuongXaIds: (value: string[]) => void
  setTruongIds: (value: string[]) => void
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
// Xã/Phường + Trường lưu dạng chuỗi id nối ',' (mảng rỗng = Tất cả — không dùng sentinel 'all'
// như bản single-select cũ) — mảng phải useMemo theo giá trị chuỗi gốc để giữ tham chiếu ổn
// định giữa các lần render (tránh vòng lặp render vô hạn ở nơi dùng mảng làm dependency).
export function useTongHopFilters(): TongHopFiltersApi {
  const { get, update, reset } = useUrlFilters(DEFAULTS)

  const xaRaw = get('xa')
  const truongRaw = get('truong')
  const phuongXaIds = useMemo(() => (xaRaw === '' ? [] : xaRaw.split(',')), [xaRaw])
  const truongIds = useMemo(() => (truongRaw === '' ? [] : truongRaw.split(',')), [truongRaw])

  return {
    phuongXaIds,
    truongIds,
    nienKhoa: get('nienKhoa'),
    nhomPhi: get('nhomPhi'),
    nguonThu: get('nguonThu'),
    q: get('q'),
    page: Number(get('page')) || 1,
    setPhuongXaIds: (value) => update({ xa: value.join(','), truong: DEFAULTS.truong, page: DEFAULTS.page }),
    setTruongIds: (value) => update({ truong: value.join(','), page: DEFAULTS.page }),
    setNienKhoa: (value) => update({ nienKhoa: value, page: DEFAULTS.page }),
    setNhomPhi: (value) => update({ nhomPhi: value, page: DEFAULTS.page }),
    setNguonThu: (value) => update({ nguonThu: value, page: DEFAULTS.page }),
    setQ: (value) => update({ q: value, page: DEFAULTS.page }),
    setPage: (value) => update({ page: String(value) }),
    apply: (draft) =>
      update({
        xa: draft.phuongXaIds.join(','),
        truong: draft.truongIds.join(','),
        nienKhoa: draft.nienKhoa,
        nhomPhi: draft.nhomPhi,
        nguonThu: draft.nguonThu,
        q: draft.q,
        page: DEFAULTS.page,
      }),
    reset,
  }
}
