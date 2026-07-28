import {
  Badge,
  Body1,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  createTableColumn,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { EyeRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import type { NhomTuoiNo } from '../../mock-data'
import { formatCurrency, formatNumber } from '../../utils/currency'
import { formatDate } from '../../utils/date'
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
import type { TongHopData } from './useTongHopData'

const BADGE_COLOR: Record<NhomTuoiNo, 'informative' | 'warning' | 'severe' | 'danger'> = {
  '≤30 ngày': 'informative',
  '31–60 ngày': 'warning',
  '61–90 ngày': 'severe',
  '>90 ngày': 'danger',
}

type Row = TongHopData['rows'][number]

interface SchoolDebtTableProps {
  rows: Row[]
}

export function SchoolDebtTable({ rows }: SchoolDebtTableProps) {
  const navigate = useNavigate()

  if (rows.length === 0) {
    return <EmptyState />
  }

  const columns: TableColumnDefinition<Row>[] = [
    createTableColumn<Row>({
      columnId: 'stt',
      renderHeaderCell: () => 'STT',
      renderCell: (item) => rows.indexOf(item) + 1,
    }),
    createTableColumn<Row>({
      columnId: 'maTruong',
      renderHeaderCell: () => 'Mã trường',
      renderCell: (item) => item.truong.maTruong,
    }),
    createTableColumn<Row>({
      columnId: 'tenTruong',
      renderHeaderCell: () => 'Tên trường',
      renderCell: (item) => item.truong.tenTruong,
    }),
    createTableColumn<Row>({
      columnId: 'phuongXa',
      renderHeaderCell: () => 'Xã/Phường',
      renderCell: (item) => item.phuongXa.ten,
    }),
    createTableColumn<Row>({
      columnId: 'soHocSinh',
      renderHeaderCell: () => 'Số HS chưa thanh toán',
      renderCell: (item) => `${formatNumber(item.soHocSinhChuaThanhToan)} học sinh`,
    }),
    createTableColumn<Row>({
      columnId: 'soTien',
      renderHeaderCell: () => 'Số tiền chưa thu',
      renderCell: (item) => formatCurrency(item.soTienChuaThu),
    }),
    createTableColumn<Row>({
      columnId: 'nhomUuThe',
      renderHeaderCell: () => 'Nhóm tuổi nợ chiếm ưu thế',
      renderCell: (item) => (
        <Badge appearance="tint" color={BADGE_COLOR[item.nhomTuoiNoUuThe as NhomTuoiNo]}>
          {item.nhomTuoiNoUuThe}
        </Badge>
      ),
    }),
    createTableColumn<Row>({
      columnId: 'ngayCapNhat',
      renderHeaderCell: () => 'Ngày cập nhật',
      renderCell: (item) => formatDate(item.truong.ngayCapNhat),
    }),
    createTableColumn<Row>({
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
    maTruong: COL_MA,
    tenTruong: COL_TEN,
    phuongXa: COL_DIA_DIEM,
    soHocSinh: COL_SO_LUONG,
    soTien: COL_SO_TIEN,
    nhomUuThe: COL_BADGE,
    ngayCapNhat: COL_NGAY,
    hanhDong: COL_HANH_DONG,
  }

  return (
    <div>
      <DataGrid
        items={rows}
        columns={columns}
        getRowId={(item: Row) => item.truong.id}
        resizableColumns
        columnSizingOptions={columnSizingOptions}
      >
        <TableHeaderRow />
        <DataGridBody<Row>>
          {({ item, rowId }) => (
            <DataGridRow<Row> key={rowId}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
    </div>
  )
}
