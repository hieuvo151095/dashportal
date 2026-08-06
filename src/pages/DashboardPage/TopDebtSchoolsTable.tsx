import {
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  createTableColumn,
  makeStyles,
  mergeClasses,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { EyeRegular, MoneyHandRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { MonoAmount } from '../../components/MonoAmount'
import { SectionCard } from '../../components/SectionCard'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatCurrency, formatNumber } from '../../utils/currency'
import { COL_DIA_DIEM, COL_HANH_DONG, COL_SO_LUONG, COL_SO_TIEN, COL_STT, COL_TEN } from '../../utils/tableColumnSizes'
import type { DashboardData } from './useDashboardData'

const useStyles = makeStyles({
  zebraRow: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  hoverableRow: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
})

type TopDebtRow = DashboardData['top20CongNo'][number]

interface TopDebtSchoolsTableProps {
  data: DashboardData
  loading?: boolean
}

export function TopDebtSchoolsTable({ data, loading }: TopDebtSchoolsTableProps) {
  const styles = useStyles()
  const navigate = useNavigate()

  const columns: TableColumnDefinition<TopDebtRow>[] = [
    createTableColumn<TopDebtRow>({
      columnId: 'stt',
      renderHeaderCell: () => 'STT',
      renderCell: (item) => data.top20CongNo.indexOf(item) + 1,
    }),
    createTableColumn<TopDebtRow>({
      columnId: 'tenTruong',
      renderHeaderCell: () => 'Tên trường',
      renderCell: (item) => item.truong.tenTruong,
    }),
    createTableColumn<TopDebtRow>({
      columnId: 'phuongXa',
      renderHeaderCell: () => 'Xã/Phường',
      renderCell: (item) => item.phuongXa.ten,
    }),
    createTableColumn<TopDebtRow>({
      columnId: 'congNo',
      renderHeaderCell: () => 'Số tiền công nợ',
      renderCell: (item) => <MonoAmount>{formatCurrency(item.tongNo)}</MonoAmount>,
    }),
    createTableColumn<TopDebtRow>({
      columnId: 'soHocSinh',
      renderHeaderCell: () => 'Số học sinh chưa đóng',
      renderCell: (item) => `${formatNumber(item.soHocSinh)} học sinh`,
    }),
    createTableColumn<TopDebtRow>({
      columnId: 'hanhDong',
      renderHeaderCell: () => 'Hành động',
      renderCell: (item) => (
        <Button
          appearance="subtle"
          icon={<EyeRegular />}
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => navigate(`/cong-no/chi-tiet?truong=${item.truong.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    }),
  ]

  const columnSizingOptions = {
    stt: COL_STT,
    tenTruong: COL_TEN,
    phuongXa: COL_DIA_DIEM,
    congNo: COL_SO_TIEN,
    soHocSinh: COL_SO_LUONG,
    hanhDong: COL_HANH_DONG,
  }

  return (
    <SectionCard
      title="Top 20 trường có công nợ cao nhất"
      icon={MoneyHandRegular}
      iconColor={tokens.colorPaletteRedForeground1}
    >
      {loading ? (
        <TableSkeleton rows={6} />
      ) : data.top20CongNo.length === 0 ? (
        <EmptyState />
      ) : (
        <DataGrid
          items={data.top20CongNo}
          columns={columns}
          getRowId={(item: TopDebtRow) => item.truong.id}
          resizableColumns
          columnSizingOptions={columnSizingOptions}
        >
          <TableHeaderRow />
          <DataGridBody<TopDebtRow>>
            {({ item, rowId }) => (
              <DataGridRow<TopDebtRow>
                key={rowId}
                className={mergeClasses(
                  data.top20CongNo.indexOf(item) % 2 === 1 && styles.zebraRow,
                  styles.hoverableRow,
                )}
              >
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )}
    </SectionCard>
  )
}
