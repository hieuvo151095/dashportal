import { useMemo } from 'react'
import { NHOM_TUOI_NO_LIST } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import { useUrlFilters } from '../../utils/useUrlFilters'
import type { NhomTuoiNo } from '../../mock-data'

const KY_OPTIONS = getKyOptions()

const DEFAULTS: Record<'xa' | 'truong' | 'kyTu' | 'kyDen' | 'nhomTuoiNo' | 'q' | 'page', string> = {
  xa: '',
  truong: '',
  kyTu: KY_OPTIONS[0],
  kyDen: KY_OPTIONS[KY_OPTIONS.length - 1],
  nhomTuoiNo: NHOM_TUOI_NO_LIST.join(','),
  q: '',
  page: '1',
}

export interface TongHopFilters {
  phuongXaIds: string[]
  truongIds: string[]
  kyTu: string
  kyDen: string
  nhomTuoiNoList: NhomTuoiNo[]
  q: string
}

export interface TongHopFiltersApi extends TongHopFilters {
  page: number
  setPhuongXaIds: (value: string[]) => void
  setTruongIds: (value: string[]) => void
  setKyTu: (value: string) => void
  setKyDen: (value: string) => void
  setNhomTuoiNoList: (value: NhomTuoiNo[]) => void
  setQ: (value: string) => void
  setPage: (value: number) => void
  apply: (draft: TongHopFilters) => void
  reset: () => void
}

// Dùng chung 1 useUrlFilters để cập nhật nhiều key đồng thời trong 1 lần điều hướng (chọn
// Xã/Phường phải reset Trường) — tránh đè lẫn nhau (xem ghi chú ở Module 2/3).
// Trường/Xã-Phường: mảng rỗng = Tất cả (danh sách dài, SearchableMultiCombobox). Nhóm tuổi nợ:
// mặc định chọn đủ danh sách = Tất cả, giống quy ước capHocList (danh sách ngắn, Dropdown
// multiselect thường).
export function useTongHopFilters(): TongHopFiltersApi {
  const { get, update, reset } = useUrlFilters(DEFAULTS)

  const xaRaw = get('xa')
  const truongRaw = get('truong')
  const nhomTuoiNoRaw = get('nhomTuoiNo')
  const phuongXaIds = useMemo(() => (xaRaw === '' ? [] : xaRaw.split(',')), [xaRaw])
  const truongIds = useMemo(() => (truongRaw === '' ? [] : truongRaw.split(',')), [truongRaw])
  const nhomTuoiNoList = useMemo(
    () => (nhomTuoiNoRaw === '' ? [] : (nhomTuoiNoRaw.split(',') as NhomTuoiNo[])),
    [nhomTuoiNoRaw],
  )

  return {
    phuongXaIds,
    truongIds,
    kyTu: get('kyTu'),
    kyDen: get('kyDen'),
    nhomTuoiNoList,
    q: get('q'),
    page: Number(get('page')) || 1,
    setPhuongXaIds: (value) => update({ xa: value.join(','), truong: DEFAULTS.truong, page: DEFAULTS.page }),
    setTruongIds: (value) => update({ truong: value.join(','), page: DEFAULTS.page }),
    setKyTu: (value) => update({ kyTu: value, page: DEFAULTS.page }),
    setKyDen: (value) => update({ kyDen: value, page: DEFAULTS.page }),
    setNhomTuoiNoList: (value) => update({ nhomTuoiNo: value.join(','), page: DEFAULTS.page }),
    setQ: (value) => update({ q: value, page: DEFAULTS.page }),
    setPage: (value) => update({ page: String(value) }),
    apply: (draft) =>
      update({
        xa: draft.phuongXaIds.join(','),
        truong: draft.truongIds.join(','),
        kyTu: draft.kyTu,
        kyDen: draft.kyDen,
        nhomTuoiNo: draft.nhomTuoiNoList.join(','),
        q: draft.q,
        page: DEFAULTS.page,
      }),
    reset,
  }
}
