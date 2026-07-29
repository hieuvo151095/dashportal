import {
  Body1,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  createTableColumn,
  type TableColumnDefinition,
  type TableColumnId,
} from '@fluentui/react-components'
import { EyeRegular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { HeThongBadge } from '../../components/HeThongBadge'
import { Pagination } from '../../components/Pagination'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { formatDate } from '../../utils/date'
import {
  COL_BADGE,
  COL_CAP_HOC,
  COL_DIA_DIEM,
  COL_HANH_DONG,
  COL_MA,
  COL_NGAY,
  COL_SO_LUONG,
  COL_STT,
} from '../../utils/tableColumnSizes'
import type { TongHopRow } from './useTongHopData'
import type { TongHopFiltersApi } from './useTongHopFilters'

const PAGE_SIZE = 15

// Bảng này có nhiều khoảng trống bên phải (ít cột hơn các bảng khác trong app) khiến cột
// Tên trường bị co hẹp và xuống dòng dù còn dư chỗ — nới rộng cục bộ cho riêng bảng này,
// không đổi hằng số COL_TEN dùng chung (sẽ ảnh hưởng mọi bảng khác).
const COL_TEN_RONG = { minWidth: 220, defaultWidth: 280 }

type CompareFn = (a: TongHopRow, b: TongHopRow) => number

interface LocalSortState {
  sortColumn: TableColumnId | undefined
  sortDirection: 'ascending' | 'descending'
}

const COMPARE_FNS: Record<string, CompareFn> = {
  tenTruong: (a, b) => a.truong.tenTruong.localeCompare(b.truong.tenTruong, 'vi'),
  soMucPhi: (a, b) => a.soMucPhi - b.soMucPhi,
  ngayCapNhat: (a, b) => new Date(a.truong.ngayCapNhat).getTime() - new Date(b.truong.ngayCapNhat).getTime(),
}

interface TongHopTableProps {
  rows: TongHopRow[]
  filters: TongHopFiltersApi
}

export function TongHopTable({ rows, filters }: TongHopTableProps) {
  const navigate = useNavigate()
  const [sortState, setSortState] = useState<LocalSortState>({
    sortColumn: 'tenTruong',
    sortDirection: 'ascending',
  })

  const sorted = useMemo(() => {
    const compare = COMPARE_FNS[String(sortState.sortColumn)] ?? COMPARE_FNS.tenTruong
    const result = [...rows].sort(compare)
    return sortState.sortDirection === 'descending' ? result.reverse() : result
  }, [rows, sortState])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, filters.page), totalPages)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: TableColumnDefinition<TongHopRow>[] = [
    createTableColumn<TongHopRow>({
      columnId: 'stt',
      renderHeaderCell: () => 'STT',
      renderCell: (item) => (page - 1) * PAGE_SIZE + paginated.indexOf(item) + 1,
      compare: () => 0,
    }),
    createTableColumn<TongHopRow>({
      columnId: 'maTruong',
      renderHeaderCell: () => 'Mã trường',
      renderCell: (item) => item.truong.maTruong,
      compare: () => 0,
    }),
    createTableColumn<TongHopRow>({
      columnId: 'tenTruong',
      renderHeaderCell: () => 'Tên trường',
      renderCell: (item) => item.truong.tenTruong,
      compare: COMPARE_FNS.tenTruong,
    }),
    createTableColumn<TongHopRow>({
      columnId: 'phuongXa',
      renderHeaderCell: () => 'Xã/Phường',
      renderCell: (item) => item.phuongXa.ten,
      compare: () => 0,
    }),
    createTableColumn<TongHopRow>({
      columnId: 'capHoc',
      renderHeaderCell: () => 'Cấp học',
      renderCell: (item) => item.truong.capHoc,
      compare: () => 0,
    }),
    createTableColumn<TongHopRow>({
      columnId: 'soMucPhi',
      renderHeaderCell: () => 'Số mục phí đang áp dụng',
      renderCell: (item) => item.soMucPhi,
      compare: COMPARE_FNS.soMucPhi,
    }),
    createTableColumn<TongHopRow>({
      columnId: 'heThongDoiTac',
      renderHeaderCell: () => 'Hệ thống đối tác',
      renderCell: (item) => <HeThongBadge value={item.truong.heThongDoiTac} />,
      compare: () => 0,
    }),
    createTableColumn<TongHopRow>({
      columnId: 'ngayCapNhat',
      renderHeaderCell: () => 'Ngày cập nhật',
      renderCell: (item) => formatDate(item.truong.ngayCapNhat),
      compare: COMPARE_FNS.ngayCapNhat,
    }),
    createTableColumn<TongHopRow>({
      columnId: 'hanhDong',
      renderHeaderCell: () => 'Hành động',
      renderCell: (item) => (
        <Button
          appearance="subtle"
          icon={<EyeRegular />}
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => navigate(`/danh-muc-phi/chi-tiet?truong=${item.truong.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
      compare: () => 0,
    }),
  ]

  const columnSizingOptions = {
    stt: COL_STT,
    maTruong: COL_MA,
    tenTruong: COL_TEN_RONG,
    phuongXa: COL_DIA_DIEM,
    capHoc: COL_CAP_HOC,
    soMucPhi: COL_SO_LUONG,
    heThongDoiTac: COL_BADGE,
    ngayCapNhat: COL_NGAY,
    hanhDong: COL_HANH_DONG,
  }

  if (rows.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <DataGrid
        items={paginated}
        columns={columns}
        getRowId={(item: TongHopRow) => item.truong.id}
        resizableColumns
        columnSizingOptions={columnSizingOptions}
        sortable
        sortState={sortState}
        onSortChange={(_, nextSortState) => setSortState(nextSortState)}
      >
        <TableHeaderRow />
        <DataGridBody<TongHopRow>>
          {({ item, rowId }) => (
            <DataGridRow<TongHopRow> key={rowId}>
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Body1 as="p">{`Tổng số dòng: ${rows.length}`}</Body1>
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={sorted.length}
        pageSize={PAGE_SIZE}
        onPageChange={filters.setPage}
      />
    </div>
  )
}
