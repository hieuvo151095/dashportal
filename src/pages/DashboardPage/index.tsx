import { Title2, makeStyles, tokens } from '@fluentui/react-components'
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

  return (
    <div>
      <Title2 as="h1" className={styles.title}>
        Tổng quan Thu học phí
      </Title2>

      <DashboardFilterBar filters={filters} />

      <KpiRow data={data} />

      <div className={styles.twoColRow}>
        <RegionHeatmap data={data} onSelectPhuongXa={filters.setPhuongXaId} />
        <TopRegionsRanking data={data} />
      </div>

      <div className={styles.twoColRow}>
        <RevenueCompositionSection data={data} />
        <PaymentMethodSection data={data} />
      </div>

      <div className={styles.fullRow}>
        <TopDebtSchoolsTable data={data} />
      </div>

      <div className={styles.fullRow}>
        <MonthlyTrendChart data={data} />
      </div>

      <div className={styles.fullRow}>
        <DebtAgingChart data={data} />
      </div>
    </div>
  )
}
