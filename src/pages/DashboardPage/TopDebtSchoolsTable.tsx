import {
  Body1,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  createTableColumn,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { EyeRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { SectionCard } from '../../components/SectionCard'
import { formatCurrency, formatNumber } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

type TopDebtRow = DashboardData['top20CongNo'][number]

interface TopDebtSchoolsTableProps {
  data: DashboardData
}

export function TopDebtSchoolsTable({ data }: TopDebtSchoolsTableProps) {
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
      renderCell: (item) => formatCurrency(item.tongNo),
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
          onClick={() => navigate(`/cong-no/chi-tiet?truong=${item.truong.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    }),
  ]

  return (
    <SectionCard title="Top 20 trường có công nợ cao nhất">
      {data.top20CongNo.length === 0 ? (
        <Body1>Không có dữ liệu phù hợp với bộ lọc đã chọn.</Body1>
      ) : (
        <DataGrid
          items={data.top20CongNo}
          columns={columns}
          getRowId={(item: TopDebtRow) => item.truong.id}
          resizableColumns
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<TopDebtRow>>
            {({ item, rowId }) => (
              <DataGridRow<TopDebtRow> key={rowId}>
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )}
    </SectionCard>
  )
}
