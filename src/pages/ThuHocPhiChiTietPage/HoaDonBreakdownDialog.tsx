import {
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import { LabelValueField } from '../../components/LabelValueField'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { getHoaDonBreakdown, type HoaDonBreakdownLine } from '../../mock-data/hoaDonBreakdown'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { COL_MA, COL_SO_TIEN, COL_TEN } from '../../utils/tableColumnSizes'
import { tenHoaDon, type ChiTietRow } from './useChiTietData'

const useStyles = makeStyles({
  // maxWidth đủ rộng để bảng breakdown 7 cột hiện hết không cần cuộn ngang ở màn hình
  // desktop thường (>=1280px) — xem tổng defaultWidth các cột ở columnSizingOptions bên dưới.
  surface: {
    maxWidth: '1200px',
    width: '95vw',
  },
  summary: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalXXXL,
    marginBottom: tokens.spacingVerticalL,
  },
  summaryCol: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  tongCong: {
    display: 'flex',
    justifyContent: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalS,
    fontWeight: tokens.fontWeightSemibold,
  },
})

const COL_NIEN_KHOA = { minWidth: 110, defaultWidth: 120 }

interface HoaDonBreakdownDialogProps {
  row: ChiTietRow | null
  onClose: () => void
}

export function HoaDonBreakdownDialog({ row, onClose }: HoaDonBreakdownDialogProps) {
  const styles = useStyles()
  const hoaDon = row?.hoaDon ?? null

  const breakdown = useMemo(() => (hoaDon ? getHoaDonBreakdown(hoaDon) : []), [hoaDon])
  const tongBreakdown = useMemo(() => breakdown.reduce((sum, line) => sum + line.soTien, 0), [breakdown])

  const columns: TableColumnDefinition<HoaDonBreakdownLine>[] = [
    createTableColumn<HoaDonBreakdownLine>({
      columnId: 'maPhi',
      renderHeaderCell: () => 'Mã phí',
      renderCell: (item) => item.maPhi,
    }),
    createTableColumn<HoaDonBreakdownLine>({
      columnId: 'tenPhi',
      renderHeaderCell: () => 'Tên phí',
      renderCell: (item) => item.tenPhi,
    }),
    createTableColumn<HoaDonBreakdownLine>({
      columnId: 'soTien',
      renderHeaderCell: () => 'Số tiền',
      renderCell: (item) => formatCurrency(item.soTien),
    }),
    createTableColumn<HoaDonBreakdownLine>({
      columnId: 'donViTinh',
      renderHeaderCell: () => 'Đơn vị tính',
      renderCell: (item) => item.donViTinh,
    }),
    createTableColumn<HoaDonBreakdownLine>({
      columnId: 'nguonThu',
      renderHeaderCell: () => 'Nguồn thu',
      renderCell: (item) => item.nguonThu,
    }),
    createTableColumn<HoaDonBreakdownLine>({
      columnId: 'nhomPhi',
      renderHeaderCell: () => 'Nhóm phí',
      renderCell: (item) => item.nhomPhi,
    }),
    createTableColumn<HoaDonBreakdownLine>({
      columnId: 'nienKhoa',
      renderHeaderCell: () => 'Niên khoá',
      renderCell: (item) => item.nienKhoa,
    }),
  ]

  const columnSizingOptions = {
    maPhi: COL_MA,
    tenPhi: COL_TEN,
    soTien: COL_SO_TIEN,
    donViTinh: COL_MA,
    nguonThu: COL_MA,
    nhomPhi: COL_TEN,
    nienKhoa: COL_NIEN_KHOA,
  }

  return (
    <Dialog open={row !== null} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.surface}>
        {row && hoaDon && (
          <DialogBody>
            <DialogTitle>Chi tiết khoản phí hoá đơn</DialogTitle>
            <DialogContent>
              <div className={styles.summary}>
                <div className={styles.summaryCol}>
                  <LabelValueField label="Học sinh" value={`${row.hocSinh.hoTen} (${row.hocSinh.maHocSinh})`} />
                  <LabelValueField label="Tên hoá đơn" value={`${tenHoaDon(hoaDon.ky)} — ${hoaDon.soHoaDon}`} />
                  <LabelValueField label="Hạn thanh toán" value={formatDate(hoaDon.hanThanhToan)} />
                  <LabelValueField
                    label="Ngày thanh toán"
                    value={hoaDon.ngayThanhToan ? formatDate(hoaDon.ngayThanhToan) : '—'}
                  />
                </div>
                <div className={styles.summaryCol}>
                  <LabelValueField label="Hình thức thanh toán" value={hoaDon.hinhThucThanhToan ?? '—'} />
                  <LabelValueField label="Tạo bởi" value={hoaDon.taoBoi} />
                  <LabelValueField label="Xác nhận bởi" value={hoaDon.xacNhanBoi ?? '—'} />
                </div>
              </div>

              <DataGrid
                items={breakdown}
                columns={columns}
                getRowId={(item: HoaDonBreakdownLine) => item.maPhi + item.tenPhi}
                resizableColumns
                columnSizingOptions={columnSizingOptions}
              >
                <TableHeaderRow />
                <DataGridBody<HoaDonBreakdownLine>>
                  {({ item, rowId }) => (
                    <DataGridRow<HoaDonBreakdownLine> key={rowId}>
                      {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>

              <div className={styles.tongCong}>
                <span>Tổng cộng:</span>
                <span>{formatCurrency(tongBreakdown)}</span>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={onClose}>
                Đóng
              </Button>
            </DialogActions>
          </DialogBody>
        )}
      </DialogSurface>
    </Dialog>
  )
}
