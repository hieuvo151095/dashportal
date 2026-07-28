import {
  Body1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  createTableColumn,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { EmptyState } from '../../components/EmptyState'
import type { KhoanPhi } from '../../mock-data'
import { formatCurrency } from '../../utils/currency'

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

  if (rows.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <DataGrid items={rows} columns={columns} getRowId={(item: KhoanPhi) => item.id} resizableColumns>
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
          </DataGridRow>
        </DataGridHeader>
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
