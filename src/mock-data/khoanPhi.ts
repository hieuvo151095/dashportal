import { KHOAN_PHI_TEMPLATES, NIEN_KHOA, THAM_CHIEU_PHAP_LY_LIST } from './constants'
import { createRng } from './random'
import type { KhoanPhi, Truong } from './types'

function lamTronNghin(soTien: number): number {
  return Math.round(soTien / 1000) * 1000
}

export function generateKhoanPhiList(truongList: Truong[]): KhoanPhi[] {
  const rng = createRng(3000)
  const khoanPhiList: KhoanPhi[] = []
  let sttToanCuc = 1

  for (const truong of truongList) {
    const eligible = KHOAN_PHI_TEMPLATES.filter(
      (template) => !template.bietLap || template.bietLap.includes(truong.capHoc),
    )
    // "Học phí" là khoản phí cốt lõi, luôn kích hoạt ở mọi trường.
    const hocPhi = eligible.find((template) => template.ten === 'Học phí')
    const conLai = eligible.filter((template) => template.ten !== 'Học phí')
    const soLuong = rng.int(12, Math.min(18, eligible.length)) - (hocPhi ? 1 : 0)
    const selected = [...(hocPhi ? [hocPhi] : []), ...rng.shuffle(conLai).slice(0, soLuong)]

    selected.forEach((template, index) => {
      khoanPhiList.push({
        id: `phi-${String(sttToanCuc).padStart(4, '0')}`,
        maPhi: `KP-${truong.maTruong}-${String(index + 1).padStart(2, '0')}`,
        tenPhi: template.ten,
        soTien: lamTronNghin(rng.int(template.soTienMin, template.soTienMax)),
        donViTinh: template.donViTinh,
        nguonThu: template.nguonThu,
        nhomPhi: template.nhomPhi,
        danhMucKhoanThu: template.danhMuc,
        nienKhoa: NIEN_KHOA,
        truongId: truong.id,
        thamChieuPhapLy: rng.pick(THAM_CHIEU_PHAP_LY_LIST),
        ghiChu: '',
      })
      sttToanCuc++
    })
  }

  return khoanPhiList
}
