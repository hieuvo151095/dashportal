import { CAP_HOC_LIST, mockDataset } from '../../mock-data'
import { NHAN_VAT_LICH_SU_LIST } from '../../mock-data/constants'
import { createRng } from '../../mock-data/random'
import { PREFIX_THEO_CAP, sinhNgayDongBoTheoKy } from '../../mock-data/truong'

// Dữ liệu demo riêng cho widget Tình trạng đồng bộ — KHÔNG liên kết với mockDataset.truongList
// thật, chỉ minh hoạ UI khi 1 khu vực có nhiều trường (mock data thật hiện tại đa số Phường/Xã
// chỉ có 1-2 trường thật, không đủ để demo trường hợp danh sách dài/cắt bớt + mở rộng).
export interface TruongDongBoDemo {
  id: string
  tenTruong: string
  ngayDongBoTheoKy: Record<string, string>
}

const SEED_DONG_BO_DEMO = 5000
const SO_TRUONG_MIN = 3
const SO_TRUONG_MAX = 5

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
    // Lấy ngẫu nhiên soLuong tên gốc KHÔNG TRÙNG từ danh sách nhân vật lịch sử (17 tên, luôn đủ
    // cho tối đa 5 trường/khu) — shuffle rồi cắt đầu danh sách tự đảm bảo không trùng trong
    // cùng 1 khu vực.
    const tenGocShuffled = rng.shuffle(NHAN_VAT_LICH_SU_LIST)
    const truongDemo: TruongDongBoDemo[] = []
    for (let i = 0; i < soLuong; i++) {
      const capHoc = rng.pick(CAP_HOC_LIST)
      truongDemo.push({
        id: `demo-dongbo-${px.id}-${i}`,
        tenTruong: `${PREFIX_THEO_CAP[capHoc]} ${tenGocShuffled[i]}`,
        ngayDongBoTheoKy: sinhNgayDongBoTheoKy(rng),
      })
    }
    result[px.id] = truongDemo
  }

  return result
}

// Sinh 1 lần khi module được import (cùng nguyên tắc với mockDataset ở mock-data/index.ts) —
// seed cố định nên nhất quán giữa các lần chạy/reload.
export const dongBoDemoTheoPhuong: Record<string, TruongDongBoDemo[]> = generateDongBoDemoTheoPhuong()
