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
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { EyeRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { Pagination } from '../../components/Pagination'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import type { InvoiceRow } from './useTongHopData'
import type { TongHopFiltersApi } from './useTongHopFilters'

const useStyles = makeStyles({
  scroll: {
    overflowX: 'auto',
  },
})

const PAGE_SIZE = 15

const COLUMN_SIZING_OPTIONS = {
  stt: { minWidth: 48, defaultWidth: 48 },
  maTruong: { minWidth: 90, defaultWidth: 100 },
  tenTruong: { minWidth: 160, defaultWidth: 180 },
  hocSinh: { minWidth: 160, defaultWidth: 180 },
  soHoaDon: { minWidth: 150, defaultWidth: 160 },
  ky: { minWidth: 80, defaultWidth: 90 },
  hanThanhToan: { minWidth: 110, defaultWidth: 120 },
  hinhThuc: { minWidth: 110, defaultWidth: 120 },
  soTien: { minWidth: 140, defaultWidth: 150 },
  trangThai: { minWidth: 130, defaultWidth: 140 },
  hanhDong: { minWidth: 150, defaultWidth: 160 },
}

interface InvoiceTableProps {
  rows: InvoiceRow[]
  filters: TongHopFiltersApi
}

export function InvoiceTable({ rows, filters }: InvoiceTableProps) {
  const styles = useStyles()
  const navigate = useNavigate()

  if (rows.length === 0) {
    return <EmptyState />
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, filters.page), totalPages)
  const paginated = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: TableColumnDefinition<InvoiceRow>[] = [
    createTableColumn<InvoiceRow>({
      columnId: 'stt',
      renderHeaderCell: () => 'STT',
      renderCell: (item) => (page - 1) * PAGE_SIZE + paginated.indexOf(item) + 1,
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'maTruong',
      renderHeaderCell: () => 'Mã trường',
      renderCell: (item) => item.truong.maTruong,
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'tenTruong',
      renderHeaderCell: () => 'Tên trường',
      renderCell: (item) => item.truong.tenTruong,
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'hocSinh',
      renderHeaderCell: () => 'Học sinh',
      renderCell: (item) => `${item.hocSinh.hoTen} (${item.hocSinh.maHocSinh})`,
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'soHoaDon',
      renderHeaderCell: () => 'Số HĐ',
      renderCell: (item) => item.hoaDon.soHoaDon,
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'ky',
      renderHeaderCell: () => 'Kỳ',
      renderCell: (item) => item.hoaDon.ky,
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'hanThanhToan',
      renderHeaderCell: () => 'Hạn thanh toán',
      renderCell: (item) => formatDate(item.hoaDon.hanThanhToan),
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'hinhThuc',
      renderHeaderCell: () => 'Hình thức TT',
      renderCell: (item) => item.hoaDon.hinhThucThanhToan ?? '—',
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'soTien',
      renderHeaderCell: () => 'Số tiền',
      renderCell: (item) =>
        item.hoaDon.trangThai === 'Thanh toán một phần' ? (
          <div>
            <div>{`Đã trả: ${formatCurrency(item.hoaDon.daTra)}`}</div>
            <div>{`Còn lại: ${formatCurrency(item.hoaDon.conLai)}`}</div>
          </div>
        ) : (
          formatCurrency(item.hoaDon.soTien)
        ),
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'trangThai',
      renderHeaderCell: () => 'Trạng thái',
      renderCell: (item) => (
        <Badge
          appearance="tint"
          color={
            item.hoaDon.trangThai === 'Đã thanh toán'
              ? 'success'
              : item.hoaDon.trangThai === 'Thanh toán một phần'
                ? 'warning'
                : 'informative'
          }
        >
          {item.hoaDon.trangThai}
        </Badge>
      ),
    }),
    createTableColumn<InvoiceRow>({
      columnId: 'hanhDong',
      renderHeaderCell: () => 'Hành động',
      renderCell: (item) => (
        <Button
          appearance="subtle"
          icon={<EyeRegular />}
          onClick={() =>
            navigate(`/thu-hoc-phi/chi-tiet?truong=${item.truong.id}&q=${encodeURIComponent(item.hocSinh.maHocSinh)}`)
          }
        >
          Xem chi tiết
        </Button>
      ),
    }),
  ]

  return (
    <div>
      <div className={styles.scroll}>
        <DataGrid
          items={paginated}
          columns={columns}
          getRowId={(item: InvoiceRow) => item.hoaDon.id}
          resizableColumns
          columnSizingOptions={COLUMN_SIZING_OPTIONS}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<InvoiceRow>>
            {({ item, rowId }) => (
              <DataGridRow<InvoiceRow> key={rowId}>
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
      <Pagination page={page} totalPages={totalPages} totalItems={rows.length} pageSize={PAGE_SIZE} onPageChange={filters.setPage} />
    </div>
  )
}
