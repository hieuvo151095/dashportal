import { useMemo } from 'react'
import {
  CAP_HOC_LIST,
  HE_THONG_DOI_TAC_LIST,
  HINH_THUC_THANH_TOAN_LIST,
  type CapHoc,
  type HeThongDoiTac,
  type HinhThucThanhToan,
} from '../../mock-data'
import { DEFAULT_KY } from '../../utils/ky'
import { useUrlFilters } from '../../utils/useUrlFilters'

export type TabId = 'tong-quan' | 'da-thanh-toan' | 'mot-phan' | 'chua-thanh-toan'

// Trạng thái tổng hợp theo trường (tab Tổng quan) — suy ra từ Tổng thu so với Tổng số tiền
// phải thu, khác với TrangThaiHoaDon (vốn gắn với từng hoá đơn, dùng ở 3 tab còn lại).
export type TrangThaiTongHop = 'Đã thanh toán' | 'Thanh toán một phần' | 'Chưa thanh toán'
export const TRANG_THAI_TONG_HOP_LIST: TrangThaiTongHop[] = [
  'Đã thanh toán',
  'Thanh toán một phần',
  'Chưa thanh toán',
]

const DEFAULTS: Record<
  'ky' | 'xa' | 'truong' | 'cap' | 'hinhThuc' | 'heThong' | 'trangThai' | 'q' | 'tab' | 'page',
  string
> = {
  ky: DEFAULT_KY,
  xa: '',
  truong: '',
  cap: CAP_HOC_LIST.join(','),
  hinhThuc: HINH_THUC_THANH_TOAN_LIST.join(','),
  heThong: HE_THONG_DOI_TAC_LIST.join(','),
  trangThai: TRANG_THAI_TONG_HOP_LIST.join(','),
  q: '',
  tab: 'tong-quan',
  page: '1',
}

export interface TongHopFilters {
  ky: string
  phuongXaIds: string[]
  truongIds: string[]
  capHocList: CapHoc[]
  hinhThucThanhToanList: HinhThucThanhToan[]
  heThongList: HeThongDoiTac[]
  trangThaiList: TrangThaiTongHop[]
  q: string
}

export interface TongHopFiltersApi extends TongHopFilters {
  tab: TabId
  page: number
  setKy: (value: string) => void
  setPhuongXaIds: (value: string[]) => void
  setTruongIds: (value: string[]) => void
  setCapHocList: (value: CapHoc[]) => void
  setHinhThucThanhToanList: (value: HinhThucThanhToan[]) => void
  setHeThongList: (value: HeThongDoiTac[]) => void
  setTrangThaiList: (value: TrangThaiTongHop[]) => void
  setQ: (value: string) => void
  setTab: (value: TabId) => void
  setPage: (value: number) => void
  apply: (draft: TongHopFilters) => void
  reset: () => void
}

// Dùng chung 1 useUrlFilters để cập nhật nhiều key đồng thời trong 1 lần điều hướng
// (vd chọn Xã/Phường phải reset Trường) — tránh đè lẫn nhau như bug đã gặp ở Module 2.
// Trường/Xã-Phường: mảng rỗng = Tất cả (danh sách dài, xem SearchableMultiCombobox).
// Hình thức/Hệ thống/Trạng thái: mặc định chọn đủ cả danh sách = Tất cả, giống hệt quy ước
// capHocList đã có sẵn (danh sách ngắn, Dropdown multiselect thường).
export function useTongHopFilters(): TongHopFiltersApi {
  const { get, update, reset } = useUrlFilters(DEFAULTS)

  const xaRaw = get('xa')
  const truongRaw = get('truong')
  const capRaw = get('cap')
  const hinhThucRaw = get('hinhThuc')
  const heThongRaw = get('heThong')
  const trangThaiRaw = get('trangThai')

  const phuongXaIds = useMemo(() => (xaRaw === '' ? [] : xaRaw.split(',')), [xaRaw])
  const truongIds = useMemo(() => (truongRaw === '' ? [] : truongRaw.split(',')), [truongRaw])
  const capHocList = useMemo(() => (capRaw === '' ? [] : (capRaw.split(',') as CapHoc[])), [capRaw])
  const hinhThucThanhToanList = useMemo(
    () => (hinhThucRaw === '' ? [] : (hinhThucRaw.split(',') as HinhThucThanhToan[])),
    [hinhThucRaw],
  )
  const heThongList = useMemo(
    () => (heThongRaw === '' ? [] : (heThongRaw.split(',') as HeThongDoiTac[])),
    [heThongRaw],
  )
  const trangThaiList = useMemo(
    () => (trangThaiRaw === '' ? [] : (trangThaiRaw.split(',') as TrangThaiTongHop[])),
    [trangThaiRaw],
  )

  return {
    ky: get('ky'),
    phuongXaIds,
    truongIds,
    capHocList,
    hinhThucThanhToanList,
    heThongList,
    trangThaiList,
    q: get('q'),
    tab: get('tab') as TabId,
    page: Number(get('page')) || 1,
    setKy: (value) => update({ ky: value, page: DEFAULTS.page }),
    setPhuongXaIds: (value) => update({ xa: value.join(','), truong: DEFAULTS.truong, page: DEFAULTS.page }),
    setTruongIds: (value) => update({ truong: value.join(','), page: DEFAULTS.page }),
    setCapHocList: (value) => update({ cap: value.join(','), page: DEFAULTS.page }),
    setHinhThucThanhToanList: (value) => update({ hinhThuc: value.join(','), page: DEFAULTS.page }),
    setHeThongList: (value) => update({ heThong: value.join(','), page: DEFAULTS.page }),
    setTrangThaiList: (value) => update({ trangThai: value.join(','), page: DEFAULTS.page }),
    setQ: (value) => update({ q: value, page: DEFAULTS.page }),
    setTab: (value) => update({ tab: value, page: DEFAULTS.page }),
    setPage: (value) => update({ page: String(value) }),
    apply: (draft) =>
      update({
        ky: draft.ky,
        xa: draft.phuongXaIds.join(','),
        truong: draft.truongIds.join(','),
        cap: draft.capHocList.join(','),
        hinhThuc: draft.hinhThucThanhToanList.join(','),
        heThong: draft.heThongList.join(','),
        trangThai: draft.trangThaiList.join(','),
        q: draft.q,
        page: DEFAULTS.page,
      }),
    reset,
  }
}
