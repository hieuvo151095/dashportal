import {
  Body1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  Tooltip,
  createTableColumn,
  makeStyles,
  mergeClasses,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { HatGraduationRegular, InfoRegular } from '@fluentui/react-icons'
import { EmptyState } from '../../components/EmptyState'
import { MonoAmount } from '../../components/MonoAmount'
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
  zebraRow: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  hoverableRow: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  khacLabel: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
  khacIcon: {
    color: tokens.colorNeutralForeground3,
    cursor: 'help',
  },
})

const GHI_CHU_KHAC =
  'Gồm các nhóm trường Liên cấp (trải dài từ cấp 1 đến cấp 3) và Trung tâm Giáo dục thường xuyên (TTGDTX).'

type CapHocRow = DashboardData['phanTichCapHoc'][number]
type SoLieuRow = Pick<CapHocRow, 'soTruong' | 'soHocSinh' | 'tongPhaiThu' | 'daThu' | 'tyLe'>
type KhacRow = SoLieuRow & { isKhac: true; isTotal?: false }
type TotalRow = SoLieuRow & { isTotal: true; isKhac?: false }
type GridRow = (CapHocRow & { isTotal?: false; isKhac?: false }) | KhacRow | TotalRow

interface CapHocAnalysisTableProps {
  data: DashboardData
  loading?: boolean
}

export function CapHocAnalysisTable({ data, loading }: CapHocAnalysisTableProps) {
  const styles = useStyles()
  const rows = data.phanTichCapHoc

  if (loading) {
    return (
      <SectionCard title="Phân tích theo cấp học" icon={HatGraduationRegular} iconColor={tokens.colorPaletteBlueForeground2}>
        <TableSkeleton rows={4} />
      </SectionCard>
    )
  }

  if (rows.length === 0) {
    return (
      <SectionCard title="Phân tích theo cấp học" icon={HatGraduationRegular} iconColor={tokens.colorPaletteBlueForeground2}>
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

  // Hàng "Khác" để dành chỗ cho nhóm trường Liên cấp/TTGDTX — luôn hiện 0, không tính vào
  // TỔNG CỘNG (total cộng dồn từ rows, không bao gồm hàng này).
  const khac: KhacRow = { isKhac: true, soTruong: 0, soHocSinh: 0, tongPhaiThu: 0, daThu: 0, tyLe: 0 }

  const items: GridRow[] = [...rows, khac, total]

  const columns: TableColumnDefinition<GridRow>[] = [
    createTableColumn<GridRow>({
      columnId: 'capHoc',
      renderHeaderCell: () => 'Cấp học',
      renderCell: (item) => {
        if (item.isTotal) return 'TỔNG CỘNG'
        if (item.isKhac) {
          return (
            <div className={styles.khacLabel}>
              <span>Khác</span>
              <Tooltip content={GHI_CHU_KHAC} relationship="label">
                <InfoRegular className={styles.khacIcon} fontSize={16} />
              </Tooltip>
            </div>
          )
        }
        return item.capHoc
      },
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
      renderCell: (item) => <MonoAmount>{formatCurrency(item.tongPhaiThu)}</MonoAmount>,
    }),
    createTableColumn<GridRow>({
      columnId: 'daThu',
      renderHeaderCell: () => 'Đã thu',
      renderCell: (item) => <MonoAmount>{formatCurrency(item.daThu)}</MonoAmount>,
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
        getRowId={(item: GridRow) => (item.isTotal ? 'total' : item.isKhac ? 'khac' : item.capHoc)}
        resizableColumns
        columnSizingOptions={columnSizingOptions}
      >
        <TableHeaderRow />
        <DataGridBody<GridRow>>
          {({ item, rowId }) => (
            <DataGridRow<GridRow>
              key={rowId}
              className={mergeClasses(
                items.indexOf(item) % 2 === 1 && styles.zebraRow,
                styles.hoverableRow,
                item.isTotal && styles.totalRow,
              )}
            >
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
    </SectionCard>
  )
}
