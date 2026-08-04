import {
  Badge,
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
  Dropdown,
  MessageBar,
  MessageBarBody,
  Option,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { ArrowSyncRegular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { EmptyState } from '../../components/EmptyState'
import { LabelValueField } from '../../components/LabelValueField'
import { Pagination } from '../../components/Pagination'
import { SearchInput } from '../../components/SearchInput'
import { SectionCard } from '../../components/SectionCard'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatNumber } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { COL_BADGE, COL_NGAY, COL_SO_LUONG, COL_TEN } from '../../utils/tableColumnSizes'
import type { DashboardData } from './useDashboardData'

// Ngoại lệ có chủ đích riêng cho bảng này — 20 dòng/trang thay vì 50 như quy ước chung, vì
// đơn vị hiển thị là Phường/Xã, và trang hiện đủ 168 dòng nên phân trang vẫn cần thiết.
const PAGE_SIZE = 20

const COL_TEN_PHUONG_XA = { minWidth: 200, defaultWidth: 240 }
const COL_DANH_SACH_TRUONG = { minWidth: 150, defaultWidth: 160 }

type PhuongXaItem = DashboardData['dongBoTheoPhuong'][number]
type TruongDongBoRow = PhuongXaItem['danhSachTruong'][number]

type SortOrder = 'asc' | 'desc'

const SORT_LABELS: Record<SortOrder, string> = {
  asc: 'Thấp đến cao',
  desc: 'Cao đến thấp',
}

const useStyles = makeStyles({
  note: {
    marginBottom: tokens.spacingVerticalM,
  },
  filters: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalM,
  },
  search: {
    maxWidth: '320px',
  },
  sortDropdown: {
    minWidth: '180px',
  },
  // maxWidth đủ rộng để bảng "Danh sách trường" hiện hết 4 cột không cần cuộn ngang ở màn
  // hình desktop thường (>=1280px) — cùng chuẩn với popup breakdown khoản phí hoá đơn
  // (xem HoaDonBreakdownDialog.tsx).
  dialogSurface: {
    maxWidth: '1200px',
    width: '95vw',
  },
  dialogSummary: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalXXXL,
    marginBottom: tokens.spacingVerticalL,
  },
})

interface SyncComplianceSectionProps {
  data: DashboardData
  loading?: boolean
}

