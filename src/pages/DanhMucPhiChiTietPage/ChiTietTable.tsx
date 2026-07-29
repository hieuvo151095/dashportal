import {
  Body1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  createTableColumn,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { EmptyState } from '../../components/EmptyState'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import type { KhoanPhi } from '../../mock-data'
import { formatCurrency } from '../../utils/currency'
import { COL_BADGE, COL_CAP_HOC, COL_MA, COL_SO_TIEN, COL_STT, COL_TEN } from '../../utils/tableColumnSizes'

// Mã phí (vd "KP-79164762-01") và Tham chiếu pháp lý (vd "TT 55/2011/TTLT-BGDĐT-BTC") dài
// hơn hằng số dùng chung — nới rộng cục bộ cho riêng bảng này, không đổi COL_MA/COL_TEN
// (sẽ ảnh hưởng mọi bảng khác).
const COL_MA_PHI_RONG = { minWidth: 140, defaultWidth: 150 }
const COL_THAM_CHIEU_RONG = { minWidth: 220, defaultWidth: 260 }

interface ChiTietTableProps {
  rows: KhoanPhi[]
}

export function ChiTietTable({ rows }: ChiTietTableProps) {
  const columns: TableColumnDefinition<KhoanPhi>[] = [
    createTableColumn<KhoanPhi>({
      columnId: 'stt',
      renderHeaderCell: () => 'STT',
      renderCell: (item) => rows.indexOf(item) + 1,
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'maPhi',
      renderHeaderCell: () => 'Mã Phí',
      renderCell: (item) => item.maPhi,
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'tenPhi',
      renderHeaderCell: () => 'Tên phí',
      renderCell: (item) => item.tenPhi,
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'soTien',
      renderHeaderCell: () => 'Số tiền',
      renderCell: (item) => formatCurrency(item.soTien),
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'donViTinh',
      renderHeaderCell: () => 'Đơn vị tính',
      renderCell: (item) => item.donViTinh,
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'nguonThu',
      renderHeaderCell: () => 'Nguồn thu',
      renderCell: (item) => item.nguonThu,
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'nhomPhi',
      renderHeaderCell: () => 'Nhóm phí',
      renderCell: (item) => item.nhomPhi,
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'nienKhoa',
      renderHeaderCell: () => 'Niên khoá',
      renderCell: (item) => item.nienKhoa,
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'thamChieuPhapLy',
      renderHeaderCell: () => 'Tham chiếu pháp lý',
      renderCell: (item) => item.thamChieuPhapLy,
    }),
    createTableColumn<KhoanPhi>({
      columnId: 'ghiChu',
      renderHeaderCell: () => 'Ghi chú',
      renderCell: (item) => item.ghiChu || '—',
    }),
  ]

  const columnSizingOptions = {
    stt: COL_STT,
    maPhi: COL_MA_PHI_RONG,
    tenPhi: COL_TEN,
    soTien: COL_SO_TIEN,
    donViTinh: COL_CAP_HOC,
    nguonThu: COL_BADGE,
    nhomPhi: COL_BADGE,
    nienKhoa: COL_MA,
    thamChieuPhapLy: COL_THAM_CHIEU_RONG,
    ghiChu: COL_TEN,
  }

  if (rows.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <DataGrid
        items={rows}
        columns={columns}
        getRowId={(item: KhoanPhi) => item.id}
        resizableColumns
        columnSizingOptions={columnSizingOptions}
      >
        <TableHeaderRow />
        <DataGridBody<KhoanPhi>>
          {({ item, rowId }) => (
            <DataGridRow<KhoanPhi> key={rowId}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Body1 as="p">{`Tổng số phí: ${rows.length}`}</Body1>
    </div>
  )
}
