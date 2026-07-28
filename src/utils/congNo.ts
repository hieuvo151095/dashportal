import { TODAY, type HoaDon, type NhomTuoiNo } from '../mock-data'

export const NHOM_TUOI_NO_LIST: NhomTuoiNo[] = ['≤30 ngày', '31–60 ngày', '61–90 ngày', '>90 ngày']

export function soNgayQuaHan(hanThanhToan: string): number {
  const han = new Date(hanThanhToan)
  const diffMs = TODAY.getTime() - han.getTime()
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
}

export function nhomTuoiNoCua(hoaDon: HoaDon): NhomTuoiNo {
  const soNgay = soNgayQuaHan(hoaDon.hanThanhToan)
  if (soNgay <= 30) return '≤30 ngày'
  if (soNgay <= 60) return '31–60 ngày'
  if (soNgay <= 90) return '61–90 ngày'
  return '>90 ngày'
}
