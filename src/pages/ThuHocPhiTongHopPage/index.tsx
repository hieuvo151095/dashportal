import { Tab, TabList, Title2, makeStyles, tokens, type SelectTabData, type SelectTabEvent } from '@fluentui/react-components'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { InvoiceTable } from './InvoiceTable'
import { KpiRow } from './KpiRow'
import { OverviewTable } from './OverviewTable'
import { TongHopFilterBar } from './TongHopFilterBar'
import { useTongHopData } from './useTongHopData'
import { useTongHopFilters, type TabId } from './useTongHopFilters'

const useStyles = makeStyles({
  title: {
    marginBottom: tokens.spacingVerticalM,
  },
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
  const data = useTongHopData(filters)
  const loading = useSkeletonDelay([
    filters.ky,
    filters.phuongXaId,
    filters.truongId,
    filters.capHocList,
    filters.hinhThucThanhToan,
    filters.tab,
  ])

  return (
    <div>
      <Title2 as="h1" className={styles.title}>
        Thu Học phí — Tổng hợp toàn thành phố
      </Title2>

      <TongHopFilterBar filters={filters} />

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

      <SectionCard title={TAB_LABELS[filters.tab]}>
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
