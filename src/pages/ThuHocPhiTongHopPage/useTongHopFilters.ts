import { useMemo } from 'react'
import { CAP_HOC_LIST, type CapHoc, type HeThongDoiTac } from '../../mock-data'
import { DEFAULT_KY } from '../../utils/ky'
import { useUrlFilters } from '../../utils/useUrlFilters'

export type TabId = 'tong-quan' | 'da-thanh-toan' | 'mot-phan' | 'chua-thanh-toan'

// Trạng thái tổng hợp theo trường (tab Tổng quan) — suy ra từ Tổng thu so với Tổng số tiền
// phải thu, khác với TrangThaiHoaDon (vốn gắn với từng hoá đơn, dùng ở 3 tab còn lại).
export type TrangThaiTongHop = 'Đã thanh toán' | 'Thanh toán một phần' | 'Chưa thanh toán'

const DEFAULTS: Record<'ky' | 'xa' | 'truong' | 'cap' | 'hinhThuc' | 'heThong' | 'trangThai' | 'tab' | 'page', string> = {
  ky: DEFAULT_KY,
  xa: 'all',
  truong: 'all',
  cap: CAP_HOC_LIST.join(','),
  hinhThuc: 'all',
  heThong: 'all',
  trangThai: 'all',
  tab: 'tong-quan',
  page: '1',
}

export interface TongHopFilters {
  ky: string
  phuongXaId: string
  truongId: string
  capHocList: CapHoc[]
  hinhThucThanhToan: string
  heThong: string
  trangThai: string
}

export interface TongHopFiltersApi extends TongHopFilters {
  tab: TabId
  page: number
  setKy: (value: string) => void
  setPhuongXaId: (value: string) => void
  setTruongId: (value: string) => void
  setCapHocList: (value: CapHoc[]) => void
  setHinhThucThanhToan: (value: string) => void
  setHeThong: (value: string) => void
  setTrangThai: (value: string) => void
  setTab: (value: TabId) => void
  setPage: (value: number) => void
  apply: (draft: TongHopFilters) => void
  reset: () => void
}

// Dùng chung 1 useUrlFilters để cập nhật nhiều key đồng thời trong 1 lần điều hướng
// (vd chọn Xã/Phường phải reset Trường) — tránh đè lẫn nhau như bug đã gặp ở Module 2.
export function useTongHopFilters(): TongHopFiltersApi {
  const { get, update, reset } = useUrlFilters(DEFAULTS)

  // Memo hoá theo giá trị chuỗi để giữ nguyên tham chiếu mảng giữa các lần render —
  // tránh vòng lặp render vô hạn ở nơi dùng capHocList làm dependency (so sánh Object.is).
  const capRaw = get('cap')
  const capHocList = useMemo(() => (capRaw === '' ? [] : capRaw.split(',')) as CapHoc[], [capRaw])

  return {
    ky: get('ky'),
    phuongXaId: get('xa'),
    truongId: get('truong'),
    capHocList,
    hinhThucThanhToan: get('hinhThuc'),
    heThong: get('heThong') as HeThongDoiTac | 'all',
    trangThai: get('trangThai') as TrangThaiTongHop | 'all',
    tab: get('tab') as TabId,
    page: Number(get('page')) || 1,
    setKy: (value) => update({ ky: value, page: DEFAULTS.page }),
    setPhuongXaId: (value) => update({ xa: value, truong: DEFAULTS.truong, page: DEFAULTS.page }),
    setTruongId: (value) => update({ truong: value, page: DEFAULTS.page }),
    setCapHocList: (value) => update({ cap: value.join(','), page: DEFAULTS.page }),
    setHinhThucThanhToan: (value) => update({ hinhThuc: value, page: DEFAULTS.page }),
    setHeThong: (value) => update({ heThong: value, page: DEFAULTS.page }),
    setTrangThai: (value) => update({ trangThai: value, page: DEFAULTS.page }),
    setTab: (value) => update({ tab: value, page: DEFAULTS.page }),
    setPage: (value) => update({ page: String(value) }),
    apply: (draft) =>
      update({
        ky: draft.ky,
        xa: draft.phuongXaId,
        truong: draft.truongId,
        cap: draft.capHocList.join(','),
        hinhThuc: draft.hinhThucThanhToan,
        heThong: draft.heThong,
        trangThai: draft.trangThai,
        page: DEFAULTS.page,
      }),
    reset,
  }
}
