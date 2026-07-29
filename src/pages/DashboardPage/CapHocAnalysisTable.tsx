import {
  Body1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatCurrency, formatNumber } from '../../utils/currency'
import { COL_CAP_HOC, COL_SO_LUONG, COL_SO_TIEN } from '../../utils/tableColumnSizes'
import type { DashboardData } from './useDashboardData'

const useStyles = makeStyles({
  totalRow: {
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorNeutralBackground2,
  },
})

type CapHocRow = DashboardData['phanTichCapHoc'][number]
type TotalRow = Pick<CapHocRow, 'soTruong' | 'soHocSinh' | 'tongPhaiThu' | 'daThu' | 'tyLe'> & { isTotal: true }
type GridRow = (CapHocRow & { isTotal?: false }) | TotalRow

interface CapHocAnalysisTableProps {
  data: DashboardData
  loading?: boolean
}

export function CapHocAnalysisTable({ data, loading }: CapHocAnalysisTableProps) {
  const styles = useStyles()
  const rows = data.phanTichCapHoc

  if (loading) {
    return (
      <SectionCard title="Phân tích theo cấp học">
        <TableSkeleton rows={4} />
      </SectionCard>
    )
  }

  if (rows.length === 0) {
    return (
      <SectionCard title="Phân tích theo cấp học">
        <EmptyState />
      </SectionCard>
    )
  }

  const total: TotalRow = {
    isTotal: true,
    soTruong: rows.reduce((s, r) => s + r.soTruong, 0),
    soHocSinh: rows.reduce((s, r) => s + r.soHocSinh, 0),
    tongPhaiThu: rows.reduce((s, r) => s + r.tongPhaiThu, 0),
    daThu: rows.reduce((s, r) => s + r.daThu, 0),
    tyLe: 0,
  }
  total.tyLe = total.tongPhaiThu === 0 ? 0 : total.daThu / total.tongPhaiThu

  const items: GridRow[] = [...rows, total]

  const columns: TableColumnDefinition<GridRow>[] = [
    createTableColumn<GridRow>({
      columnId: 'capHoc',
      renderHeaderCell: () => 'Cấp học',
      renderCell: (item) => (item.isTotal ? 'TỔNG CỘNG' : item.capHoc),
    }),
    createTableColumn<GridRow>({
      columnId: 'soTruong',
      renderHeaderCell: () => 'Số trường',
      renderCell: (item) => formatNumber(item.soTruong),
    }),
    createTableColumn<GridRow>({
      columnId: 'soHocSinh',
      renderHeaderCell: () => 'Số học sinh',
      renderCell: (item) => formatNumber(item.soHocSinh),
    }),
    createTableColumn<GridRow>({
      columnId: 'tongPhaiThu',
      renderHeaderCell: () => 'Tổng phải thu',
      renderCell: (item) => formatCurrency(item.tongPhaiThu),
    }),
    createTableColumn<GridRow>({
      columnId: 'daThu',
      renderHeaderCell: () => 'Đã thu',
      renderCell: (item) => formatCurrency(item.daThu),
    }),
    createTableColumn<GridRow>({
      columnId: 'tyLe',
      renderHeaderCell: () => 'Tỷ lệ',
      renderCell: (item) => `${Math.round(item.tyLe * 100)}%`,
    }),
  ]

  const columnSizingOptions = {
    capHoc: COL_CAP_HOC,
    soTruong: COL_SO_LUONG,
    soHocSinh: COL_SO_LUONG,
    tongPhaiThu: COL_SO_TIEN,
    daThu: COL_SO_TIEN,
    tyLe: COL_SO_LUONG,
  }

  return (
    <SectionCard title="Phân tích theo cấp học">
      <DataGrid
        items={items}
        columns={columns}
        getRowId={(item: GridRow) => (item.isTotal ? 'total' : item.capHoc)}
        resizableColumns
        columnSizingOptions={columnSizingOptions}
      >
        <TableHeaderRow />
        <DataGridBody<GridRow>>
          {({ item, rowId }) => (
            <DataGridRow<GridRow> key={rowId} className={item.isTotal ? styles.totalRow : undefined}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
    </SectionCard>
  )
}
