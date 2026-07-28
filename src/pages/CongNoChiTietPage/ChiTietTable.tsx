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
  makeStyles,
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

const useStyles = makeStyles({
  scroll: {
    overflowX: 'auto',
  },
})

const COLUMN_SIZING_OPTIONS = {
  stt: { minWidth: 48, defaultWidth: 48 },
  maHocSinh: { minWidth: 110, defaultWidth: 120 },
  hoTen: { minWidth: 140, defaultWidth: 160 },
  lop: { minWidth: 90, defaultWidth: 100 },
  kyNo: { minWidth: 90, defaultWidth: 100 },
  soTienNo: { minWidth: 120, defaultWidth: 130 },
  hanThanhToan: { minWidth: 120, defaultWidth: 130 },
  soNgayQuaHan: { minWidth: 130, defaultWidth: 140 },
  nhomTuoiNo: { minWidth: 110, defaultWidth: 120 },
  lyDoNo: { minWidth: 180, defaultWidth: 200 },
  hanhDong: { minWidth: 150, defaultWidth: 160 },
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
  const styles = useStyles()

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
      <div className={styles.scroll}>
        <DataGrid
          items={rows}
          columns={columns}
          getRowId={(item: DebtRow) => item.hoaDon.id}
          resizableColumns
          columnSizingOptions={COLUMN_SIZING_OPTIONS}
        >
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
      </div>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
    </div>
  )
}
