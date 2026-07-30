import {
  Body1,
  Caption1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { ArrowSyncRegular, WarningRegular } from '@fluentui/react-icons'
import { EmptyState } from '../../components/EmptyState'
import { HeThongBadge } from '../../components/HeThongBadge'
import { SectionCard } from '../../components/SectionCard'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatDate } from '../../utils/date'
import { formatNumber } from '../../utils/currency'
import { COL_BADGE, COL_NGAY, COL_SO_LUONG } from '../../utils/tableColumnSizes'
import type { DashboardData } from './useDashboardData'

const useStyles = makeStyles({
  stat: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
    color: tokens.colorPaletteDarkOrangeForeground1,
  },
})

type SyncRow = DashboardData['dongBoHeThong'][number]

interface SyncStatusTableProps {
  data: DashboardData
  loading?: boolean
}

export function SyncStatusTable({ data, loading }: SyncStatusTableProps) {
  const styles = useStyles()
  const rows = data.dongBoHeThong.filter((r) => r.soTruong > 0)

  const stat = (
    <div className={styles.stat}>
      <WarningRegular />
      <Body1>{`Trường chưa đồng bộ > 7 ngày: ${formatNumber(data.soTruongChuaDongBo7Ngay)}`}</Body1>
    </div>
  )

  if (loading) {
    return (
      <SectionCard
      title="Tình trạng đồng bộ dữ liệu"
      action={stat}
      icon={ArrowSyncRegular}
      iconColor={tokens.colorPaletteTealForeground2}
    >
        <TableSkeleton rows={4} />
      </SectionCard>
    )
  }

  if (rows.length === 0) {
    return (
      <SectionCard
      title="Tình trạng đồng bộ dữ liệu"
      action={stat}
      icon={ArrowSyncRegular}
      iconColor={tokens.colorPaletteTealForeground2}
    >
        <EmptyState />
      </SectionCard>
    )
  }

  const columns: TableColumnDefinition<SyncRow>[] = [
    createTableColumn<SyncRow>({
      columnId: 'heThong',
      renderHeaderCell: () => 'Hệ thống',
      renderCell: (item) => <HeThongBadge value={item.heThong} />,
    }),
    createTableColumn<SyncRow>({
      columnId: 'soTruong',
      renderHeaderCell: () => 'Số trường kết nối',
      renderCell: (item) => formatNumber(item.soTruong),
    }),
    createTableColumn<SyncRow>({
      columnId: 'tyLe',
      renderHeaderCell: () => 'Tỷ lệ',
      renderCell: (item) => `${Math.round(item.tyLe * 100)}%`,
    }),
    createTableColumn<SyncRow>({
      columnId: 'capNhatMoiNhat',
      renderHeaderCell: () => 'Cập nhật lần cuối',
      renderCell: (item) => (item.capNhatMoiNhat ? formatDate(item.capNhatMoiNhat) : '—'),
    }),
  ]

  const columnSizingOptions = {
    heThong: COL_BADGE,
    soTruong: COL_SO_LUONG,
    tyLe: COL_SO_LUONG,
    capNhatMoiNhat: COL_NGAY,
  }

  return (
    <SectionCard
      title="Tình trạng đồng bộ dữ liệu"
      action={stat}
      icon={ArrowSyncRegular}
      iconColor={tokens.colorPaletteTealForeground2}
    >
      <DataGrid
        items={rows}
        columns={columns}
        getRowId={(item: SyncRow) => item.heThong}
        resizableColumns
        columnSizingOptions={columnSizingOptions}
      >
        <TableHeaderRow />
        <DataGridBody<SyncRow>>
          {({ item, rowId }) => (
            <DataGridRow<SyncRow> key={rowId}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Caption1 as="p">{`Tổng số dòng: ${rows.length}`}</Caption1>
    </SectionCard>
  )
}
