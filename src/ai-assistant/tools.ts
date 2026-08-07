import {
  CAP_HOC_LIST,
  NIEN_KHOA,
  NIEN_KHOA_LIST,
  TODAY,
  mockDataset,
  type CapHoc,
  type HoaDon,
  type NhomTuoiNo,
  type PhuongXa,
  type Truong,
} from '../mock-data'
import { dongBoDemoTheoPhuong } from '../pages/DashboardPage/syncComplianceMockData'
import { NHOM_TUOI_NO_LIST, nhomTuoiNoCua } from '../utils/congNo'
import { formatCurrencyWithUnit } from '../utils/currency'
import { soNgayTreCuaTruong } from '../utils/dongBo'
import { DEFAULT_KY, getKyOptions } from '../utils/ky'
import { chuanHoaTiengViet } from '../utils/vietnamese'
import type { ToolDefinition } from './types'

const KY_OPTIONS = getKyOptions()
const KY_INDEX = new Map(KY_OPTIONS.map((ky, index) => [ky, index]))

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0)
}

function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : undefined
}

function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined
  const arr = v.filter((x): x is string => typeof x === 'string')
  return arr.length > 0 ? arr : undefined
}

function tyLe(value: number): number {
  return Math.round(value * 1000) / 1000
}

// Kỳ dạng "MM/YYYY" mới so sánh được theo khoảng từ-đến (giống useTongHopData.ts của trang
// Công nợ Tổng hợp) — hoá đơn niên khoá không có khái niệm "trong khoảng tháng" nên luôn tính
// vào phạm vi.
function trongPhamViKy(ky: string, kyTu: string, kyDen: string): boolean {
  const idx = KY_INDEX.get(ky)
  if (idx === undefined) return true
  const idxTu = KY_INDEX.get(kyTu) ?? 0
  const idxDen = KY_INDEX.get(kyDen) ?? KY_OPTIONS.length - 1
  return idx >= idxTu && idx <= idxDen
}

function clampKy(ky: unknown): string {
  const value = asString(ky)
  return value && KY_OPTIONS.includes(value) ? value : DEFAULT_KY
}

function clampKyRange(kyTu: unknown, kyDen: unknown): { kyTu: string; kyDen: string } {
  const tuValue = asString(kyTu)
  const denValue = asString(kyDen)
  const idxTu = tuValue && KY_INDEX.has(tuValue) ? KY_INDEX.get(tuValue)! : 0
  const idxDen = denValue && KY_INDEX.has(denValue) ? KY_INDEX.get(denValue)! : KY_OPTIONS.length - 1
  const lo = Math.min(idxTu, idxDen)
  const hi = Math.max(idxTu, idxDen)
  return { kyTu: KY_OPTIONS[lo], kyDen: KY_OPTIONS[hi] }
}

function clampNhomTuoiNo(list: unknown): NhomTuoiNo[] {
  const values = asStringArray(list)?.filter((v): v is NhomTuoiNo => (NHOM_TUOI_NO_LIST as string[]).includes(v))
  return values && values.length > 0 ? values : NHOM_TUOI_NO_LIST
}

function clampCapHoc(list: unknown): CapHoc[] {
  const values = asStringArray(list)?.filter((v): v is CapHoc => (CAP_HOC_LIST as string[]).includes(v))
  return values && values.length > 0 ? values : CAP_HOC_LIST
}

// So khớp 1 chiều: dữ liệu thật (chuẩn hoá) CHỨA chuỗi truy vấn (chuẩn hoá) — cố tình không so
// khớp chiều ngược lại (truy vấn chứa dữ liệu), vì nhiều tên trường/học sinh là tiền tố của nhau
// (vd "Trường THPT Nguyễn Bỉnh Khiêm" vs "...Khiêm 4") — so khớp 2 chiều từng gây nhận nhầm sang
// bản ghi có tên ngắn hơn trùng tiền tố. `PhuongXa.ten` đã có sẵn tiền tố "Phường"/"Xã"/"Đặc khu"
// (xem mock-data/phuongXa.ts), nên truy vấn có hoặc không kèm tiền tố đều khớp được qua includes().
function findTruong(query: string): Truong | undefined {
  const q = chuanHoaTiengViet(query)
  if (!q) return undefined
  const byMa = mockDataset.truongList.find((t) => chuanHoaTiengViet(t.maTruong) === q)
  if (byMa) return byMa
  return mockDataset.truongList.find((t) => chuanHoaTiengViet(t.tenTruong).includes(q))
}

