import {
  Caption1,
  Tab,
  TabList,
  makeStyles,
  tokens,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import { PageTitle } from '../../components/PageTitle'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { InvoiceTable } from './InvoiceTable'
import { KpiRow } from './KpiRow'
import { OverviewTable } from './OverviewTable'
import { TongHopFilterBar } from './TongHopFilterBar'
import { useTongHopData } from './useTongHopData'
import { useTongHopFilters, type TabId, type TongHopFilters } from './useTongHopFilters'

const useStyles = makeStyles({
  tabList: {
    marginBottom: tokens.spacingVerticalM,
  },
})

const TAB_LABELS: Record<TabId, string> = {
  'tong-quan': 'Tổng quan',
  'da-thanh-toan': 'Hoá đơn đã thanh toán',
  'mot-phan': 'Hoá đơn thanh toán một phần',
  'chua-thanh-toan': 'Hoá đơn chưa thanh toán',
}

export function ThuHocPhiTongHopPage() {
  const styles = useStyles()
  const filters = useTongHopFilters()
  const [draft, setDraft] = useFilterDraft<TongHopFilters>({
    ky: filters.ky,
    phuongXaIds: filters.phuongXaIds,
    truongIds: filters.truongIds,
    capHocList: filters.capHocList,
    hinhThucThanhToanList: filters.hinhThucThanhToanList,
    heThongList: filters.heThongList,
    trangThaiList: filters.trangThaiList,
    q: filters.q,
  })
  const data = useTongHopData(filters)
  const loading = useSkeletonDelay([
    filters.ky,
    filters.phuongXaIds,
    filters.truongIds,
    filters.capHocList,
    filters.hinhThucThanhToanList,
    filters.heThongList,
    filters.trangThaiList,
    filters.q,
    filters.tab,
  ])

  return (
    <div>
      <PageTitle title="Thu Học phí — Tổng hợp toàn thành phố" showUnit={false} />

      <TongHopFilterBar draft={draft} setDraft={setDraft} onApply={() => filters.apply(draft)} onReset={filters.reset} />

      <KpiRow data={data} />

      <TabList
        className={styles.tabList}
        selectedValue={filters.tab}
        onTabSelect={(_: SelectTabEvent, tabData: SelectTabData) => filters.setTab(tabData.value as TabId)}
      >
        {(Object.keys(TAB_LABELS) as TabId[]).map((tab) => (
          <Tab key={tab} value={tab}>
            {TAB_LABELS[tab]}
          </Tab>
        ))}
      </TabList>

      <SectionCard
        title={TAB_LABELS[filters.tab]}
        action={<Caption1 style={{ color: tokens.colorNeutralForeground3 }}>Đơn vị: Đồng</Caption1>}
      >
        {loading ? (
          <TableSkeleton rows={8} />
        ) : filters.tab === 'tong-quan' ? (
          <OverviewTable rows={data.overviewRows} />
        ) : (
          <InvoiceTable rows={data.invoiceRowsByTab[filters.tab]} filters={filters} />
        )}
      </SectionCard>
    </div>
  )
}
