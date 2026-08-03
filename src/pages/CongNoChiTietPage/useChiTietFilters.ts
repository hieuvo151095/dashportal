import { useMemo } from 'react'
import { mockDataset, type NhomTuoiNo } from '../../mock-data'
import { NHOM_TUOI_NO_LIST } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import { useUrlFilters } from '../../utils/useUrlFilters'

const KY_OPTIONS = getKyOptions()
const DEFAULT_TRUONG_ID = mockDataset.truongList[0]?.id ?? ''

const DEFAULTS: Record<
  'truong' | 'q' | 'khoi' | 'lop' | 'kyTu' | 'kyDen' | 'hanTu' | 'hanDen' | 'nhomTuoiNo' | 'page',
  string
> = {
  truong: DEFAULT_TRUONG_ID,
  q: '',
  khoi: '',
  lop: '',
  kyTu: KY_OPTIONS[0],
  kyDen: KY_OPTIONS[KY_OPTIONS.length - 1],
  hanTu: '',
  hanDen: '',
  nhomTuoiNo: NHOM_TUOI_NO_LIST.join(','),
  page: '1',
}

export interface ChiTietFilters {
  q: string
  khoiList: string[]
  lopList: string[]
  kyTu: string
  kyDen: string
  hanTu: string
  hanDen: string
  nhomTuoiNoList: NhomTuoiNo[]
}

export interface ChiTietFiltersApi extends ChiTietFilters {
  truongId: string
  page: number
  setTruongId: (value: string) => void
  setQ: (value: string) => void
  setKhoiList: (value: string[]) => void
  setLopList: (value: string[]) => void
  setKyTu: (value: string) => void
  setKyDen: (value: string) => void
  setHanTu: (value: string) => void
  setHanDen: (value: string) => void
  setNhomTuoiNoList: (value: NhomTuoiNo[]) => void
  setPage: (value: number) => void
  apply: (draft: ChiTietFilters) => void
  reset: () => void
}

// Dùng chung 1 useUrlFilters — đổi Trường phải reset Khối+Lớp, đổi Khối phải reset Lớp,
// trong cùng 1 lần điều hướng (xem ghi chú tương tự ở Module 2/3).
// Khối/Lớp: mảng rỗng = Tất cả — options của 2 filter này phụ thuộc Trường đang chọn (dữ liệu
// động), nên không thể dùng quy ước "mặc định chọn đủ danh sách" (không biết trước danh sách
// đó lúc khai báo DEFAULTS). Nhóm tuổi nợ: enum cố định (NHOM_TUOI_NO_LIST) — dùng quy ước
// "mặc định chọn đủ cả danh sách = Tất cả" giống capHocList, đồng bộ với 4.1.
export function useChiTietFilters(): ChiTietFiltersApi {
  const { get, update } = useUrlFilters(DEFAULTS)

  const khoiRaw = get('khoi')
  const lopRaw = get('lop')
  const nhomTuoiNoRaw = get('nhomTuoiNo')
  const khoiList = useMemo(() => (khoiRaw === '' ? [] : khoiRaw.split(',')), [khoiRaw])
  const lopList = useMemo(() => (lopRaw === '' ? [] : lopRaw.split(',')), [lopRaw])
  const nhomTuoiNoList = useMemo(
    () => (nhomTuoiNoRaw === '' ? [] : (nhomTuoiNoRaw.split(',') as NhomTuoiNo[])),
    [nhomTuoiNoRaw],
  )

  return {
    truongId: get('truong'),
    q: get('q'),
    khoiList,
    lopList,
    kyTu: get('kyTu'),
    kyDen: get('kyDen'),
    hanTu: get('hanTu'),
    hanDen: get('hanDen'),
    nhomTuoiNoList,
    page: Number(get('page')) || 1,
    // Chọn trường (SchoolHeader) là điều hướng ngữ cảnh trang, áp dụng ngay — không qua draft.
    setTruongId: (value) => update({ truong: value, khoi: DEFAULTS.khoi, lop: DEFAULTS.lop, page: DEFAULTS.page }),
    setQ: (value) => update({ q: value }),
    setKhoiList: (value) => update({ khoi: value.join(','), lop: DEFAULTS.lop }),
    setLopList: (value) => update({ lop: value.join(',') }),
    setKyTu: (value) => update({ kyTu: value }),
    setKyDen: (value) => update({ kyDen: value }),
    setHanTu: (value) => update({ hanTu: value }),
    setHanDen: (value) => update({ hanDen: value }),
    setNhomTuoiNoList: (value) => update({ nhomTuoiNo: value.join(',') }),
    setPage: (value) => update({ page: String(value) }),
    apply: (draft) =>
      update({
        q: draft.q,
        khoi: draft.khoiList.join(','),
        lop: draft.lopList.join(','),
        kyTu: draft.kyTu,
        kyDen: draft.kyDen,
        hanTu: draft.hanTu,
        hanDen: draft.hanDen,
        nhomTuoiNo: draft.nhomTuoiNoList.join(','),
        page: DEFAULTS.page,
      }),
    // "Làm mới" chỉ reset field của FilterBar — không đụng trường đang chọn (truongId).
    reset: () =>
      update({
        q: DEFAULTS.q,
        khoi: DEFAULTS.khoi,
        lop: DEFAULTS.lop,
        kyTu: DEFAULTS.kyTu,
        kyDen: DEFAULTS.kyDen,
        hanTu: DEFAULTS.hanTu,
        hanDen: DEFAULTS.hanDen,
        nhomTuoiNo: DEFAULTS.nhomTuoiNo,
        page: DEFAULTS.page,
      }),
  }
}
