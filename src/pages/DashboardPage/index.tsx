import { Caption1, makeStyles, tokens } from '@fluentui/react-components'
import { PageTitle } from '../../components/PageTitle'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { CapHocAnalysisTable } from './CapHocAnalysisTable'
import { DashboardFilterBar } from './DashboardFilterBar'
import { DebtAgingChart } from './DebtAgingChart'
import { GridMap } from './GridMap'
import { KpiRow } from './KpiRow'
import { MonthlyTrendChart } from './MonthlyTrendChart'
import { PaymentMethodSection } from './PaymentMethodSection'
import { RevenueCompositionSection } from './RevenueCompositionSection'
import { SyncComplianceSection } from './SyncComplianceSection'
import { TopDebtSchoolsTable } from './TopDebtSchoolsTable'
import { TopRegionsRanking } from './TopRegionsRanking'
import { useDashboardData } from './useDashboardData'
import { useDashboardFilters, type DashboardFilters } from './useDashboardFilters'

const useStyles = makeStyles({
  description: {
    display: 'block',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalM,
  },
  twoColRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  fullRow: {
    marginBottom: tokens.spacingVerticalL,
  },
})

export function DashboardPage() {
  const styles = useStyles()
  const filters = useDashboardFilters()
  const [draft, setDraft] = useFilterDraft<DashboardFilters>({
    ky: filters.ky,
    phuongXaId: filters.phuongXaId,
    capHocList: filters.capHocList,
  })
  const data = useDashboardData(filters)
  const loading = useSkeletonDelay([filters.ky, filters.phuongXaId, filters.capHocList])

  return (
    <div>
      <PageTitle title="Tổng quan Thu học phí" showUnit={false} />
      <Caption1 as="p" className={styles.description}>
        Theo dõi tình hình thu học phí toàn thành phố theo thời gian thực
      </Caption1>

      <DashboardFilterBar
        draft={draft}
        setDraft={setDraft}
        onApply={() => filters.apply(draft)}
        onReset={filters.reset}
      />

      <KpiRow data={data} />

      <div className={styles.twoColRow}>
        <GridMap data={data} loading={loading} ky={filters.ky} />
        <TopRegionsRanking data={data} loading={loading} ky={filters.ky} />
      </div>

      <div className={styles.twoColRow}>
        <RevenueCompositionSection data={data} loading={loading} />
        <PaymentMethodSection data={data} loading={loading} />
      </div>

      <div className={styles.twoColRow}>
        <MonthlyTrendChart data={data} loading={loading} ky={filters.ky} />
        <DebtAgingChart data={data} loading={loading} ky={filters.ky} />
      </div>

      <div className={styles.fullRow}>
        <CapHocAnalysisTable data={data} loading={loading} />
      </div>

      <div className={styles.fullRow}>
        <SyncComplianceSection data={data} loading={loading} />
      </div>

      <div className={styles.fullRow}>
        <TopDebtSchoolsTable data={data} loading={loading} />
      </div>
    </div>
  )
}
