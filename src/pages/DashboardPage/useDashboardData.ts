import { useMemo } from 'react'
import {
  CAP_HOC_LIST,
  DANH_MUC_KHOAN_THU_LIST,
  HINH_THUC_THANH_TOAN_LIST,
  TODAY,
  mockDataset,
  type NhomTuoiNo,
  type PhuongXa,
  type Truong,
} from '../../mock-data'
import { NHOM_TUOI_NO_LIST, nhomTuoiNoCua } from '../../utils/congNo'
import { soNgayTreCuaTruong } from '../../utils/dongBo'
import { getKyOptions } from '../../utils/ky'
import { dongBoDemoTheoPhuong } from './syncComplianceMockData'
import type { DashboardFilters } from './useDashboardFilters'

const SO_THANG_XU_HUONG = 6

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0)
}

function formatKyThang(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function laCungThang(isoDate: string, thang: Date): boolean {
  const d = new Date(isoDate)
  return d.getFullYear() === thang.getFullYear() && d.getMonth() === thang.getMonth()
}

export function useDashboardData(filters: DashboardFilters) {
  const data = useMemo(() => {
    const { phuongXaList, truongList, khoanPhiList, hoaDonList } = mockDataset

    const phuongXaById = new Map<string, PhuongXa>(phuongXaList.map((p) => [p.id, p]))
    const truongById = new Map<string, Truong>(truongList.map((t) => [t.id, t]))
    const khoanPhiById = new Map(khoanPhiList.map((k) => [k.id, k]))

    // Phạm vi theo Cấp học (dùng cho các widget so sánh giữa các Xã/Phường,
    // vốn không áp dụng filter Xã/Phường vì sẽ mất ý nghĩa so sánh).
    const capHocScopedTruongIds = new Set(
      truongList.filter((t) => filters.capHocList.includes(t.capHoc)).map((t) => t.id),
    )

    // Phạm vi đầy đủ (Xã/Phường + Cấp học) — dùng cho hầu hết widget còn lại.
    const scopedTruongList = truongList.filter(
      (t) =>
        (filters.phuongXaId === 'all' || t.phuongXaId === filters.phuongXaId) &&
        filters.capHocList.includes(t.capHoc),
    )
    const scopedTruongIds = new Set(scopedTruongList.map((t) => t.id))

    const hoaDonScoped = hoaDonList.filter((hd) => scopedTruongIds.has(hd.truongId))
    const hoaDonKy = hoaDonScoped.filter((hd) => hd.ky === filters.ky)

    // ---- KPI ----
    const tongTien = sum(hoaDonKy, (hd) => hd.soTien)
    const daThuTien = sum(hoaDonKy, (hd) => hd.daTra)
    const canThuTien = sum(hoaDonKy, (hd) => hd.conLai)
    const soDaThanhToan = hoaDonKy.filter((hd) => hd.trangThai === 'Đã thanh toán').length
    const soCanThu = hoaDonKy.length - soDaThanhToan
    const tiLeHoanThanh = tongTien === 0 ? 0 : daThuTien / tongTien

    // "Kết nối" = trường đã được gán 1 hệ thống đối tác cụ thể (heThongDoiTac luôn có giá
    // trị theo schema hiện tại, nên tỷ lệ này thực chất luôn 100% — tính động thay vì hardcode
    // để tự đúng nếu sau này có field trạng thái kết nối thật (case "chưa kết nối").
    const soTruongKetNoi = scopedTruongList.filter((t) => t.heThongDoiTac).length
    const tyLeKetNoi = scopedTruongList.length === 0 ? 0 : soTruongKetNoi / scopedTruongList.length

    // ---- So sánh với kỳ trước (chỉ có nếu kỳ đang xem không phải kỳ sớm nhất trong 6 kỳ gần
    // nhất — mock data chỉ sinh hoá đơn cho 6 tháng gần nhất, kỳ đầu tiên không có kỳ trước) ----
    const kyOptions = getKyOptions()
    const kyIndex = kyOptions.indexOf(filters.ky)
    const kyTruoc = kyIndex > 0 ? kyOptions[kyIndex - 1] : null
    const hoaDonKyTruoc = kyTruoc ? hoaDonScoped.filter((hd) => hd.ky === kyTruoc) : []
    const tongTienTruoc = sum(hoaDonKyTruoc, (hd) => hd.soTien)
    const daThuTienTruoc = sum(hoaDonKyTruoc, (hd) => hd.daTra)
    const canThuTienTruoc = sum(hoaDonKyTruoc, (hd) => hd.conLai)
    const tiLeHoanThanhTruoc = tongTienTruoc === 0 ? 0 : daThuTienTruoc / tongTienTruoc

    const kpi = {
      tongSoHoaDon: hoaDonKy.length,
      tongTien,
      soDaThanhToan,
      daThuTien,
      soCanThu,
      canThuTien,
      tiLeHoanThanh,
      soTruong: scopedTruongList.length,
      tyLeKetNoi,
      kyTruoc: kyTruoc
        ? { tongTien: tongTienTruoc, daThuTien: daThuTienTruoc, canThuTien: canThuTienTruoc, tiLeHoanThanh: tiLeHoanThanhTruoc }
        : null,
    }

    // ---- Tỷ lệ thu theo Xã/Phường (bỏ qua filter Xã/Phường, chỉ theo Cấp học + Kỳ) ----
    // Giữ nguyên đủ 168 khu (kể cả khu chưa có trường, vd Đặc khu Côn Đảo) — Grid map cần
    // hiện đủ 168 ô. Top 10 lọc lại coDuLieu riêng, không xếp hạng khu rỗng.
    const hoaDonKyCapHocScoped = hoaDonList.filter(
      (hd) => hd.ky === filters.ky && capHocScopedTruongIds.has(hd.truongId),
    )
    const tyLeThuTheoPhuong = phuongXaList.map((px) => {
      const truongIdsInPx = new Set(
        truongList.filter((t) => t.phuongXaId === px.id && filters.capHocList.includes(t.capHoc)).map((t) => t.id),
      )
      const hds = hoaDonKyCapHocScoped.filter((hd) => truongIdsInPx.has(hd.truongId))
      const tongTienPx = sum(hds, (hd) => hd.soTien)
      const daThuPx = sum(hds, (hd) => hd.daTra)
      return {
        phuongXa: px,
        tyLe: tongTienPx === 0 ? 0 : daThuPx / tongTienPx,
        daThuTien: daThuPx,
        conThuTien: tongTienPx - daThuPx,
        coDuLieu: truongIdsInPx.size > 0,
      }
    })

    const top10Phuong = tyLeThuTheoPhuong
      .filter((item) => item.coDuLieu)
      .sort((a, b) => b.tyLe - a.tyLe)
      .slice(0, 10)

    // ---- Cơ cấu khoản thu ----
    const coCauKhoanThu = DANH_MUC_KHOAN_THU_LIST.map((danhMuc) => ({
      label: danhMuc,
      value: sum(
        hoaDonKy.filter((hd) => khoanPhiById.get(hd.khoanPhiId)?.danhMucKhoanThu === danhMuc),
        (hd) => hd.soTien,
      ),
    })).filter((item) => item.value > 0)

    // ---- Cơ cấu hình thức thanh toán ----
    const coCauHinhThuc = HINH_THUC_THANH_TOAN_LIST.map((hinhThuc) => ({
      label: hinhThuc,
      value: sum(
        hoaDonKy.filter((hd) => hd.hinhThucThanhToan === hinhThuc),
        (hd) => hd.daTra,
      ),
    })).filter((item) => item.value > 0)

    // ---- Top 20 trường công nợ cao nhất (toàn bộ hoá đơn còn nợ, không giới hạn kỳ) ----
    const hoaDonConNo = hoaDonScoped.filter((hd) => hd.trangThai !== 'Đã thanh toán')
    const congNoByTruong = new Map<string, { tongNo: number; hocSinhIds: Set<string> }>()
    for (const hd of hoaDonConNo) {
      const entry = congNoByTruong.get(hd.truongId) ?? { tongNo: 0, hocSinhIds: new Set<string>() }
      entry.tongNo += hd.conLai
      entry.hocSinhIds.add(hd.hocSinhId)
      congNoByTruong.set(hd.truongId, entry)
    }
    const top20CongNo = [...congNoByTruong.entries()]
      .map(([truongId, v]) => ({
        truong: truongById.get(truongId)!,
        phuongXa: phuongXaById.get(truongById.get(truongId)!.phuongXaId)!,
        tongNo: v.tongNo,
        soHocSinh: v.hocSinhIds.size,
      }))
      .sort((a, b) => b.tongNo - a.tongNo)
      .slice(0, 20)

    // ---- Xu hướng thu theo tháng (6 tháng gần nhất, theo ngày lập hoá đơn) ----
    const danhSachThang: Date[] = []
    for (let i = SO_THANG_XU_HUONG - 1; i >= 0; i--) {
      danhSachThang.push(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1))
    }
    const xuHuongThang = danhSachThang.map((thang) => {
      const hds = hoaDonScoped.filter((hd) => laCungThang(hd.ngayLap, thang))
      const tongTienThang = sum(hds, (hd) => hd.soTien)
      const daThuThang = sum(hds, (hd) => hd.daTra)
      return {
        thang: formatKyThang(thang),
        tongTien: tongTienThang,
        daThu: daThuThang,
        tyLe: tongTienThang === 0 ? 0 : daThuThang / tongTienThang,
      }
    })

    // ---- Công nợ theo tuổi nợ ----
    const tuoiNoMap = new Map<NhomTuoiNo, { tongTien: number; hocSinhIds: Set<string> }>()
    for (const nhom of NHOM_TUOI_NO_LIST) tuoiNoMap.set(nhom, { tongTien: 0, hocSinhIds: new Set() })
    for (const hd of hoaDonConNo) {
      const nhom = nhomTuoiNoCua(hd)
      const entry = tuoiNoMap.get(nhom)!
      entry.tongTien += hd.conLai
      entry.hocSinhIds.add(hd.hocSinhId)
    }
    const congNoTheoTuoiNo = NHOM_TUOI_NO_LIST.map((nhom) => {
      const entry = tuoiNoMap.get(nhom)!
      return { nhom, tongTien: entry.tongTien, soHocSinh: entry.hocSinhIds.size }
    })

    return {
      kpi,
      tyLeThuTheoPhuong,
      top10Phuong,
      coCauKhoanThu,
      coCauHinhThuc,
      top20CongNo,
      xuHuongThang,
      congNoTheoTuoiNo,
      soPhuongXaCoDuLieu: tyLeThuTheoPhuong.filter((item) => item.coDuLieu).length,
    }
  }, [filters.ky, filters.phuongXaId, filters.capHocList])

  // Tách riêng useMemo cho 2 widget mới (Phase Dashboard v3) — gộp chung vào khối phía trên
  // khiến function quá lớn, React Compiler không suy luận chính xác được dependency của
  // useMemo gốc nữa (báo lỗi preserve-manual-memoization dù dependency array không đổi).
  const phanTich = useMemo(() => {
    const { truongList, hocSinhList, hoaDonList, phuongXaList } = mockDataset

    // ---- Phân tích theo Cấp học (bỏ qua filter Cấp học, chỉ theo Xã/Phường + Kỳ —
    // widget so sánh giữa các cấp học nên không tự lọc theo chính chiều đang so sánh) ----
    const phuongXaScopedTruongList = truongList.filter(
      (t) => filters.phuongXaId === 'all' || t.phuongXaId === filters.phuongXaId,
    )
    const phuongXaScopedTruongIds = new Set(phuongXaScopedTruongList.map((t) => t.id))
    const hoaDonKyPhuongXaScoped = hoaDonList.filter(
      (hd) => hd.ky === filters.ky && phuongXaScopedTruongIds.has(hd.truongId),
    )
    const phanTichCapHoc = CAP_HOC_LIST.map((capHoc) => {
      const truongNhom = phuongXaScopedTruongList.filter((t) => t.capHoc === capHoc)
      const truongIdsNhom = new Set(truongNhom.map((t) => t.id))
      const hds = hoaDonKyPhuongXaScoped.filter((hd) => truongIdsNhom.has(hd.truongId))
      const tongPhaiThu = sum(hds, (hd) => hd.soTien)
      const daThu = sum(hds, (hd) => hd.daTra)
      return {
        capHoc,
        soTruong: truongNhom.length,
        soHocSinh: hocSinhList.filter((hs) => truongIdsNhom.has(hs.truongId)).length,
        tongPhaiThu,
        daThu,
        tyLe: tongPhaiThu === 0 ? 0 : daThu / tongPhaiThu,
      }
    })

    // ---- Tuân thủ đồng bộ theo Kỳ, xếp hạng theo Xã/Phường ----
    // Dùng dongBoDemoTheoPhuong (data demo riêng, KHÔNG phải mockDataset.truongList thật — xem
    // syncComplianceMockData.ts) để widget luôn có đủ 3-5 trường/khu minh hoạ trường hợp danh
    // sách dài, thay vì phụ thuộc số trường thật (đa số khu chỉ có 1-2 trường thật). Vì vậy
    // widget này KHÔNG áp filter Cấp học/Xã-Phường của trang (data demo không gắn với 2 chiều
    // filter đó) — Tỷ lệ = số trường demo đã đồng bộ đúng hạn của Kỳ đang chọn / tổng số trường
    // demo trong khu vực. truongChuaDongBo giữ luôn số ngày trễ của từng trường — mỗi tab
    // "Chậm ..." tự lọc lại danh sách này theo ngưỡng riêng, không tính lại từ đầu.
    const dongBoTheoPhuong = phuongXaList.map((px) => {
      const truongDemoTrongKhu = dongBoDemoTheoPhuong[px.id] ?? []
      const truongChuaDongBo = truongDemoTrongKhu
        .map((truong) => ({ truong, soNgayTre: soNgayTreCuaTruong(truong, filters.ky) }))
        .filter((item) => item.soNgayTre > 0)
      const soDungHan = truongDemoTrongKhu.length - truongChuaDongBo.length
      return {
        phuongXa: px,
        soTruong: truongDemoTrongKhu.length,
        soDungHan,
        tyLeDongBo: truongDemoTrongKhu.length === 0 ? 0 : soDungHan / truongDemoTrongKhu.length,
        truongChuaDongBo,
      }
    })

    return { phanTichCapHoc, dongBoTheoPhuong }
  }, [filters.ky, filters.phuongXaId])

  return { ...data, ...phanTich }
}

export type DashboardData = ReturnType<typeof useDashboardData>
