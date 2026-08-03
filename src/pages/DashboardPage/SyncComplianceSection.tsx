import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  MessageBar,
  MessageBarBody,
  Tab,
  TabList,
  createTableColumn,
  makeStyles,
  tokens,
  type SelectTabData,
  type SelectTabEvent,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { ArrowSyncRegular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { EmptyState } from '../../components/EmptyState'
import { Pagination } from '../../components/Pagination'
import { SearchInput } from '../../components/SearchInput'
import { SectionCard } from '../../components/SectionCard'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatNumber } from '../../utils/currency'
import { COL_SO_LUONG } from '../../utils/tableColumnSizes'
import type { DashboardData } from './useDashboardData'

// Ngoại lệ có chủ đích riêng cho bảng này — 20 dòng/trang thay vì 50 như quy ước chung, vì
// đơn vị hiển thị là Phường/Xã có thể có nội dung mở rộng ở cột "Trường chưa đồng bộ".
const PAGE_SIZE = 20

const COL_TEN_PHUONG_XA = { minWidth: 200, defaultWidth: 240 }
const COL_TRUONG_CHUA_DONG_BO = { minWidth: 280, defaultWidth: 340 }

type TabId = 'tat-ca' | 'hoan-tat' | 'cham-7' | 'cham-15'

const TAB_LABELS: Record<TabId, string> = {
  'tat-ca': 'Tất cả',
  'hoan-tat': 'Đã hoàn tất',
  'cham-7': 'Chậm từ 7 ngày',
  'cham-15': 'Chậm từ 15 ngày',
}

type PhuongXaItem = DashboardData['dongBoTheoPhuong'][number]
type TruongTre = PhuongXaItem['truongChuaDongBo'][number]

// Ngưỡng của mỗi tab "Chậm ..." — dùng chung cho cả việc quyết định 1 Phường/Xã có thuộc tab
// hay không (some ở dưới) và việc lọc lại đúng phần trường khớp ngưỡng trong cột danh sách.
function locTheoNguong(tab: TabId, list: TruongTre[]): TruongTre[] {
  if (tab === 'cham-7') return list.filter((x) => x.soNgayTre > 7 && x.soNgayTre <= 15)
  if (tab === 'cham-15') return list.filter((x) => x.soNgayTre >= 15)
  return list
}

function thuocTab(tab: TabId, item: PhuongXaItem): boolean {
  if (tab === 'tat-ca') return true
  if (tab === 'hoan-tat') return item.soTruong > 0 && item.tyLeDongBo === 1
  return locTheoNguong(tab, item.truongChuaDongBo).length > 0
}

const useStyles = makeStyles({
  tabList: {
    marginBottom: tokens.spacingVerticalM,
  },
  note: {
    marginBottom: tokens.spacingVerticalM,
  },
  search: {
    marginBottom: tokens.spacingVerticalM,
    maxWidth: '320px',
  },
  truongList: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
})

interface SyncComplianceSectionProps {
  data: DashboardData
  loading?: boolean
}

export function SyncComplianceSection({ data, loading }: SyncComplianceSectionProps) {
  const styles = useStyles()
  const [tab, setTab] = useState<TabId>('tat-ca')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  function handleTabSelect(_: SelectTabEvent, tabData: SelectTabData) {
    setTab(tabData.value as TabId)
    setPage(1)
  }

  function handleSearch(value: string) {
    setQ(value)
    setPage(1)
  }

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return data.dongBoTheoPhuong
      .filter((item) => thuocTab(tab, item))
      .filter((item) => !query || item.phuongXa.ten.toLowerCase().includes(query))
      .sort((a, b) => a.tyLeDongBo - b.tyLeDongBo || a.phuongXa.ten.localeCompare(b.phuongXa.ten, 'vi'))
  }, [data.dongBoTheoPhuong, tab, q])

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
      renderCell: (item) => formatNumber(item.truongChuaDongBo.length),
    }),
    createTableColumn<PhuongXaItem>({
      columnId: 'truongChuaDongBo',
      renderHeaderCell: () => 'Trường chưa đồng bộ',
      renderCell: (item) => {
        const list = locTheoNguong(tab, item.truongChuaDongBo)
        if (list.length === 0) return '—'
        return (
          <div className={styles.truongList}>
            {list.map(({ truong, soNgayTre }) => (
              <div key={truong.id}>{`${truong.tenTruong} — trễ ${soNgayTre} ngày`}</div>
            ))}
          </div>
        )
      },
    }),
  ]

  const columnSizingOptions = {
    tenPhuongXa: COL_TEN_PHUONG_XA,
    soTruong: COL_SO_LUONG,
    tyLeDongBo: COL_SO_LUONG,
    soTruongChuaDongBo: COL_SO_LUONG,
    truongChuaDongBo: COL_TRUONG_CHUA_DONG_BO,
  }

  return (
    <SectionCard title="Tình trạng đồng bộ dữ liệu" icon={ArrowSyncRegular} iconColor={tokens.colorPaletteTealForeground2}>
      <MessageBar intent="info" className={styles.note}>
        <MessageBarBody>
          Hạn đồng bộ = ngày 7 của tháng kế tiếp Kỳ báo cáo. "Đã hoàn tất" = 100% trường trong khu vực đã đồng bộ đúng
          hạn. 1 Phường/Xã có thể xuất hiện ở cả 2 tab "Chậm từ 7 ngày" và "Chậm từ 15 ngày" nếu có trường thuộc cả 2
          mức trễ.
        </MessageBarBody>
      </MessageBar>

      <TabList className={styles.tabList} selectedValue={tab} onTabSelect={handleTabSelect}>
        {(Object.keys(TAB_LABELS) as TabId[]).map((id) => (
          <Tab key={id} value={id}>
            {TAB_LABELS[id]}
          </Tab>
        ))}
      </TabList>

      <div className={styles.search}>
        <SearchInput value={q} onChange={handleSearch} placeholder="Tìm theo tên Xã/Phường" />
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
    </SectionCard>
  )
}
