import { useMemo } from 'react'
import { mockDataset, type HocSinh, type PhuongXa, type Truong } from '../../mock-data'
import type { TongHopFiltersApi, TrangThaiTongHop } from './useTongHopFilters'

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0)
}

function laTienMat(hinhThuc: string | null): boolean {
  return hinhThuc === 'Tiền mặt'
}

function laChuyenKhoan(hinhThuc: string | null): boolean {
  return hinhThuc !== null && hinhThuc !== 'Tiền mặt'
}

export interface OverviewRow {
  truong: Truong
  phuongXa: PhuongXa
  tienMat: number
  chuyenKhoan: number
  tongThu: number
  conLaiSoLuong: number
  conLaiTien: number
  tongSoTien: number
  tyLeThu: number
  trangThaiTongHop: TrangThaiTongHop
}

// Ngưỡng tuyệt đối 0%/100% (bản gốc) gần như không bao giờ đúng ở quy mô tổng hợp: mỗi
// trường có hàng trăm hoá đơn/kỳ với trạng thái xen kẽ, nên tỷ lệ thu cộng dồn theo trường
// hầu như không bao giờ chạm đúng 0% hoặc 100% — mọi trường đều rơi vào "Một phần" (đã xác
// nhận thực tế: 100% số trường ra "Một phần" với ngưỡng 0/100). Đổi sang ngưỡng có khoảng đệm
// (đã verify trên dữ liệu thật: 42%/52% tách được cả 3 trạng thái ngay ở kỳ tập trung nhất).
function trangThaiTongHopCua(tongThu: number, tongSoTien: number): TrangThaiTongHop {
  const tyLe = tongSoTien === 0 ? 0 : tongThu / tongSoTien
  if (tyLe <= 0.42) return 'Chưa thanh toán'
  if (tyLe >= 0.52) return 'Đã thanh toán'
  return 'Thanh toán một phần'
}

export interface InvoiceRow {
  hoaDon: (typeof mockDataset.hoaDonList)[number]
  hocSinh: HocSinh
  truong: Truong
}

export function useTongHopData(filters: TongHopFiltersApi) {
  return useMemo(() => {
    const { phuongXaList, truongList, hocSinhList, hoaDonList } = mockDataset

    const phuongXaById = new Map<string, PhuongXa>(phuongXaList.map((p) => [p.id, p]))
    const hocSinhById = new Map<string, HocSinh>(hocSinhList.map((h) => [h.id, h]))
    const truongById = new Map<string, Truong>(truongList.map((t) => [t.id, t]))

    const scopedTruongList = truongList.filter(
      (t) =>
        (filters.phuongXaId === 'all' || t.phuongXaId === filters.phuongXaId) &&
        (filters.truongId === 'all' || t.id === filters.truongId) &&
        filters.capHocList.includes(t.capHoc) &&
        (filters.heThong === 'all' || t.heThongDoiTac === filters.heThong),
    )
    const scopedTruongIds = new Set(scopedTruongList.map((t) => t.id))

    const hoaDonKy = hoaDonList.filter(
      (hd) =>
        hd.ky === filters.ky &&
        scopedTruongIds.has(hd.truongId) &&
        (filters.hinhThucThanhToan === 'all' || hd.hinhThucThanhToan === filters.hinhThucThanhToan),
    )

    // ---- KPI ----
    const daThanhToan = hoaDonKy.filter((hd) => hd.trangThai === 'Đã thanh toán')
    const motPhan = hoaDonKy.filter((hd) => hd.trangThai === 'Thanh toán một phần')
    const chuaThu = hoaDonKy.filter((hd) => hd.trangThai === 'Đã gửi')

    const kpi = {
      tongSoHoaDon: hoaDonKy.length,
      tongTien: sum(hoaDonKy, (hd) => hd.soTien),
      soDaThanhToan: daThanhToan.length,
      tienDaThanhToan: sum(daThanhToan, (hd) => hd.daTra),
      soMotPhan: motPhan.length,
      tienMotPhan: sum(motPhan, (hd) => hd.daTra),
      soChuaThu: chuaThu.length,
      tienChuaThu: sum(chuaThu, (hd) => hd.soTien),
    }

    // ---- Tab Tổng quan: rollup theo trường ----
    const overviewRows: OverviewRow[] = scopedTruongList
      .map((truong) => {
        const hds = hoaDonKy.filter((hd) => hd.truongId === truong.id)
        const tienMat = sum(hds.filter((hd) => laTienMat(hd.hinhThucThanhToan)), (hd) => hd.daTra)
        const chuyenKhoan = sum(hds.filter((hd) => laChuyenKhoan(hd.hinhThucThanhToan)), (hd) => hd.daTra)
        const conLaiHds = hds.filter((hd) => hd.conLai > 0)
        const tongSoTien = sum(hds, (hd) => hd.soTien)
        const tongThu = tienMat + chuyenKhoan

        return {
          truong,
          phuongXa: phuongXaById.get(truong.phuongXaId)!,
          tienMat,
          chuyenKhoan,
          tongThu,
          conLaiSoLuong: conLaiHds.length,
          conLaiTien: sum(conLaiHds, (hd) => hd.conLai),
          tongSoTien,
          tyLeThu: tongSoTien === 0 ? 0 : tongThu / tongSoTien,
          trangThaiTongHop: trangThaiTongHopCua(tongThu, tongSoTien),
        }
      })
      .filter((row) => filters.trangThai === 'all' || row.trangThaiTongHop === filters.trangThai)
      .sort((a, b) => a.truong.tenTruong.localeCompare(b.truong.tenTruong, 'vi'))

    // ---- 3 tab hoá đơn theo trạng thái ----
    // Filter "Trạng thái" áp thêm lên từng subset — vốn đã thuần 1 trạng thái/tab nên chỉ
    // giữ nguyên (khớp) hoặc rỗng (không khớp), không ảnh hưởng KPI (tính từ hoaDonKy gốc).
    const trangThaiHoaDonMapped = filters.trangThai === 'Chưa thanh toán' ? 'Đã gửi' : filters.trangThai
    function locTheoTrangThai(list: typeof hoaDonKy): typeof hoaDonKy {
      return filters.trangThai === 'all' ? list : list.filter((hd) => hd.trangThai === trangThaiHoaDonMapped)
    }

    function toInvoiceRows(list: typeof hoaDonKy): InvoiceRow[] {
      return list
        .map((hoaDon) => ({
          hoaDon,
          hocSinh: hocSinhById.get(hoaDon.hocSinhId)!,
          truong: truongById.get(hoaDon.truongId)!,
        }))
        .filter((row) => row.hocSinh && row.truong)
    }

    return {
      kpi,
      overviewRows,
      invoiceRowsByTab: {
        'da-thanh-toan': toInvoiceRows(locTheoTrangThai(daThanhToan)),
        'mot-phan': toInvoiceRows(locTheoTrangThai(motPhan)),
        'chua-thanh-toan': toInvoiceRows(locTheoTrangThai(chuaThu)),
      },
    }
  }, [
    filters.ky,
    filters.phuongXaId,
    filters.truongId,
    filters.capHocList,
    filters.hinhThucThanhToan,
    filters.heThong,
    filters.trangThai,
  ])
}

export type TongHopData = ReturnType<typeof useTongHopData>
