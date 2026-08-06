const HAN_DONG_BO_SO_NGAY_KEY = 'portal-thu-hoc-phi:han-dong-bo-so-ngay'

export const MAC_DINH_HAN_DONG_BO_SO_NGAY = 7

export function getHanDongBoSoNgay(): number {
  const raw = localStorage.getItem(HAN_DONG_BO_SO_NGAY_KEY)
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : MAC_DINH_HAN_DONG_BO_SO_NGAY
}

export function setHanDongBoSoNgay(soNgay: number): void {
  localStorage.setItem(HAN_DONG_BO_SO_NGAY_KEY, String(soNgay))
}
