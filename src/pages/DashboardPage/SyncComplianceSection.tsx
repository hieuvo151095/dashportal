import {
  Button,
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
import { Fragment, useMemo, useState } from 'react'
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

// Số trường tối đa hiện mặc định trong 1 ô "Trường chưa đồng bộ" (ưu tiên trường trễ nhiều
// ngày nhất) trước khi phải bấm "+N trường khác" để xem toàn bộ — tránh 1 khu vực có nhiều
// trường (nay đã có dữ liệu demo 3-5 trường/khu) làm dòng bảng cha quá cao.
const SO_TRUONG_HIEN_MAC_DINH = 5

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
  // Grid 2 cột dùng CHUNG cho cả header cột (renderHeaderCell — hiện ĐÚNG 1 LẦN ở đầu bảng,
  // qua TableHeaderRow) lẫn từng dòng dữ liệu (renderCell — gọi lại 1 lần cho mỗi Phường/Xã).
  // Bản trước dùng <table><thead> lồng riêng BÊN TRONG mỗi ô renderCell — mỗi Phường/Xã tự vẽ
  // 1 header riêng, nên nhìn xuống cả cột (nhiều dòng Phường/Xã) thấy "Tên trường"/"Số ngày trễ"
  // lặp lại theo từng dòng. Sửa đúng: header chỉ khai báo 1 lần ở renderHeaderCell của cột,
  // renderCell mỗi dòng chỉ render giá trị — cùng 1 class grid (tỉ lệ cột cố định) nên vẫn
  // thẳng hàng tuyệt đối giữa các dòng và khớp với header.
  truongGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 90px',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalXXS,
    width: '100%',
  },
  truongGridSoNgay: {
    whiteSpace: 'nowrap',
  },
  xemThemCell: {
    gridColumn: '1 / -1',
  },
})

// Tách riêng component (thay vì render thẳng trong renderCell) để có state expanded cục bộ
// cho từng ô — mỗi Phường/Xã tự nhớ trạng thái mở rộng của chính nó, độc lập với các dòng khác.
// KHÔNG tự vẽ header ở đây — header của 2 "cột" Tên trường/Số ngày trễ nằm ở renderHeaderCell
// của cột 'truongChuaDongBo' bên dưới, hiện đúng 1 lần cho toàn bộ bảng.
interface TruongChuaDongBoCellProps {
  list: TruongTre[]
}

function TruongChuaDongBoCell({ list }: TruongChuaDongBoCellProps) {
  const styles = useStyles()
  const [expanded, setExpanded] = useState(false)

  if (list.length === 0) return '—'

  // Ưu tiên hiện trường trễ nhiều ngày nhất trước — cả ở dạng rút gọn lẫn khi đã mở rộng.
  const sorted = [...list].sort((a, b) => b.soNgayTre - a.soNgayTre)
  const hienThi = expanded ? sorted : sorted.slice(0, SO_TRUONG_HIEN_MAC_DINH)
  const soConLai = sorted.length - hienThi.length

  return (
    <div className={styles.truongGrid}>
      {hienThi.map(({ truong, soNgayTre }) => (
        <Fragment key={truong.id}>
          <span>{truong.tenTruong}</span>
          <span className={styles.truongGridSoNgay}>{`${soNgayTre} ngày`}</span>
        </Fragment>
      ))}
      {soConLai > 0 && (
        <div className={styles.xemThemCell}>
          <Button appearance="transparent" size="small" onClick={() => setExpanded(true)}>
            {`+${soConLai} trường khác`}
          </Button>
        </div>
      )}
    </div>
  )
}

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
      // Header 2 "cột" con (Tên trường / Số ngày trễ) khai báo ĐÚNG 1 LẦN ở đây — TableHeaderRow
      // render renderHeaderCell() 1 lần duy nhất cho toàn bảng, không lặp lại theo từng dòng
      // Phường/Xã như bản cũ (mỗi dòng tự vẽ <thead> riêng bên trong renderCell).
      renderHeaderCell: () => (
        <div className={styles.truongGrid}>
          <span>Tên trường</span>
          <span>Số ngày trễ</span>
        </div>
      ),
      renderCell: (item) => {
        const list = locTheoNguong(tab, item.truongChuaDongBo)
        // key={tab}: đổi tab reset lại trạng thái mở rộng (danh sách/ngưỡng đã đổi hẳn).
        return <TruongChuaDongBoCell key={tab} list={list} />
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
