import { NIEN_KHOA, mockDataset } from '../../mock-data'
import { useQueryParam } from '../../utils/useQueryParam'

export interface ChiTietFiltersApi {
  truongId: string
  tenPhi: string
  maPhi: string
  nguonThu: string
  nhomPhi: string
  nienKhoa: string
  setTruongId: (value: string) => void
  setTenPhi: (value: string) => void
  setMaPhi: (value: string) => void
  setNguonThu: (value: string) => void
  setNhomPhi: (value: string) => void
  setNienKhoa: (value: string) => void
}

export function useChiTietFilters(): ChiTietFiltersApi {
  const defaultTruongId = mockDataset.truongList[0]?.id ?? ''
  const [truongId, setTruongId] = useQueryParam('truong', defaultTruongId)
  const [tenPhi, setTenPhi] = useQueryParam('tenPhi', '')
  const [maPhi, setMaPhi] = useQueryParam('maPhi', '')
  const [nguonThu, setNguonThu] = useQueryParam('nguonThu', 'all')
  const [nhomPhi, setNhomPhi] = useQueryParam('nhomPhi', 'all')
  const [nienKhoa, setNienKhoa] = useQueryParam('nienKhoa', NIEN_KHOA)

  return {
    truongId,
    tenPhi,
    maPhi,
    nguonThu,
    nhomPhi,
    nienKhoa,
    setTruongId,
    setTenPhi,
    setMaPhi,
    setNguonThu,
    setNhomPhi,
    setNienKhoa,
  }
}
