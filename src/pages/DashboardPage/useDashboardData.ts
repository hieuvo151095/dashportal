import { useMemo } from 'react'
import {
  DANH_MUC_KHOAN_THU_LIST,
  HINH_THUC_THANH_TOAN_LIST,
  TODAY,
  mockDataset,
  type HoaDon,
  type NhomTuoiNo,
  type PhuongXa,
  type Truong,
} from '../../mock-data'
import type { DashboardFilters } from './useDashboardFilters'

const SO_THANG_XU_HUONG = 6
const NHOM_TUOI_NO_LIST: NhomTuoiNo[] = ['≤30 ngày', '31–60 ngày', '61–90 ngày', '>90 ngày']

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

function soNgayQuaHan(hanThanhToan: string): number {
  const han = new Date(hanThanhToan)
  const diffMs = TODAY.getTime() - han.getTime()
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
}

function nhomTuoiNoCua(hd: HoaDon): NhomTuoiNo {
  const soNgay = soNgayQuaHan(hd.hanThanhToan)
  if (soNgay <= 30) return '≤30 ngày'
  if (soNgay <= 60) return '31–60 ngày'
  if (soNgay <= 90) return '61–90 ngày'
  return '>90 ngày'
}

export function useDashboardData(filters: DashboardFilters) {
  return useMemo(() => {
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

    const kpi = {
      tongSoHoaDon: hoaDonKy.length,
      tongTien,
      soDaThanhToan,
      daThuTien,
      soCanThu,
      canThuTien,
      tiLeHoanThanh,
    }

    // ---- Tỷ lệ thu theo Xã/Phường (bỏ qua filter Xã/Phường, chỉ theo Cấp học + Kỳ) ----
    const hoaDonKyCapHocScoped = hoaDonList.filter(
      (hd) => hd.ky === filters.ky && capHocScopedTruongIds.has(hd.truongId),
    )
    const tyLeThuTheoPhuong = phuongXaList
      .map((px) => {
        const truongIdsInPx = new Set(
          truongList.filter((t) => t.phuongXaId === px.id && filters.capHocList.includes(t.capHoc)).map((t) => t.id),
        )
        const hds = hoaDonKyCapHocScoped.filter((hd) => truongIdsInPx.has(hd.truongId))
        const tongTienPx = sum(hds, (hd) => hd.soTien)
        const daThuPx = sum(hds, (hd) => hd.daTra)
        return {
          phuongXa: px,
          tyLe: tongTienPx === 0 ? 0 : daThuPx / tongTienPx,
          coDuLieu: truongIdsInPx.size > 0,
        }
      })
      .filter((item) => item.coDuLieu)

    const top10Phuong = [...tyLeThuTheoPhuong].sort((a, b) => b.tyLe - a.tyLe).slice(0, 10)

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
      soPhuongXaCoDuLieu: tyLeThuTheoPhuong.length,
    }
  }, [filters.ky, filters.phuongXaId, filters.capHocList])
}

export type DashboardData = ReturnType<typeof useDashboardData>
