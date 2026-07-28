import { getKyOptions } from '../../utils/ky'
import { useUrlFilters } from '../../utils/useUrlFilters'

const KY_OPTIONS = getKyOptions()

const DEFAULTS: Record<'xa' | 'truong' | 'kyTu' | 'kyDen' | 'nhomTuoiNo', string> = {
  xa: 'all',
  truong: 'all',
  kyTu: KY_OPTIONS[0],
  kyDen: KY_OPTIONS[KY_OPTIONS.length - 1],
  nhomTuoiNo: 'all',
}

export interface TongHopFilters {
  phuongXaId: string
  truongId: string
  kyTu: string
  kyDen: string
  nhomTuoiNo: string
}

export interface TongHopFiltersApi extends TongHopFilters {
  setPhuongXaId: (value: string) => void
  setTruongId: (value: string) => void
  setKyTu: (value: string) => void
  setKyDen: (value: string) => void
  setNhomTuoiNo: (value: string) => void
  apply: (draft: TongHopFilters) => void
  reset: () => void
}

// Dùng chung 1 useUrlFilters để cập nhật nhiều key đồng thời trong 1 lần điều hướng
// (chọn Xã/Phường phải reset Trường) — tránh đè lẫn nhau (xem ghi chú ở Module 2/3).
export function useTongHopFilters(): TongHopFiltersApi {
  const { get, update, reset } = useUrlFilters(DEFAULTS)

  return {
    phuongXaId: get('xa'),
    truongId: get('truong'),
    kyTu: get('kyTu'),
    kyDen: get('kyDen'),
    nhomTuoiNo: get('nhomTuoiNo'),
    setPhuongXaId: (value) => update({ xa: value, truong: DEFAULTS.truong }),
    setTruongId: (value) => update({ truong: value }),
    setKyTu: (value) => update({ kyTu: value }),
    setKyDen: (value) => update({ kyDen: value }),
    setNhomTuoiNo: (value) => update({ nhomTuoiNo: value }),
    apply: (draft) =>
      update({
        xa: draft.phuongXaId,
        truong: draft.truongId,
        kyTu: draft.kyTu,
        kyDen: draft.kyDen,
        nhomTuoiNo: draft.nhomTuoiNo,
      }),
    reset,
  }
}