export function SyncComplianceSection({ data, loading }: SyncComplianceSectionProps) {
  const styles = useStyles()
  const [q, setQ] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [page, setPage] = useState(1)
  const [chiTietPx, setChiTietPx] = useState<PhuongXaItem | null>(null)

  function handleSearch(value: string) {
    setQ(value)
    setPage(1)
  }

  function handleSortChange(value: SortOrder) {
    setSortOrder(value)
    setPage(1)
  }

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    const chieu = sortOrder === 'asc' ? 1 : -1
    return data.dongBoTheoPhuong
      .filter((item) => !query || item.phuongXa.ten.toLowerCase().includes(query))
      .sort((a, b) => chieu * (a.tyLeDongBo - b.tyLeDongBo) || a.phuongXa.ten.localeCompare(b.phuongXa.ten, 'vi'))
  }, [data.dongBoTheoPhuong, q, sortOrder])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const columns: TableColumnDefinition<PhuongXaItem>[] = [
    createTableColumn<PhuongXaItem>({
      columnId: 'tenPhuongXa',
      renderHeaderCell: () => 'Phường/Xã',
      renderCell: (item) => item.phuongXa.ten,
    }),
    createTableColumn<PhuongXaItem>({
      columnId: 'soTruong',
      renderHeaderCell: () => 'Tổng số trường',
      renderCell: (item) => formatNumber(item.soTruong),
    }),
    createTableColumn<PhuongXaItem>({
      columnId: 'tyLeDongBo',
      renderHeaderCell: () => 'Tỷ lệ đồng bộ',
      renderCell: (item) => `${Math.round(item.tyLeDongBo * 100)}%`,
    }),
    createTableColumn<PhuongXaItem>({
      columnId: 'soTruongChuaDongBo',
      renderHeaderCell: () => 'Số trường chưa đồng bộ',
      renderCell: (item) => formatNumber(item.soTruong - item.soDungHan),
    }),
    createTableColumn<PhuongXaItem>({
      columnId: 'danhSachTruong',
      renderHeaderCell: () => 'Danh sách trường',
      renderCell: (item) =>
        item.soTruong === 0 ? (
          '—'
        ) : (
          <Button appearance="secondary" size="small" style={{ whiteSpace: 'nowrap' }} onClick={() => setChiTietPx(item)}>
            Xem chi tiết
          </Button>
        ),
    }),
  ]

  const columnSizingOptions = {
    tenPhuongXa: COL_TEN_PHUONG_XA,
    soTruong: COL_SO_LUONG,
    tyLeDongBo: COL_SO_LUONG,
    soTruongChuaDongBo: COL_SO_LUONG,
    danhSachTruong: COL_DANH_SACH_TRUONG,
  }

  const chiTietColumns: TableColumnDefinition<TruongDongBoRow>[] = [
    createTableColumn<TruongDongBoRow>({
      columnId: 'tenTruong',
      renderHeaderCell: () => 'Tên trường',
      renderCell: (row) => row.truong.tenTruong,
    }),
    createTableColumn<TruongDongBoRow>({
      columnId: 'trangThai',
      renderHeaderCell: () => 'Trạng thái đồng bộ',
      renderCell: (row) => (
        <Badge appearance="tint" color={row.daDongBo ? 'success' : 'danger'}>
          {row.daDongBo ? 'Đồng bộ' : 'Chưa đồng bộ'}
        </Badge>
      ),
    }),
    createTableColumn<TruongDongBoRow>({
      columnId: 'ngayDongBo',
      renderHeaderCell: () => 'Ngày đồng bộ',
      renderCell: (row) => (row.ngayDongBo ? formatDate(row.ngayDongBo) : '—'),
    }),
    createTableColumn<TruongDongBoRow>({
      columnId: 'soNgayTre',
      renderHeaderCell: () => 'Số ngày trễ',
      renderCell: (row) => (row.daDongBo ? '—' : `${row.soNgayTre} ngày`),
    }),
  ]

  const chiTietColumnSizingOptions = {
    tenTruong: COL_TEN,
    trangThai: COL_BADGE,
    ngayDongBo: COL_NGAY,
    soNgayTre: COL_SO_LUONG,
  }

  return (
    <SectionCard title="Tình trạng đồng bộ dữ liệu" icon={ArrowSyncRegular} iconColor={tokens.colorPaletteTealForeground2}>
      <MessageBar intent="info" className={styles.note}>
        <MessageBarBody>
          Hạn đồng bộ = ngày 7 của tháng kế tiếp Kỳ báo cáo. "Đã hoàn tất" = 100% trường trong khu vực đã đồng bộ đúng
          hạn.
        </MessageBarBody>
      </MessageBar>

      <div className={styles.filters}>
        <div className={styles.search}>
          <SearchInput value={q} onChange={handleSearch} placeholder="Tìm theo tên Xã/Phường" />
        </div>
        <Dropdown
          className={styles.sortDropdown}
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          value={SORT_LABELS[sortOrder]}
          selectedOptions={[sortOrder]}
          onOptionSelect={(_, optionData) => optionData.optionValue && handleSortChange(optionData.optionValue as SortOrder)}
        >
          {(Object.keys(SORT_LABELS) as SortOrder[]).map((key) => (
            <Option key={key} value={key}>
              {SORT_LABELS[key]}
            </Option>
          ))}
        </Dropdown>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DataGrid items={pageRows} columns={columns} getRowId={(item: PhuongXaItem) => item.phuongXa.id} resizableColumns columnSizingOptions={columnSizingOptions}>
            <TableHeaderRow />
            <DataGridBody<PhuongXaItem>>
              {({ item, rowId }) => (
                <DataGridRow<PhuongXaItem> key={rowId}>
                  {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
          <Pagination page={currentPage} totalPages={totalPages} totalItems={rows.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </>
      )}

      <Dialog open={chiTietPx !== null} onOpenChange={(_, dialogData) => !dialogData.open && setChiTietPx(null)}>
        <DialogSurface className={styles.dialogSurface}>
          {chiTietPx && (
            <DialogBody>
              <DialogTitle>{`Danh sách trường — ${chiTietPx.phuongXa.ten}`}</DialogTitle>
              <DialogContent>
                <div className={styles.dialogSummary}>
                  <LabelValueField label="Tổng số trường" value={formatNumber(chiTietPx.soTruong)} />
                  <LabelValueField
                    label="Tỷ lệ đồng bộ hiện tại"
                    value={`${chiTietPx.soDungHan}/${chiTietPx.soTruong} trường là ${Math.round(chiTietPx.tyLeDongBo * 100)}%`}
                  />
                </div>
                <DataGrid
                  items={chiTietPx.danhSachTruong}
                  columns={chiTietColumns}
                  getRowId={(row: TruongDongBoRow) => row.truong.id}
                  resizableColumns
                  columnSizingOptions={chiTietColumnSizingOptions}
                >
                  <TableHeaderRow />
                  <DataGridBody<TruongDongBoRow>>
                    {({ item, rowId }) => (
                      <DataGridRow<TruongDongBoRow> key={rowId}>
                        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                      </DataGridRow>
                    )}
                  </DataGridBody>
                </DataGrid>
              </DialogContent>
              <DialogActions>
                <Button appearance="secondary" onClick={() => setChiTietPx(null)}>
                  Đóng
                </Button>
              </DialogActions>
            </DialogBody>
          )}
        </DialogSurface>
      </Dialog>
    </SectionCard>
  )
}
