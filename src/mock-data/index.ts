import { generateHoaDonList } from './hoaDon'
import { generateHocSinhList } from './hocSinh'
import { generateKhoanPhiList } from './khoanPhi'
import { generatePhuongXaList } from './phuongXa'
import { generateTruongList } from './truong'
import type { KhoanPhi, MockDataset, Truong } from './types'

function buildDataset(): MockDataset {
  const phuongXaList = generatePhuongXaList()
  const truongList = generateTruongList(phuongXaList)
  const hocSinhList = generateHocSinhList(truongList)
  const khoanPhiList = generateKhoanPhiList(truongList)

  const truongById = new Map<string, Truong>(truongList.map((truong) => [truong.id, truong]))
  const khoanPhiByTruong = new Map<string, KhoanPhi[]>()
  for (const khoanPhi of khoanPhiList) {
    const list = khoanPhiByTruong.get(khoanPhi.truongId) ?? []
    list.push(khoanPhi)
    khoanPhiByTruong.set(khoanPhi.truongId, list)
  }

  const hoaDonList = generateHoaDonList(hocSinhList, truongById, khoanPhiByTruong)

  return { phuongXaList, truongList, hocSinhList, khoanPhiList, hoaDonList }
}

// Sinh dữ liệu 1 lần khi module được import (seed cố định trong random.ts nên
// kết quả nhất quán giữa các lần chạy/reload).
export const mockDataset: MockDataset = buildDataset()

export * from './types'
export {
  CAP_HOC_LIST,
  DANH_MUC_KHOAN_THU_LIST,
  HE_THONG_DOI_TAC_LIST,
  HINH_THUC_THANH_TOAN_LIST,
  NGUON_THU_LIST,
  NHOM_PHI_LIST,
  NIEN_KHOA,
  NIEN_KHOA_LIST,
  TODAY,
} from './constants'
export { TOA_DO_PHUONG_XA } from './toaDoPhuongXa'
