import {
  Badge,
  Body1,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  createTableColumn,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { SendRegular } from '@fluentui/react-icons'
import { EmptyState } from '../../components/EmptyState'
import type { NhomTuoiNo } from '../../mock-data'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import type { DebtRow } from './useChiTietData'

const BADGE_COLOR: Record<NhomTuoiNo, 'informative' | 'warning' | 'severe' | 'danger'> = {
  '≤30 ngày': 'informative',
  '31–60 ngày': 'warning',
  '61–90 ngày': 'severe',
  '>90 ngày': 'danger',
}

function mauSoNgayQuaHan(soNgay: number): string {
  if (soNgay <= 30) return tokens.colorPaletteMarigoldForeground2
  if (soNgay <= 90) return tokens.colorPaletteDarkOrangeForeground1
  return tokens.colorPaletteRedForeground1
}

interface ChiTietTableProps {
  rows: DebtRow[]
}

export function ChiTietTable({ rows }: ChiTietTableProps) {
  if (rows.length === 0) {
    return <EmptyState />
  }

  const columns: TableColumnDefinition<DebtRow>[] = [
    createTableColumn<DebtRow>({
      columnId: 'stt',
      renderHeaderCell: () => 'STT',
      renderCell: (item) => rows.indexOf(item) + 1,
    }),
    createTableColumn<DebtRow>({
      columnId: 'maHocSinh',
      renderHeaderCell: () => 'Mã HS',
      renderCell: (item) => item.hocSinh.maHocSinh,
    }),
    createTableColumn<DebtRow>({
      columnId: 'hoTen',
      renderHeaderCell: () => 'Họ tên',
      renderCell: (item) => item.hocSinh.hoTen,
    }),
    createTableColumn<DebtRow>({
      columnId: 'lop',
      renderHeaderCell: () => 'Lớp',
      renderCell: (item) => item.hocSinh.lop,
    }),
    createTableColumn<DebtRow>({
      columnId: 'kyNo',
      renderHeaderCell: () => 'Kỳ nợ',
      renderCell: (item) => item.hoaDon.ky,
    }),
    createTableColumn<DebtRow>({
      columnId: 'soTienNo',
      renderHeaderCell: () => 'Số tiền nợ',
      renderCell: (item) => formatCurrency(item.hoaDon.conLai),
    }),
    createTableColumn<DebtRow>({
      columnId: 'hanThanhToan',
      renderHeaderCell: () => 'Hạn thanh toán',
      renderCell: (item) => formatDate(item.hoaDon.hanThanhToan),
    }),
    createTableColumn<DebtRow>({
      columnId: 'soNgayQuaHan',
      renderHeaderCell: () => 'Số ngày quá hạn',
      renderCell: (item) => (
        <span style={{ color: mauSoNgayQuaHan(item.soNgayQuaHan), fontWeight: tokens.fontWeightSemibold }}>
          {item.soNgayQuaHan}
        </span>
      ),
    }),
    createTableColumn<DebtRow>({
      columnId: 'nhomTuoiNo',
      renderHeaderCell: () => 'Nhóm tuổi nợ',
      renderCell: (item) => (
        <Badge appearance="tint" color={BADGE_COLOR[item.nhomTuoiNo]}>
          {item.nhomTuoiNo}
        </Badge>
      ),
    }),
    createTableColumn<DebtRow>({
      columnId: 'lyDoNo',
      renderHeaderCell: () => 'Lý do nợ/Ghi chú',
      renderCell: (item) => item.lyDoNo,
    }),
    createTableColumn<DebtRow>({
      columnId: 'hanhDong',
      renderHeaderCell: () => 'Hành động',
      renderCell: () => (
        <Button appearance="subtle" icon={<SendRegular />} onClick={() => {}}>
          Gửi nhắc nợ
        </Button>
      ),
    }),
  ]

  return (
    <div>
      <DataGrid items={rows} columns={columns} getRowId={(item: DebtRow) => item.hoaDon.id} resizableColumns>
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<DebtRow>>
          {({ item, rowId }) => (
            <DataGridRow<DebtRow> key={rowId}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
    </div>
  )
}
