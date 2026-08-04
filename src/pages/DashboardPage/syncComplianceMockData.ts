import { CAP_HOC_LIST, mockDataset } from '../../mock-data'
import { NHAN_VAT_LICH_SU_LIST } from '../../mock-data/constants'
import { createRng, type Rng } from '../../mock-data/random'
import { PREFIX_THEO_CAP } from '../../mock-data/truong'
import { hanChotDongBoCuaKy } from '../../utils/dongBo'
import { getKyOptions } from '../../utils/ky'

// Dữ liệu demo riêng cho widget Tình trạng đồng bộ — KHÔNG liên kết với mockDataset.truongList
// thật, chỉ minh hoạ UI khi 1 khu vực có nhiều trường (mock data thật hiện tại đa số Phường/Xã
// chỉ có 1-2 trường thật, không đủ để demo trường hợp danh sách dài/cắt bớt + mở rộng).
export interface TruongDongBoDemo {
  id: string
  tenTruong: string
  ngayDongBoTheoKy: Record<string, string>
}

const SEED_DONG_BO_DEMO = 5000
const SO_TRUONG_MIN = 8
const SO_TRUONG_MAX = 10

const DANH_SACH_KY = getKyOptions()

// Mỗi khu vực được gán 1 "nhóm tỷ lệ đồng bộ mục tiêu" ngẫu nhiên (có seed) áp dụng cho MỌI kỳ —
// đảm bảo phân bố tỷ lệ đa dạng thật sự giữa 167 khu. Cách cũ để mỗi trường tự tung xác suất
// đúng hạn ĐỘC LẬP rồi suy ra tỷ lệ cả khu khiến hầu hết khu vực dồn về cùng 1 mức khi khu có
// nhiều trường (xác suất TẤT CẢ trường cùng đúng hạn giảm theo cấp số nhân theo số trường/khu,
// nên gần như không khu nào đạt 100% và phần lớn khu có tỷ lệ rất thấp). Cách mới chọn thẳng số
// trường đúng hạn theo tỷ lệ mục tiêu của khu, nên tỷ lệ hiển thị luôn khớp đúng nhóm mong muốn.
interface NhomTyLe {
  trongSo: number
  khoangTyLe: [number, number]
}
const NHOM_TY_LE_LIST: NhomTyLe[] = [
  { trongSo: 0.12, khoangTyLe: [1, 1] }, // "Đã hoàn tất" — 100%
  { trongSo: 0.22, khoangTyLe: [0.8, 0.89] },
  { trongSo: 0.22, khoangTyLe: [0.7, 0.79] },
  { trongSo: 0.22, khoangTyLe: [0.5, 0.59] },
  { trongSo: 0.22, khoangTyLe: [0.1, 0.45] }, // vẫn giữ 1 nhóm khu vực có vấn đề thật, đáng chú ý
]

function chonNhomTyLe(rng: Rng): NhomTyLe {
  const r = rng.next()
  let cumulative = 0
  for (const nhom of NHOM_TY_LE_LIST) {
    cumulative += nhom.trongSo
    if (r < cumulative) return nhom
  }
  return NHOM_TY_LE_LIST[NHOM_TY_LE_LIST.length - 1]
}

function sinhNgayDongBo(rng: Rng, dungHan: boolean, ky: string): string {
  const hanChot = hanChotDongBoCuaKy(ky)
  const ngayDongBo = new Date(hanChot)
  if (dungHan) {
    ngayDongBo.setDate(ngayDongBo.getDate() - rng.int(1, 7))
  } else {
    // Biên độ trễ trải rộng tới 25 ngày để "Số ngày trễ" hiển thị đa dạng, không dồn về 1 mốc.
    ngayDongBo.setDate(ngayDongBo.getDate() + rng.int(1, 25))
  }
  return ngayDongBo.toISOString()
}

function generateDongBoDemoTheoPhuong(): Record<string, TruongDongBoDemo[]> {
  const rng = createRng(SEED_DONG_BO_DEMO)
  const result: Record<string, TruongDongBoDemo[]> = {}

  for (const px of mockDataset.phuongXaList) {
    // Đặc khu Côn Đảo giữ nguyên 0 trường (dân số rất thấp, không có cơ sở giáo dục) — không áp
    // dữ liệu demo cho khu vực này.
    if (px.loai === 'Đặc khu') {
      result[px.id] = []
      continue
    }

    const soLuong = rng.int(SO_TRUONG_MIN, SO_TRUONG_MAX)
    const nhom = chonNhomTyLe(rng)
    // Lấy ngẫu nhiên soLuong tên gốc KHÔNG TRÙNG từ danh sách nhân vật lịch sử (17 tên, luôn đủ
    // cho tối đa 10 trường/khu) — shuffle rồi cắt đầu danh sách tự đảm bảo không trùng trong
    // cùng 1 khu vực.
    const tenGocShuffled = rng.shuffle(NHAN_VAT_LICH_SU_LIST)
    const truongDemo: TruongDongBoDemo[] = []
    for (let i = 0; i < soLuong; i++) {
      const capHoc = rng.pick(CAP_HOC_LIST)
      truongDemo.push({
        id: `demo-dongbo-${px.id}-${i}`,
        tenTruong: `${PREFIX_THEO_CAP[capHoc]} ${tenGocShuffled[i]}`,
        ngayDongBoTheoKy: {},
      })
    }

    // Với mỗi Kỳ, chọn lại (độc lập) đúng số trường đúng hạn theo tỷ lệ mục tiêu của khu vực —
    // giữ mức đồng bộ ổn định qua các Kỳ (đúng nhóm tỷ lệ của khu) nhưng trường cụ thể nào "trễ"
    // có thể đổi khác nhau giữa các Kỳ, giống thực tế.
    for (const ky of DANH_SACH_KY) {
      const tyLeMucTieu = rng.float(nhom.khoangTyLe[0], nhom.khoangTyLe[1])
      const soDungHan = Math.min(soLuong, Math.round(soLuong * tyLeMucTieu))
      const thuTuXaoTron = rng.shuffle(truongDemo.map((_, idx) => idx))
      const chiSoDungHan = new Set(thuTuXaoTron.slice(0, soDungHan))
      truongDemo.forEach((truong, idx) => {
        truong.ngayDongBoTheoKy[ky] = sinhNgayDongBo(rng, chiSoDungHan.has(idx), ky)
      })
    }

    result[px.id] = truongDemo
  }

  return result
}

// Sinh 1 lần khi module được import (cùng nguyên tắc với mockDataset ở mock-data/index.ts) —
// seed cố định nên nhất quán giữa các lần chạy/reload.
export const dongBoDemoTheoPhuong: Record<string, TruongDongBoDemo[]> = generateDongBoDemoTheoPhuong()
