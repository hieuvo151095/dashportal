import * as XLSX from 'xlsx'

export interface ExportSheet {
  name: string
  rows: Record<string, unknown>[]
}

// Xuất 1 hoặc nhiều sheet ra file .xlsx thật, tải về ngay ở trình duyệt — dùng chung cho mọi
// nút "Xuất Excel"/"Xuất báo cáo" trong app. Luôn xuất đúng dữ liệu ĐÃ LỌC theo bộ lọc/tab đang
// xem tại thời điểm bấm nút (rows truyền vào phải là dữ liệu hiển thị, không phải dữ liệu gốc).
export function exportToExcel(fileName: string, sheets: ExportSheet[]): void {
  const workbook = XLSX.utils.book_new()
  for (const sheet of sheets) {
    const worksheet = XLSX.utils.json_to_sheet(sheet.rows)
    // Tên sheet trong Excel giới hạn tối đa 31 ký tự.
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31))
  }
  XLSX.writeFile(workbook, fileName)
}
