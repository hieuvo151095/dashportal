import { useMemo } from 'react'
import { mockDataset, type PhuongXa } from '../../mock-data'
import { NHOM_TUOI_NO_LIST, nhomTuoiNoCua } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import type { TongHopFiltersApi } from './useTongHopFilters'

const KY_OPTIONS = getKyOptions()
const KY_INDEX = new Map(KY_OPTIONS.map((ky, index) => [ky, index]))

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0)
}

// Kỳ dạng "MM/YYYY" mới so sánh được theo khoảng từ-đến; hoá đơn niên khoá (vd "2025-2026")
// không có khái niệm "trong khoảng tháng" nên luôn được tính vào phạm vi.
function trongPhamViKy(ky: string, kyTu: string, kyDen: string): boolean {
  const idx = KY_INDEX.get(ky)
  if (idx === undefined) return true
  const idxTu = KY_INDEX.get(kyTu) ?? 0
  const idxDen = KY_INDEX.get(kyDen) ?? KY_OPTIONS.length - 1
  return idx >= idxTu && idx <= idxDen
}

export function useTongHopData(filters: TongHopFiltersApi) {
  return useMemo(() => {
    const { phuongXaList, truongList, hoaDonList } = mockDataset
    const phuongXaById = new Map<string, PhuongXa>(phuongXaList.map((p) => [p.id, p]))

    const q = filters.q.trim().toLowerCase()
    const scopedTruongList = truongList.filter(
      (t) =>
        (filters.phuongXaIds.length === 0 || filters.phuongXaIds.includes(t.phuongXaId)) &&
        (filters.truongIds.length === 0 || filters.truongIds.includes(t.id)) &&
        (!q || t.tenTruong.toLowerCase().includes(q) || t.maTruong.toLowerCase().includes(q)),
    )
    const scopedTruongIds = new Set(scopedTruongList.map((t) => t.id))

    const hoaDonScoped = hoaDonList.filter(
      (hd) => scopedTruongIds.has(hd.truongId) && trongPhamViKy(hd.ky, filters.kyTu, filters.kyDen),
    )
    const hoaDonNo = hoaDonScoped.filter((hd) => hd.trangThai !== 'Đã thanh toán')
    const hoaDonNoLoc = hoaDonNo.filter((hd) => filters.nhomTuoiNoList.includes(nhomTuoiNoCua(hd)))

    // ---- KPI ----
    const tongCongNo = sum(hoaDonNoLoc, (hd) => hd.conLai)
    const soHocSinhChuaDong = new Set(hoaDonNoLoc.map((hd) => hd.hocSinhId)).size
    const tongSoTienHoaDon = sum(hoaDonScoped, (hd) => hd.soTien)
    const tyLeNoTrungBinh = tongSoTienHoaDon === 0 ? 0 : tongCongNo / tongSoTienHoaDon
    const congNoQuaHan90 = sum(
      hoaDonNoLoc.filter((hd) => nhomTuoiNoCua(hd) === '>90 ngày'),
      (hd) => hd.conLai,
    )

    const kpi = { tongCongNo, soHocSinhChuaDong, tyLeNoTrungBinh, congNoQuaHan90 }

    // ---- Widget Aging (bỏ qua filter Nhóm tuổi nợ — vốn là widget so sánh giữa các nhóm) ----
    const tuoiNoMap = new Map<string, { tongTien: number; hocSinhIds: Set<string> }>()
    for (const nhom of NHOM_TUOI_NO_LIST) tuoiNoMap.set(nhom, { tongTien: 0, hocSinhIds: new Set() })
    for (const hd of hoaDonNo) {
      const entry = tuoiNoMap.get(nhomTuoiNoCua(hd))!
      entry.tongTien += hd.conLai
      entry.hocSinhIds.add(hd.hocSinhId)
    }
    const congNoTheoTuoiNo = NHOM_TUOI_NO_LIST.map((nhom) => {
      const entry = tuoiNoMap.get(nhom)!
      return { nhom, tongTien: entry.tongTien, soHocSinh: entry.hocSinhIds.size }
    })

    // ---- Xu hướng công nợ theo tháng (theo đúng khoảng Kỳ phí đang chọn — BUG cũ: luôn tính
    // cứng 6 tháng gần nhất tính từ hôm nay theo ngày lập hoá đơn, không phản ứng theo filter
    // Kỳ phí. Sửa: nhóm theo hd.ky trong đúng khoảng [kyTu, kyDen]. Vẫn bỏ qua filter Nhóm tuổi
    // nợ — đây là widget so sánh theo thời gian, không nên tự lọc theo chính chiều khác) ----
    const idxTu = KY_INDEX.get(filters.kyTu) ?? 0
    const idxDen = KY_INDEX.get(filters.kyDen) ?? KY_OPTIONS.length - 1
    const kyTrongKhoang = KY_OPTIONS.slice(idxTu, idxDen + 1)
    const xuHuongThang = kyTrongKhoang.map((ky) => {
      const hdsKy = hoaDonNo.filter((hd) => hd.ky === ky)
      return {
        thang: ky,
        tongNo: sum(hdsKy, (hd) => hd.conLai),
        soHocSinhNoMoi: new Set(hdsKy.map((hd) => hd.hocSinhId)).size,
      }
    })

    // ---- Bảng công nợ theo trường ----
    const congNoByTruong = new Map<string, typeof hoaDonNoLoc>()
    for (const hd of hoaDonNoLoc) {
      const list = congNoByTruong.get(hd.truongId) ?? []
      list.push(hd)
      congNoByTruong.set(hd.truongId, list)
    }

    const rows = scopedTruongList
      .map((truong) => {
        const hds = congNoByTruong.get(truong.id) ?? []
        if (hds.length === 0) return null

        const tienTheoNhom = new Map<string, number>()
        for (const hd of hds) {
          const nhom = nhomTuoiNoCua(hd)
          tienTheoNhom.set(nhom, (tienTheoNhom.get(nhom) ?? 0) + hd.conLai)
        }
        const nhomUuThe = [...tienTheoNhom.entries()].sort((a, b) => b[1] - a[1])[0][0]

        return {
          truong,
          phuongXa: phuongXaById.get(truong.phuongXaId)!,
          soHocSinhChuaThanhToan: new Set(hds.map((hd) => hd.hocSinhId)).size,
          soTienChuaThu: sum(hds, (hd) => hd.conLai),
          nhomTuoiNoUuThe: nhomUuThe,
        }
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort((a, b) => b.soTienChuaThu - a.soTienChuaThu)

    return { kpi, congNoTheoTuoiNo, xuHuongThang, rows }
  }, [filters.phuongXaIds, filters.truongIds, filters.kyTu, filters.kyDen, filters.nhomTuoiNoList, filters.q])
}

export type TongHopData = ReturnType<typeof useTongHopData>
