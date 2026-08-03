import {
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
import { EyeRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { HeThongBadge } from '../../components/HeThongBadge'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { formatCurrency, formatNumber } from '../../utils/currency'
import { ngayDongBoGanNhat } from '../../utils/dongBo'
import {
  COL_BADGE,
  COL_CAP_HOC,
  COL_DIA_DIEM,
  COL_HANH_DONG,
  COL_MA,
  COL_NGAY,
  COL_SO_LUONG,
  COL_SO_TIEN,
  COL_TEN,
} from '../../utils/tableColumnSizes'
import type { OverviewRow } from './useTongHopData'

// Cột STT ở bảng này chỉ cần rất hẹp — thu gọn khoảng cách với cột Mã trường ngay sau,
// không đụng hằng số COL_STT dùng chung (sẽ ảnh hưởng mọi bảng khác).
const COL_STT_HEP = { minWidth: 32, defaultWidth: 32 }

// "Thanh toán một phần" dài hơn COL_BADGE dùng chung — nới rộng cục bộ cho riêng cột này.
const COL_TRANG_THAI_RONG = { minWidth: 170, defaultWidth: 190 }

const TRANG_THAI_BADGE_COLOR: Record<OverviewRow['trangThaiTongHop'], 'success' | 'warning' | 'informative'> = {
  'Đã thanh toán': 'success',
  'Thanh toán một phần': 'warning',
  'Chưa thanh toán': 'informative',
}

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
  twoLine: {
    display: 'flex',
    flexDirection: 'column',
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
  tongThu: {
    fontWeight: tokens.fontWeightSemibold,
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
      renderCell: (item) => (item.isTotal ? '' : <HeThongBadge value={item.truong.heThongDoiTac} />),
    }),
    createTableColumn<GridRow>({
      columnId: 'capHoc',
      renderHeaderCell: () => 'Cấp học',
      renderCell: (item) => (item.isTotal ? '' : item.truong.capHoc),
    }),
    createTableColumn<GridRow>({
      columnId: 'chiTietThu',
      renderHeaderCell: () => 'Chi tiết thu',
      renderCell: (item) => (
        <div className={styles.twoLine}>
          <Caption1>{`Tiền mặt: ${formatCurrency(item.tienMat)}`}</Caption1>
          <Caption1 className={styles.muted}>{`CK/Thu hộ: ${formatCurrency(item.chuyenKhoan)}`}</Caption1>
        </div>
      ),
    }),
    createTableColumn<GridRow>({
      columnId: 'tongThu',
      renderHeaderCell: () => 'Tổng thu',
      renderCell: (item) => <span className={styles.tongThu}>{formatCurrency(item.tongThu)}</span>,
    }),
    createTableColumn<GridRow>({
      columnId: 'hdConLai',
      renderHeaderCell: () => 'HĐ còn lại',
      renderCell: (item) => `${formatNumber(item.conLaiSoLuong)} HĐ`,
    }),
    createTableColumn<GridRow>({
      columnId: 'phiConLai',
      renderHeaderCell: () => 'Phí còn lại',
      renderCell: (item) => formatCurrency(item.conLaiTien),
    }),
    createTableColumn<GridRow>({
      columnId: 'trangThai',
      renderHeaderCell: () => 'Trạng thái',
      renderCell: (item) =>
        item.isTotal ? (
          ''
        ) : (
          <Badge appearance="tint" color={TRANG_THAI_BADGE_COLOR[item.trangThaiTongHop]}>
            {item.trangThaiTongHop}
          </Badge>
        ),
    }),
    createTableColumn<GridRow>({
      columnId: 'tyLeThu',
      renderHeaderCell: () => 'Tỉ lệ thu',
      renderCell: (item) => `${Math.round(item.tyLeThu * 100)}%`,
    }),
    createTableColumn<GridRow>({
      columnId: 'ngayCapNhat',
      renderHeaderCell: () => 'Ngày cập nhật',
      renderCell: (item) => (item.isTotal ? '' : new Date(ngayDongBoGanNhat(item.truong)).toLocaleDateString('vi-VN')),
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
    stt: COL_STT_HEP,
    maTruong: COL_MA,
    tenTruong: COL_TEN,
    phuongXa: COL_DIA_DIEM,
    heThong: COL_BADGE,
    capHoc: COL_CAP_HOC,
    chiTietThu: COL_SO_TIEN,
    tongThu: COL_SO_TIEN,
    hdConLai: COL_SO_LUONG,
    phiConLai: COL_SO_TIEN,
    trangThai: COL_TRANG_THAI_RONG,
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
