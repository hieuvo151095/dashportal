import { makeStyles, tokens } from '@fluentui/react-components'
import { PageTitle } from '../../components/PageTitle'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { DashboardFilterBar } from './DashboardFilterBar'
import { DebtAgingChart } from './DebtAgingChart'
import { KpiRow } from './KpiRow'
import { MonthlyTrendChart } from './MonthlyTrendChart'
import { PaymentMethodSection } from './PaymentMethodSection'
import { RegionHeatmap } from './RegionHeatmap'
import { RevenueCompositionSection } from './RevenueCompositionSection'
import { TopDebtSchoolsTable } from './TopDebtSchoolsTable'
import { TopRegionsRanking } from './TopRegionsRanking'
import { useDashboardData } from './useDashboardData'
import { useDashboardFilters, type DashboardFilters } from './useDashboardFilters'

const useStyles = makeStyles({
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
      <PageTitle title="Tổng quan Thu học phí" />

      <DashboardFilterBar
        draft={draft}
        setDraft={setDraft}
        onApply={() => filters.apply(draft)}
        onReset={filters.reset}
      />

      <KpiRow data={data} />

      <div className={styles.twoColRow}>
        <RegionHeatmap data={data} onSelectPhuongXa={filters.setPhuongXaId} loading={loading} />
        <TopRegionsRanking data={data} loading={loading} />
      </div>

      <div className={styles.twoColRow}>
        <RevenueCompositionSection data={data} loading={loading} />
        <PaymentMethodSection data={data} loading={loading} />
      </div>

      <div className={styles.fullRow}>
        <TopDebtSchoolsTable data={data} loading={loading} />
      </div>

      <div className={styles.fullRow}>
        <MonthlyTrendChart data={data} loading={loading} />
      </div>

      <div className={styles.fullRow}>
        <DebtAgingChart data={data} loading={loading} />
      </div>
    </div>
  )
}
