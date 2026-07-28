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
import { ArrowDownloadRegular, ClockRegular, DismissCircleRegular, HistoryRegular } from '@fluentui/react-icons'
import { EmptyState } from '../../components/EmptyState'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { TODAY } from '../../mock-data'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { COL_BADGE, COL_HANH_DONG, COL_NGAY, COL_SO_TIEN, COL_TEN } from '../../utils/tableColumnSizes'
import type { ChiTietRow } from './useChiTietData'

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
  actions: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalXXS,
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
})

function tenHoaDon(ky: string): string {
  return /^\d{2}\/\d{4}$/.test(ky) ? `Hoá đơn tháng ${ky}` : `Hoá đơn niên khoá ${ky}`
}

interface ChiTietTableProps {
  rows: ChiTietRow[]
}

export function ChiTietTable({ rows }: ChiTietTableProps) {
  const styles = useStyles()

  if (rows.length === 0) {
    return <EmptyState />
  }

  const columns: TableColumnDefinition<ChiTietRow>[] = [
    createTableColumn<ChiTietRow>({
      columnId: 'hocSinh',
      renderHeaderCell: () => 'Học sinh',
      renderCell: (item) =>
        item.isFirstOfStudent ? (
          <div className={styles.studentCell}>
            <Avatar name={item.hocSinh.hoTen} color="colorful" />
            <div className={styles.studentInfo}>
              <Body1>{item.hocSinh.hoTen}</Body1>
              <Caption1 className={styles.muted}>{`${item.hocSinh.maHocSinh} — Lớp ${item.hocSinh.lop}`}</Caption1>
            </div>
          </div>
        ) : (
          ''
        ),
    }),
    createTableColumn<ChiTietRow>({
      columnId: 'tenHoaDon',
      renderHeaderCell: () => 'Tên hoá đơn',
      renderCell: (item) =>
        item.hoaDon ? (
          <div className={styles.twoLine}>
            <Body1>{tenHoaDon(item.hoaDon.ky)}</Body1>
            <Caption1 className={styles.muted}>{`${item.hoaDon.soHoaDon} — ${formatDate(item.hoaDon.ngayLap)}`}</Caption1>
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
            {item.hoaDon.trangThai}
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
      columnId: 'hanhDong',
      renderHeaderCell: () => 'Hành động',
      renderCell: (item) =>
        item.hoaDon ? (
          <div className={styles.actions}>
            <Button appearance="subtle" icon={<HistoryRegular />} aria-label="Xem lịch sử" onClick={() => {}} />
            <Button appearance="subtle" icon={<DismissCircleRegular />} aria-label="Huỷ hoá đơn" onClick={() => {}} />
            <Button appearance="subtle" icon={<ArrowDownloadRegular />} aria-label="Tải hoá đơn" onClick={() => {}} />
          </div>
        ) : (
          ''
        ),
    }),
  ]

  const columnSizingOptions = {
    hocSinh: COL_TEN,
    tenHoaDon: COL_TEN,
    hanThanhToan: COL_NGAY,
    hinhThuc: COL_BADGE,
    taoXacNhan: COL_TEN,
    trangThai: COL_BADGE,
    soTien: COL_SO_TIEN,
    hanhDong: COL_HANH_DONG,
  }

  return (
    <div>
      <DataGrid
        items={rows}
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
    </div>
  )
}
