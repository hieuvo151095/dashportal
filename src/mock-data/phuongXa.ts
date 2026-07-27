import { PHUONG_XA_SEED } from './constants'
import type { PhuongXa } from './types'

export function generatePhuongXaList(): PhuongXa[] {
  return PHUONG_XA_SEED.map((item, index) => ({
    id: `px-${String(index + 1).padStart(2, '0')}`,
    ten: `${item.loai} ${item.ten}`,
    loai: item.loai,
  }))
}
