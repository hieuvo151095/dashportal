import {
  Avatar,
  Badge,
  Body1,
  Button,
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
import { ClockRegular } from '@fluentui/react-icons'
import { useState } from 'react'
import { EmptyState } from '../../components/EmptyState'
import { Pagination } from '../../components/Pagination'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { TODAY } from '../../mock-data'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { COL_BADGE, COL_HANH_DONG, COL_NGAY, COL_SO_TIEN, COL_TEN } from '../../utils/tableColumnSizes'
import { HoaDonBreakdownDialog } from './HoaDonBreakdownDialog'
import { TRANG_THAI_LABEL, tenHoaDon, type ChiTietRow } from './useChiTietData'
import type { ChiTietFiltersApi } from './useChiTietFilters'

const PAGE_SIZE = 50

// "Thanh toán một phần" dài hơn COL_BADGE dùng chung — nới rộng cục bộ cho riêng cột này
// (cùng nguyên nhân/cách sửa đã áp dụng cho bảng Tổng quan 3.1, xem OverviewTable.tsx).
const COL_TRANG_THAI_RONG = { minWidth: 170, defaultWidth: 190 }

const useStyles = makeStyles({
  studentCell: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
  },
  studentInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  twoLine: {
    display: 'flex',
    flexDirection: 'column',
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
})

interface ChiTietTableProps {
  rows: ChiTietRow[]
  filters: ChiTietFiltersApi
}

export function ChiTietTable({ rows, filters }: ChiTietTableProps) {
  const styles = useStyles()
  const [breakdownRow, setBreakdownRow] = useState<ChiTietRow | null>(null)

  if (rows.length === 0) {
    return <EmptyState />
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, filters.page), totalPages)
  const paginated = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: TableColumnDefinition<ChiTietRow>[] = [
    createTableColumn<ChiTietRow>({
      columnId: 'hocSinh',
      renderHeaderCell: () => 'Học sinh',
      renderCell: (item) => (
        <div className={styles.studentCell}>
          <Avatar name={item.hocSinh.hoTen} color="colorful" />
          <div className={styles.studentInfo}>
            <Body1>{item.hocSinh.hoTen}</Body1>
            <Caption1 className={styles.muted}>{item.hocSinh.maHocSinh}</Caption1>
          </div>
        </div>
      ),
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'tenHoaDon',
      renderHeaderCell: () => 'Tên hoá đơn',
      renderCell: (item) =>
        item.hoaDon ? (
          <div className={styles.twoLine}>
            <Body1>{tenHoaDon(item.hoaDon.ky)}</Body1>
            <Caption1 className={styles.muted}>{item.hoaDon.soHoaDon}</Caption1>
          </div>
        ) : (
          '—'
        ),
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'hanThanhToan',
      renderHeaderCell: () => 'Hạn thanh toán',
      renderCell: (item) => (item.hoaDon ? formatDate(item.hoaDon.hanThanhToan) : '—'),
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'ngayThanhToan',
      renderHeaderCell: () => 'Ngày thanh toán',
      renderCell: (item) => (item.hoaDon?.ngayThanhToan ? formatDate(item.hoaDon.ngayThanhToan) : '—'),
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'hinhThuc',
      renderHeaderCell: () => 'Hình thức thanh toán',
      renderCell: (item) => item.hoaDon?.hinhThucThanhToan ?? '—',
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'taoXacNhan',
      renderHeaderCell: () => 'Tạo bởi / Xác nhận bởi',
      renderCell: (item) =>
        item.hoaDon ? (
          <div className={styles.twoLine}>
            <Caption1>{`Tạo bởi: ${item.hoaDon.taoBoi}`}</Caption1>
            <Caption1 className={styles.muted}>{`Xác nhận: ${item.hoaDon.xacNhanBoi ?? '—'}`}</Caption1>
          </div>
        ) : (
          '—'
        ),
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'trangThai',
      renderHeaderCell: () => 'Trạng thái',
      renderCell: (item) => {
        if (!item.hoaDon) {
          return <Caption1 className={styles.muted}>Không có hoá đơn</Caption1>
        }
        const quaHan = item.hoaDon.trangThai !== 'Đã thanh toán' && new Date(item.hoaDon.hanThanhToan) < TODAY
        return (
          <Badge
            appearance="tint"
            icon={quaHan ? <ClockRegular /> : undefined}
            color={
              item.hoaDon.trangThai === 'Đã thanh toán'
                ? 'success'
                : item.hoaDon.trangThai === 'Thanh toán một phần'
                  ? 'warning'
                  : 'informative'
            }
          >
            {TRANG_THAI_LABEL[item.hoaDon.trangThai]}
          </Badge>
        )
      },
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'soTien',
      renderHeaderCell: () => 'Số tiền',
      renderCell: (item) => {
        if (!item.hoaDon) return '—'
        if (item.hoaDon.trangThai === 'Thanh toán một phần') {
          return (
            <div className={styles.twoLine}>
              <Caption1>{`Đã trả: ${formatCurrency(item.hoaDon.daTra)}`}</Caption1>
              <Caption1 className={styles.muted}>{`Còn lại: ${formatCurrency(item.hoaDon.conLai)}`}</Caption1>
            </div>
          )
        }
        return formatCurrency(item.hoaDon.soTien)
      },
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'danhMucPhi',
      renderHeaderCell: () => 'Danh mục phí',
      renderCell: (item) =>
        item.hoaDon ? (
          <Button appearance="secondary" size="small" style={{ whiteSpace: 'nowrap' }} onClick={() => setBreakdownRow(item)}>
            Xem chi tiết
          </Button>
        ) : (
          '—'
        ),
    }),
  ]

  const columnSizingOptions = {
    hocSinh: COL_TEN,
    tenHoaDon: COL_TEN,
    hanThanhToan: COL_NGAY,
    ngayThanhToan: COL_NGAY,
    hinhThuc: COL_BADGE,
    taoXacNhan: COL_TEN,
    trangThai: COL_TRANG_THAI_RONG,
    soTien: COL_SO_TIEN,
    danhMucPhi: COL_HANH_DONG,
  }

  return (
    <div>
      <DataGrid
        items={paginated}
        columns={columns}
        getRowId={(item: ChiTietRow) => item.hoaDon?.id ?? `empty-${item.hocSinh.id}`}
        resizableColumns
        columnSizingOptions={columnSizingOptions}
      >
        <TableHeaderRow />
        <DataGridBody<ChiTietRow>>
          {({ item, rowId }) => (
            <DataGridRow<ChiTietRow> key={rowId}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
      <Pagination page={page} totalPages={totalPages} totalItems={rows.length} pageSize={PAGE_SIZE} onPageChange={filters.setPage} />
      <HoaDonBreakdownDialog row={breakdownRow} onClose={() => setBreakdownRow(null)} />
    </div>
  )
}
