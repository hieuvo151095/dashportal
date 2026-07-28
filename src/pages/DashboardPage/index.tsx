import { Title2, makeStyles, tokens } from '@fluentui/react-components'
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
import { useDashboardFilters } from './useDashboardFilters'

const useStyles = makeStyles({
  title: {
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
  const data = useDashboardData(filters)
  const loading = useSkeletonDelay([filters.ky, filters.phuongXaId, filters.capHocList])

  return (
    <div>
      <Title2 as="h1" className={styles.title}>
        Tổng quan Thu học phí
      </Title2>

      <DashboardFilterBar filters={filters} />

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
