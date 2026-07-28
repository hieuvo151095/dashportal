import {
  Body1,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { EyeRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { formatCurrency, formatNumber } from '../../utils/currency'
import {
  COL_BADGE,
  COL_DIA_DIEM,
  COL_HANH_DONG,
  COL_MA,
  COL_NGAY,
  COL_SO_LUONG,
  COL_SO_TIEN,
  COL_STT,
  COL_TEN,
} from '../../utils/tableColumnSizes'
import type { OverviewRow } from './useTongHopData'

const useStyles = makeStyles({
  scroll: {
    maxHeight: '560px',
    overflowY: 'auto',
  },
  totalRow: {
    position: 'sticky',
    bottom: 0,
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorNeutralBackground2,
  },
})

type Row = OverviewRow & { isTotal?: false }
type TotalRow = Pick<OverviewRow, 'tienMat' | 'chuyenKhoan' | 'tongThu' | 'conLaiSoLuong' | 'conLaiTien' | 'tongSoTien' | 'tyLeThu'> & {
  isTotal: true
}
type GridRow = Row | TotalRow

interface OverviewTableProps {
  rows: OverviewRow[]
}

export function OverviewTable({ rows }: OverviewTableProps) {
  const styles = useStyles()
  const navigate = useNavigate()

  if (rows.length === 0) {
    return <EmptyState />
  }

  const total: TotalRow = {
    isTotal: true,
    tienMat: rows.reduce((s, r) => s + r.tienMat, 0),
    chuyenKhoan: rows.reduce((s, r) => s + r.chuyenKhoan, 0),
    tongThu: rows.reduce((s, r) => s + r.tongThu, 0),
    conLaiSoLuong: rows.reduce((s, r) => s + r.conLaiSoLuong, 0),
    conLaiTien: rows.reduce((s, r) => s + r.conLaiTien, 0),
    tongSoTien: rows.reduce((s, r) => s + r.tongSoTien, 0),
    tyLeThu: 0,
  }
  total.tyLeThu = total.tongSoTien === 0 ? 0 : total.tongThu / total.tongSoTien

  const items: GridRow[] = [...rows, total]

  const columns: TableColumnDefinition<GridRow>[] = [
    createTableColumn<GridRow>({
      columnId: 'stt',
      renderHeaderCell: () => 'STT',
      renderCell: (item) => (item.isTotal ? '' : rows.indexOf(item) + 1),
    }),
    createTableColumn<GridRow>({
      columnId: 'maTruong',
      renderHeaderCell: () => 'Mã trường',
      renderCell: (item) => (item.isTotal ? '' : item.truong.maTruong),
    }),
    createTableColumn<GridRow>({
      columnId: 'tenTruong',
      renderHeaderCell: () => 'Tên trường',
      renderCell: (item) => (item.isTotal ? 'Tổng cộng' : item.truong.tenTruong),
    }),
    createTableColumn<GridRow>({
      columnId: 'phuongXa',
      renderHeaderCell: () => 'Xã/Phường',
      renderCell: (item) => (item.isTotal ? '' : item.phuongXa.ten),
    }),
    createTableColumn<GridRow>({
      columnId: 'heThong',
      renderHeaderCell: () => 'Hệ thống',
      renderCell: (item) => (item.isTotal ? '' : item.truong.heThongDoiTac),
    }),
    createTableColumn<GridRow>({
      columnId: 'tienMat',
      renderHeaderCell: () => 'Tiền mặt',
      renderCell: (item) => formatCurrency(item.tienMat),
    }),
    createTableColumn<GridRow>({
      columnId: 'chuyenKhoan',
      renderHeaderCell: () => 'Chuyển khoản/Thu hộ',
      renderCell: (item) => formatCurrency(item.chuyenKhoan),
    }),
    createTableColumn<GridRow>({
      columnId: 'tongThu',
      renderHeaderCell: () => 'Tổng thu',
      renderCell: (item) => formatCurrency(item.tongThu),
    }),
    createTableColumn<GridRow>({
      columnId: 'conLai',
      renderHeaderCell: () => 'Còn lại',
      renderCell: (item) => `${formatNumber(item.conLaiSoLuong)} HĐ — ${formatCurrency(item.conLaiTien)}`,
    }),
    createTableColumn<GridRow>({
      columnId: 'tyLeThu',
      renderHeaderCell: () => 'Tỉ lệ thu',
      renderCell: (item) => `${Math.round(item.tyLeThu * 100)}%`,
    }),
    createTableColumn<GridRow>({
      columnId: 'ngayCapNhat',
      renderHeaderCell: () => 'Ngày cập nhật',
      renderCell: (item) => (item.isTotal ? '' : new Date(item.truong.ngayCapNhat).toLocaleDateString('vi-VN')),
    }),
    createTableColumn<GridRow>({
      columnId: 'hanhDong',
      renderHeaderCell: () => 'Hành động',
      renderCell: (item) =>
        item.isTotal ? '' : (
          <Button
            appearance="subtle"
            icon={<EyeRegular />}
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => navigate(`/thu-hoc-phi/chi-tiet?truong=${item.truong.id}`)}
          >
            Xem chi tiết
          </Button>
        ),
    }),
  ]

  const columnSizingOptions = {
    stt: COL_STT,
    maTruong: COL_MA,
    tenTruong: COL_TEN,
    phuongXa: COL_DIA_DIEM,
    heThong: COL_BADGE,
    tienMat: COL_SO_TIEN,
    chuyenKhoan: COL_SO_TIEN,
    tongThu: COL_SO_TIEN,
    conLai: COL_SO_TIEN,
    tyLeThu: COL_SO_LUONG,
    ngayCapNhat: COL_NGAY,
    hanhDong: COL_HANH_DONG,
  }

  return (
    <div>
      <div className={styles.scroll}>
        <DataGrid
          items={items}
          columns={columns}
          getRowId={(item: GridRow) => (item.isTotal ? 'total' : item.truong.id)}
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
      </div>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
    </div>
  )
}
