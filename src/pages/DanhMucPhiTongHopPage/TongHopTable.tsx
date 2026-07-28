import {
  Badge,
  type BadgeProps,
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
  type TableColumnId,
} from '@fluentui/react-components'
import { EyeRegular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { Pagination } from '../../components/Pagination'
import type { HeThongDoiTac } from '../../mock-data'
import { formatDate } from '../../utils/date'
import type { TongHopRow } from './useTongHopData'
import type { TongHopFiltersApi } from './useTongHopFilters'

const PAGE_SIZE = 15

const HE_THONG_BADGE_COLOR: Record<HeThongDoiTac, BadgeProps['color']> = {
  SSC: 'brand',
  Misa: 'success',
  Viettel: 'danger',
  VNPT: 'informative',
  eNetViet: 'warning',
  YoYoSchool: 'severe',
  'ECO School': 'important',
}

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
      renderCell: (item) => (
        <Badge appearance="tint" color={HE_THONG_BADGE_COLOR[item.truong.heThongDoiTac]}>
          {item.truong.heThongDoiTac}
        </Badge>
      ),
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
          onClick={() => navigate(`/danh-muc-phi/chi-tiet?truong=${item.truong.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
      compare: () => 0,
    }),
  ]

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
        sortable
        sortState={sortState}
        onSortChange={(_, nextSortState) => setSortState(nextSortState)}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
          </DataGridRow>
        </DataGridHeader>
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