function findPhuongXa(query: string): PhuongXa | undefined {
  const q = chuanHoaTiengViet(query)
  if (!q) return undefined
  const exact = mockDataset.phuongXaList.find((p) => chuanHoaTiengViet(p.ten) === q)
  if (exact) return exact
  return mockDataset.phuongXaList.find((p) => chuanHoaTiengViet(p.ten).includes(q))
}

function findHocSinh(query: string) {
  const q = chuanHoaTiengViet(query)
  if (!q) return undefined
  const byMa = mockDataset.hocSinhList.find((hs) => chuanHoaTiengViet(hs.maHocSinh) === q)
  if (byMa) return byMa
  return mockDataset.hocSinhList.find((hs) => chuanHoaTiengViet(hs.hoTen).includes(q))
}

// Mirrors CongNoTongHopPage/useTongHopData.ts (rows), không giới hạn phạm vi Xã/Phường-Trường
// vì tool trả lời cho toàn thành phố.
function tinhCongNoRows(kyTu: string, kyDen: string, nhomTuoiNoList: NhomTuoiNo[]) {
  const { phuongXaList, truongList, hoaDonList } = mockDataset
  const phuongXaById = new Map(phuongXaList.map((p) => [p.id, p]))

  const hoaDonScoped = hoaDonList.filter((hd) => trongPhamViKy(hd.ky, kyTu, kyDen))
  const hoaDonNo = hoaDonScoped.filter((hd) => hd.trangThai !== 'Đã thanh toán')
  const hoaDonNoLoc = hoaDonNo.filter((hd) => nhomTuoiNoList.includes(nhomTuoiNoCua(hd)))

  const congNoByTruong = new Map<string, HoaDon[]>()
  for (const hd of hoaDonNoLoc) {
    const list = congNoByTruong.get(hd.truongId) ?? []
    list.push(hd)
    congNoByTruong.set(hd.truongId, list)
  }

  return truongList
    .map((truong) => {
      const hds = congNoByTruong.get(truong.id) ?? []
      if (hds.length === 0) return null
      const tienTheoNhom = new Map<NhomTuoiNo, number>()
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
}

// Mirrors DashboardPage/useDashboardData.ts (tyLeThuTheoPhuong), không lọc theo Cấp học vì tool
// trả lời chung cho toàn thành phố.
function tinhTyLeThuTheoPhuong(ky: string) {
  const { phuongXaList, truongList, hoaDonList } = mockDataset
  const hoaDonKy = hoaDonList.filter((hd) => hd.ky === ky)
  return phuongXaList.map((px) => {
    const truongIdsInPx = new Set(truongList.filter((t) => t.phuongXaId === px.id).map((t) => t.id))
    const hds = hoaDonKy.filter((hd) => truongIdsInPx.has(hd.truongId))
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
}

const KY_ENUM_NOTE = `Kỳ hợp lệ (định dạng "MM/YYYY"): ${KY_OPTIONS.join(', ')}. Kỳ hiện tại (dùng khi người dùng hỏi "tháng này"/"hiện tại"): ${DEFAULT_KY}.`

const topTruongCongNoCao: ToolDefinition = {
  name: 'topTruongCongNoCao',
  description: `Trả về Top N trường có công nợ (số tiền chưa thu) cao nhất, tính trong 1 khoảng Kỳ (kyTu-kyDen), toàn thành phố. Dùng cho câu hỏi kiểu "trường nào công nợ cao nhất". ${KY_ENUM_NOTE} Nếu chỉ hỏi 1 kỳ, đặt kyTu = kyDen = kỳ đó.`,
  inputSchema: {
    type: 'object',
    properties: {
      kyTu: { type: 'string', enum: KY_OPTIONS, description: 'Kỳ bắt đầu (MM/YYYY). Mặc định kỳ sớm nhất trong 6 kỳ gần nhất nếu bỏ trống.' },
      kyDen: { type: 'string', enum: KY_OPTIONS, description: 'Kỳ kết thúc (MM/YYYY). Mặc định kỳ hiện tại nếu bỏ trống.' },
      n: { type: 'integer', description: 'Số lượng trường muốn lấy, mặc định 10, tối đa 50.' },
      nhomTuoiNo: {
        type: 'array',
        items: { type: 'string', enum: NHOM_TUOI_NO_LIST },
        description: 'Lọc theo nhóm tuổi nợ. Bỏ trống = tất cả nhóm.',
      },
    },
  },
  execute: (input) => {
    const { kyTu, kyDen } = clampKyRange(input.kyTu, input.kyDen)
    const nhomTuoiNoList = clampNhomTuoiNo(input.nhomTuoiNo)
    const nRaw = asNumber(input.n)
    const n = nRaw && nRaw > 0 ? Math.min(Math.round(nRaw), 50) : 10
    const rows = tinhCongNoRows(kyTu, kyDen, nhomTuoiNoList).slice(0, n)
    return {
      kyTu,
      kyDen,
      donVi: 'đồng',
      soLuongTraVe: rows.length,
      danhSach: rows.map((r) => ({
        maTruong: r.truong.maTruong,
        tenTruong: r.truong.tenTruong,
        phuongXa: r.phuongXa.ten,
        soTienChuaThu: r.soTienChuaThu,
        soTienChuaThuFormatted: formatCurrencyWithUnit(r.soTienChuaThu),
        soHocSinhChuaThanhToan: r.soHocSinhChuaThanhToan,
        nhomTuoiNoUuThe: r.nhomTuoiNoUuThe,
      })),
    }
  },
  cta: (input) => {
    const { kyTu, kyDen } = clampKyRange(input.kyTu, input.kyDen)
    return {
      route: `/cong-no/tong-hop?kyTu=${encodeURIComponent(kyTu)}&kyDen=${encodeURIComponent(kyDen)}`,
      label: 'Xem chi tiết tại Công nợ Tổng hợp',
    }
  },
}

const tongCongNoTheoKhoangKy: ToolDefinition = {
  name: 'tongCongNoTheoKhoangKy',
  description: `Trả về tổng công nợ (tổng số tiền chưa thu) toàn thành phố trong 1 khoảng Kỳ, kèm phân tích theo nhóm tuổi nợ (≤30/31-60/61-90/>90 ngày). Dùng cho câu hỏi kiểu "tổng công nợ hiện tại là bao nhiêu", "công nợ quá hạn trên 90 ngày là bao nhiêu". ${KY_ENUM_NOTE}`,
  inputSchema: {
    type: 'object',
    properties: {
      kyTu: { type: 'string', enum: KY_OPTIONS },
      kyDen: { type: 'string', enum: KY_OPTIONS },
      nhomTuoiNo: {
        type: 'array',
        items: { type: 'string', enum: NHOM_TUOI_NO_LIST },
        description: 'Lọc theo nhóm tuổi nợ. Bỏ trống = tất cả nhóm.',
      },
    },
  },
  execute: (input) => {
    const { kyTu, kyDen } = clampKyRange(input.kyTu, input.kyDen)
    const nhomTuoiNoList = clampNhomTuoiNo(input.nhomTuoiNo)
    const { hoaDonList } = mockDataset

    const hoaDonScoped = hoaDonList.filter((hd) => trongPhamViKy(hd.ky, kyTu, kyDen))
    const hoaDonNo = hoaDonScoped.filter((hd) => hd.trangThai !== 'Đã thanh toán')
    const hoaDonNoLoc = hoaDonNo.filter((hd) => nhomTuoiNoList.includes(nhomTuoiNoCua(hd)))

    const tongCongNo = sum(hoaDonNoLoc, (hd) => hd.conLai)
    const soHocSinhChuaDong = new Set(hoaDonNoLoc.map((hd) => hd.hocSinhId)).size
    const tongSoTienHoaDon = sum(hoaDonScoped, (hd) => hd.soTien)
    const tyLeNoTrungBinh = tongSoTienHoaDon === 0 ? 0 : tongCongNo / tongSoTienHoaDon
    const congNoQuaHan90 = sum(
      hoaDonNoLoc.filter((hd) => nhomTuoiNoCua(hd) === '>90 ngày'),
      (hd) => hd.conLai,
    )

    const tuoiNoMap = new Map<NhomTuoiNo, { tongTien: number; hocSinhIds: Set<string> }>()
    for (const nhom of NHOM_TUOI_NO_LIST) tuoiNoMap.set(nhom, { tongTien: 0, hocSinhIds: new Set() })
    for (const hd of hoaDonNo) {
      const entry = tuoiNoMap.get(nhomTuoiNoCua(hd))!
      entry.tongTien += hd.conLai
      entry.hocSinhIds.add(hd.hocSinhId)
    }

    return {
      kyTu,
      kyDen,
      donVi: 'đồng',
      tongCongNo,
      tongCongNoFormatted: formatCurrencyWithUnit(tongCongNo),
      soHocSinhChuaDong,
      tyLeNoTrungBinh: tyLe(tyLeNoTrungBinh),
      congNoQuaHan90,
      congNoQuaHan90Formatted: formatCurrencyWithUnit(congNoQuaHan90),
      congNoTheoTuoiNo: NHOM_TUOI_NO_LIST.map((nhom) => {
        const entry = tuoiNoMap.get(nhom)!
        return {
          nhom,
          tongTien: entry.tongTien,
          tongTienFormatted: formatCurrencyWithUnit(entry.tongTien),
          soHocSinh: entry.hocSinhIds.size,
        }
      }),
    }
  },
  cta: (input) => {
    const { kyTu, kyDen } = clampKyRange(input.kyTu, input.kyDen)
    return {
      route: `/cong-no/tong-hop?kyTu=${encodeURIComponent(kyTu)}&kyDen=${encodeURIComponent(kyDen)}`,
      label: 'Xem chi tiết tại Công nợ Tổng hợp',
    }
  },
}

const tyLeThuToanThanhPho: ToolDefinition = {
  name: 'tyLeThuToanThanhPho',
  description: `Trả về tỷ lệ thu học phí (đã thu / tổng phải thu) của toàn thành phố tại 1 Kỳ, hoặc của riêng 1 Phường/Xã nếu truyền xaPhuongTen. Dùng cho câu hỏi kiểu "tỷ lệ thu học phí hiện tại là bao nhiêu", "tỷ lệ thu ở phường X thế nào". ${KY_ENUM_NOTE}`,
  inputSchema: {
    type: 'object',
    properties: {
      ky: { type: 'string', enum: KY_OPTIONS },
      xaPhuongTen: { type: 'string', description: 'Tên Phường/Xã muốn tra riêng (khớp gần đúng). Bỏ trống = chỉ trả về số liệu toàn thành phố.' },
    },
  },
  execute: (input) => {
    const ky = clampKy(input.ky)
    const { hoaDonList } = mockDataset
    const hoaDonKy = hoaDonList.filter((hd) => hd.ky === ky)
    const tongTien = sum(hoaDonKy, (hd) => hd.soTien)
    const daThuTien = sum(hoaDonKy, (hd) => hd.daTra)
    const canThuTien = tongTien - daThuTien
    const tyLeToanThanhPhoValue = tongTien === 0 ? 0 : daThuTien / tongTien

    const base = {
      ky,
      donVi: 'đồng',
      tyLeToanThanhPho: tyLe(tyLeToanThanhPhoValue),
      tongTien,
      daThuTien,
      canThuTien,
      tongTienFormatted: formatCurrencyWithUnit(tongTien),
      daThuTienFormatted: formatCurrencyWithUnit(daThuTien),
      canThuTienFormatted: formatCurrencyWithUnit(canThuTien),
    }

    const xaPhuongTen = asString(input.xaPhuongTen)
    if (!xaPhuongTen) return base

    const px = findPhuongXa(xaPhuongTen)
    if (!px) return { ...base, ghiChu: `Không tìm thấy Phường/Xã khớp với "${xaPhuongTen}".` }

    const row = tinhTyLeThuTheoPhuong(ky).find((r) => r.phuongXa.id === px.id)!
    return {
      ...base,
      xaPhuong: px.ten,
      coDuLieuXaPhuong: row.coDuLieu,
      tyLeXaPhuong: row.coDuLieu ? tyLe(row.tyLe) : null,
      daThuTienXaPhuong: row.daThuTien,
      daThuTienXaPhuongFormatted: formatCurrencyWithUnit(row.daThuTien),
      conThuTienXaPhuong: row.conThuTien,
    }
  },
  cta: (input) => {
    const ky = clampKy(input.ky)
    const xaPhuongTen = asString(input.xaPhuongTen)
    if (xaPhuongTen) {
      const px = findPhuongXa(xaPhuongTen)
      if (px) return { route: `/dashboard?ky=${encodeURIComponent(ky)}&xa=${encodeURIComponent(px.id)}`, label: 'Xem chi tiết tại Dashboard' }
    }
    return { route: `/dashboard?ky=${encodeURIComponent(ky)}`, label: 'Xem chi tiết tại Dashboard' }
  },
}

const top10XaPhuongTyLeThuCaoNhat: ToolDefinition = {
  name: 'top10XaPhuongTyLeThuCaoNhat',
  description: `Trả về Top 10 Phường/Xã có tỷ lệ thu học phí cao nhất tại 1 Kỳ (chỉ tính các khu đã có trường/dữ liệu). ${KY_ENUM_NOTE}`,
  inputSchema: {
    type: 'object',
    properties: {
      ky: { type: 'string', enum: KY_OPTIONS },
    },
  },
  execute: (input) => {
    const ky = clampKy(input.ky)
    const rows = tinhTyLeThuTheoPhuong(ky)
      .filter((r) => r.coDuLieu)
      .sort((a, b) => b.tyLe - a.tyLe)
      .slice(0, 10)
    return {
      ky,
      donVi: 'đồng',
      danhSach: rows.map((r) => ({
        xaPhuong: r.phuongXa.ten,
        tyLe: tyLe(r.tyLe),
        daThuTien: r.daThuTien,
        daThuTienFormatted: formatCurrencyWithUnit(r.daThuTien),
        conThuTien: r.conThuTien,
      })),
    }
  },
  cta: (input) => ({ route: `/dashboard?ky=${encodeURIComponent(clampKy(input.ky))}`, label: 'Xem chi tiết tại Dashboard' }),
}

const tinhTrangDongBoDuLieu: ToolDefinition = {
  name: 'tinhTrangDongBoDuLieu',
  description: `Trả về tình trạng tuân thủ đồng bộ dữ liệu (168 Phường/Xã/Đặc khu TP.HCM) tại 1 Kỳ: tỷ lệ đồng bộ trung bình toàn thành phố, và danh sách Phường/Xã có trường đồng bộ trễ hơn ngưỡng ngày cho trước. Dùng cho câu hỏi kiểu "có bao nhiêu Phường/Xã chưa đồng bộ dữ liệu quá N ngày". ${KY_ENUM_NOTE}`,
  inputSchema: {
    type: 'object',
    properties: {
      ky: { type: 'string', enum: KY_OPTIONS },
      soNgayTreHan: { type: 'integer', description: 'Ngưỡng số ngày trễ để tính là "chưa đồng bộ". Mặc định 15.' },
    },
  },
  execute: (input) => {
    const ky = clampKy(input.ky)
    const nguongRaw = asNumber(input.soNgayTreHan)
    const nguong = nguongRaw && nguongRaw > 0 ? Math.round(nguongRaw) : 15

    const rows = mockDataset.phuongXaList.map((px) => {
      const truongDemoTrongKhu = dongBoDemoTheoPhuong[px.id] ?? []
      const danhSachTruong = truongDemoTrongKhu.map((truong) => {
        const soNgayTre = soNgayTreCuaTruong(truong, ky)
        return { daDongBo: soNgayTre === 0, soNgayTre }
      })
      const soDungHan = danhSachTruong.filter((t) => t.daDongBo).length
      const soTruongTreQuaNguong = danhSachTruong.filter((t) => t.soNgayTre > nguong).length
      return {
        phuongXa: px,
        soTruong: truongDemoTrongKhu.length,
        tyLeDongBo: truongDemoTrongKhu.length === 0 ? 0 : soDungHan / truongDemoTrongKhu.length,
        soTruongTreQuaNguong,
      }
    })

    const tyLeDongBoTrungBinh = rows.length === 0 ? 0 : sum(rows, (r) => r.tyLeDongBo) / rows.length
    const phuongTre = rows.filter((r) => r.soTruongTreQuaNguong > 0).sort((a, b) => b.soTruongTreQuaNguong - a.soTruongTreQuaNguong)

    return {
      ky,
      soNgayTreHan: nguong,
      tyLeDongBoTrungBinh: tyLe(tyLeDongBoTrungBinh),
      soPhuongXaCoTruongTreQuaNguong: phuongTre.length,
      danhSachPhuongTre: phuongTre.slice(0, 20).map((r) => ({
        xaPhuong: r.phuongXa.ten,
        soTruongTreQuaNguong: r.soTruongTreQuaNguong,
        tyLeDongBo: tyLe(r.tyLeDongBo),
      })),
    }
  },
  cta: (input) => ({ route: `/dashboard?ky=${encodeURIComponent(clampKy(input.ky))}`, label: 'Xem chi tiết tại Dashboard' }),
}

const xuHuongThuTheoThang: ToolDefinition = {
  name: 'xuHuongThuTheoThang',
  description:
    'Trả về xu hướng thu học phí (tổng phải thu, đã thu, tỷ lệ) theo 6 tháng gần nhất tính đến hiện tại, nhóm theo ngày lập hoá đơn, toàn thành phố. Dùng cho câu hỏi kiểu "xu hướng thu học phí gần đây thế nào". Không nhận tham số.',
  inputSchema: { type: 'object', properties: {} },
  execute: () => {
    const SO_THANG = 6
    const danhSachThang: Date[] = []
    for (let i = SO_THANG - 1; i >= 0; i--) {
      danhSachThang.push(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1))
    }
    const laCungThang = (isoDate: string, thang: Date) => {
      const d = new Date(isoDate)
      return d.getFullYear() === thang.getFullYear() && d.getMonth() === thang.getMonth()
    }
    const formatKyThang = (date: Date) => `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`

    const danhSach = danhSachThang.map((thang) => {
      const hds = mockDataset.hoaDonList.filter((hd) => laCungThang(hd.ngayLap, thang))
      const tongTien = sum(hds, (hd) => hd.soTien)
      const daThu = sum(hds, (hd) => hd.daTra)
      return {
        thang: formatKyThang(thang),
        tongTien,
        daThu,
        tongTienFormatted: formatCurrencyWithUnit(tongTien),
        daThuFormatted: formatCurrencyWithUnit(daThu),
        tyLe: tongTien === 0 ? 0 : tyLe(daThu / tongTien),
      }
    })

    return { donVi: 'đồng', danhSach }
  },
  cta: () => ({ route: '/dashboard', label: 'Xem chi tiết tại Dashboard' }),
}

const phanTichTheoCapHoc: ToolDefinition = {
  name: 'phanTichTheoCapHoc',
  description: `Trả về phân tích thu học phí theo từng Cấp học (Mầm non/Tiểu học/THCS/THPT) tại 1 Kỳ, toàn thành phố: số trường, số học sinh, tổng phải thu, đã thu, tỷ lệ. ${KY_ENUM_NOTE}`,
  inputSchema: {
    type: 'object',
    properties: {
      ky: { type: 'string', enum: KY_OPTIONS },
    },
  },
  execute: (input) => {
    const ky = clampKy(input.ky)
    const { truongList, hocSinhList, hoaDonList } = mockDataset
    const hoaDonKy = hoaDonList.filter((hd) => hd.ky === ky)
    const danhSach = CAP_HOC_LIST.map((capHoc) => {
      const truongNhom = truongList.filter((t) => t.capHoc === capHoc)
      const truongIdsNhom = new Set(truongNhom.map((t) => t.id))
      const hds = hoaDonKy.filter((hd) => truongIdsNhom.has(hd.truongId))
      const tongPhaiThu = sum(hds, (hd) => hd.soTien)
      const daThu = sum(hds, (hd) => hd.daTra)
      return {
        capHoc,
        soTruong: truongNhom.length,
        soHocSinh: hocSinhList.filter((hs) => truongIdsNhom.has(hs.truongId)).length,
        tongPhaiThu,
        daThu,
        tongPhaiThuFormatted: formatCurrencyWithUnit(tongPhaiThu),
        daThuFormatted: formatCurrencyWithUnit(daThu),
        tyLe: tongPhaiThu === 0 ? 0 : tyLe(daThu / tongPhaiThu),
      }
    })
    return { ky, donVi: 'đồng', danhSach }
  },
  cta: (input) => ({ route: `/dashboard?ky=${encodeURIComponent(clampKy(input.ky))}`, label: 'Xem chi tiết tại Dashboard' }),
}

const danhMucKhoanThuTruong: ToolDefinition = {
  name: 'danhMucKhoanThuTruong',
  description: `Trả về danh mục khoản thu (danh mục phí) của 1 trường theo mã trường hoặc tên trường (khớp gần đúng), trong 1 niên khoá. Niên khoá hợp lệ: ${NIEN_KHOA_LIST.join(', ')}. Mặc định niên khoá hiện tại (${NIEN_KHOA}) nếu bỏ trống.`,
  inputSchema: {
    type: 'object',
    properties: {
      maTruongHoacTenTruong: { type: 'string', description: 'Mã trường (vd "79010001") hoặc tên trường (khớp gần đúng, không cần chính xác 100%).' },
      nienKhoa: { type: 'string', enum: NIEN_KHOA_LIST },
    },
    required: ['maTruongHoacTenTruong'],
  },
  execute: (input) => {
    const query = asString(input.maTruongHoacTenTruong)
    if (!query) return { loi: 'Thiếu tham số maTruongHoacTenTruong.' }
    const truong = findTruong(query)
    if (!truong) return { loi: `Không tìm thấy trường khớp với "${query}".` }
    const nienKhoaRaw = asString(input.nienKhoa)
    const nienKhoa = nienKhoaRaw && NIEN_KHOA_LIST.includes(nienKhoaRaw) ? nienKhoaRaw : NIEN_KHOA

    const danhSach = mockDataset.khoanPhiList
      .filter((k) => k.truongId === truong.id && k.nienKhoa === nienKhoa)
      .map((k) => ({
        maPhi: k.maPhi,
        tenPhi: k.tenPhi,
        soTien: k.soTien,
        soTienFormatted: formatCurrencyWithUnit(k.soTien),
        donViTinh: k.donViTinh,
        nguonThu: k.nguonThu,
        nhomPhi: k.nhomPhi,
        danhMucKhoanThu: k.danhMucKhoanThu,
      }))

    return {
      maTruong: truong.maTruong,
      tenTruong: truong.tenTruong,
      nienKhoa,
      soLuongKhoanPhi: danhSach.length,
      danhSach,
    }
  },
  cta: (input) => {
    const query = asString(input.maTruongHoacTenTruong)
    const truong = query ? findTruong(query) : undefined
    if (!truong) return null
    const nienKhoaRaw = asString(input.nienKhoa)
    const nienKhoa = nienKhoaRaw && NIEN_KHOA_LIST.includes(nienKhoaRaw) ? nienKhoaRaw : NIEN_KHOA
    return {
      route: `/danh-muc-phi/chi-tiet?truong=${encodeURIComponent(truong.id)}&nienKhoa=${encodeURIComponent(nienKhoa)}`,
      label: 'Xem chi tiết tại Danh mục Phí',
    }
  },
}

const hoaDonHocSinh: ToolDefinition = {
  name: 'hoaDonHocSinh',
  description:
    'Trả về danh sách hoá đơn của 1 học sinh, tìm theo mã học sinh hoặc họ tên (khớp gần đúng). Có thể lọc theo 1 Kỳ cụ thể. Dùng cho câu hỏi về tình trạng đóng học phí của 1 học sinh cụ thể.',
  inputSchema: {
    type: 'object',
    properties: {
      maHoacTenHocSinh: { type: 'string', description: 'Mã học sinh (vd "HS0001001") hoặc họ tên học sinh.' },
      ky: { type: 'string', enum: KY_OPTIONS, description: 'Lọc theo 1 Kỳ cụ thể. Bỏ trống = tất cả hoá đơn của học sinh.' },
    },
    required: ['maHoacTenHocSinh'],
  },
  execute: (input) => {
    const query = asString(input.maHoacTenHocSinh)
    if (!query) return { loi: 'Thiếu tham số maHoacTenHocSinh.' }
    const hocSinh = findHocSinh(query)
    if (!hocSinh) return { loi: `Không tìm thấy học sinh khớp với "${query}".` }
    const truong = mockDataset.truongList.find((t) => t.id === hocSinh.truongId)

    const kyFilter = asString(input.ky)
    let hoaDonList = mockDataset.hoaDonList.filter((hd) => hd.hocSinhId === hocSinh.id)
    if (kyFilter) hoaDonList = hoaDonList.filter((hd) => hd.ky === kyFilter)

    return {
      hocSinh: {
        maHocSinh: hocSinh.maHocSinh,
        hoTen: hocSinh.hoTen,
        lop: hocSinh.lop,
        khoi: hocSinh.khoi,
        tenTruong: truong?.tenTruong ?? '',
      },
      donVi: 'đồng',
      soLuongHoaDon: hoaDonList.length,
      danhSach: hoaDonList.map((hd) => ({
        soHoaDon: hd.soHoaDon,
        ky: hd.ky,
        soTien: hd.soTien,
        daTra: hd.daTra,
        conLai: hd.conLai,
        soTienFormatted: formatCurrencyWithUnit(hd.soTien),
        conLaiFormatted: formatCurrencyWithUnit(hd.conLai),
        // "Đã gửi" hiển thị trên UI là "Chưa thanh toán" (xem ThuHocPhiChiTietPage/useChiTietData.ts).
        trangThai: hd.trangThai === 'Đã gửi' ? 'Chưa thanh toán' : hd.trangThai,
        hanThanhToan: hd.hanThanhToan,
        ngayThanhToan: hd.ngayThanhToan,
      })),
    }
  },
  cta: (input) => {
    const query = asString(input.maHoacTenHocSinh)
    const hocSinh = query ? findHocSinh(query) : undefined
    if (!hocSinh) return null
    return {
      route: `/thu-hoc-phi/chi-tiet?truong=${encodeURIComponent(hocSinh.truongId)}&q=${encodeURIComponent(hocSinh.maHocSinh)}`,
      label: 'Xem chi tiết tại Thu Học phí',
    }
  },
}

const top20TruongCongNoDashboard: ToolDefinition = {
  name: 'top20TruongCongNoDashboard',
  description:
    'Trả về Top 20 trường có tổng công nợ cao nhất, tính trên TOÀN BỘ hoá đơn còn nợ (không giới hạn theo Kỳ) — đúng logic widget "Top 20 trường công nợ" ở trang Dashboard. Có thể lọc theo tên Phường/Xã và/hoặc Cấp học.',
  inputSchema: {
    type: 'object',
    properties: {
      phuongXaTen: { type: 'string', description: 'Lọc theo tên Phường/Xã (khớp gần đúng). Bỏ trống = toàn thành phố.' },
      capHoc: {
        type: 'array',
        items: { type: 'string', enum: CAP_HOC_LIST },
        description: 'Lọc theo Cấp học. Bỏ trống = tất cả cấp học.',
      },
    },
  },
  execute: (input) => {
    const { truongList, phuongXaList, hoaDonList } = mockDataset
    const phuongXaById = new Map(phuongXaList.map((p) => [p.id, p]))
    const truongById = new Map(truongList.map((t) => [t.id, t]))

    const phuongXaTen = asString(input.phuongXaTen)
    const px = phuongXaTen ? findPhuongXa(phuongXaTen) : undefined
    if (phuongXaTen && !px) return { loi: `Không tìm thấy Phường/Xã khớp với "${phuongXaTen}".` }
    const capHocList = clampCapHoc(input.capHoc)

    const scopedTruongIds = new Set(
      truongList.filter((t) => (!px || t.phuongXaId === px.id) && capHocList.includes(t.capHoc)).map((t) => t.id),
    )

    const hoaDonConNo = hoaDonList.filter((hd) => scopedTruongIds.has(hd.truongId) && hd.trangThai !== 'Đã thanh toán')
    const congNoByTruong = new Map<string, { tongNo: number; hocSinhIds: Set<string> }>()
    for (const hd of hoaDonConNo) {
      const entry = congNoByTruong.get(hd.truongId) ?? { tongNo: 0, hocSinhIds: new Set<string>() }
      entry.tongNo += hd.conLai
      entry.hocSinhIds.add(hd.hocSinhId)
      congNoByTruong.set(hd.truongId, entry)
    }

    const danhSach = [...congNoByTruong.entries()]
      .map(([truongId, v]) => {
        const truong = truongById.get(truongId)!
        return {
          maTruong: truong.maTruong,
          tenTruong: truong.tenTruong,
          phuongXa: phuongXaById.get(truong.phuongXaId)!.ten,
          tongNo: v.tongNo,
          tongNoFormatted: formatCurrencyWithUnit(v.tongNo),
          soHocSinh: v.hocSinhIds.size,
        }
      })
      .sort((a, b) => b.tongNo - a.tongNo)
      .slice(0, 20)

    return { donVi: 'đồng', danhSach }
  },
  cta: () => ({ route: '/dashboard', label: 'Xem chi tiết tại Dashboard' }),
}

export const AI_TOOLS: ToolDefinition[] = [
  topTruongCongNoCao,
  tongCongNoTheoKhoangKy,
  tyLeThuToanThanhPho,
  top10XaPhuongTyLeThuCaoNhat,
  tinhTrangDongBoDuLieu,
  xuHuongThuTheoThang,
  phanTichTheoCapHoc,
  danhMucKhoanThuTruong,
  hoaDonHocSinh,
  top20TruongCongNoDashboard,
]

export function findAiTool(name: string): ToolDefinition | undefined {
  return AI_TOOLS.find((tool) => tool.name === name)
}
