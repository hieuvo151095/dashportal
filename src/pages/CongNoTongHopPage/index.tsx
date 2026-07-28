import { Title2, makeStyles, tokens } from '@fluentui/react-components'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { AgingChart } from './AgingChart'
import { KpiRow } from './KpiRow'
import { SchoolDebtTable } from './SchoolDebtTable'
import { TongHopFilterBar } from './TongHopFilterBar'
import { TrendChart } from './TrendChart'
import { useTongHopData } from './useTongHopData'
import { useTongHopFilters } from './useTongHopFilters'

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

export function CongNoTongHopPage() {
  const styles = useStyles()
  const filters = useTongHopFilters()
  const data = useTongHopData(filters)
  const loading = useSkeletonDelay([
    filters.phuongXaId,
    filters.truongId,
    filters.kyTu,
    filters.kyDen,
    filters.nhomTuoiNo,
  ])

  return (
    <div>
      <Title2 as="h1" className={styles.title}>
        Công nợ Học phí — Tổng hợp toàn thành phố
      </Title2>

      <TongHopFilterBar filters={filters} />

      <KpiRow data={data} />

      <div className={styles.twoColRow}>
        <AgingChart data={data} />
        <TrendChart data={data} />
      </div>

      <div className={styles.fullRow}>
        <SectionCard title="Công nợ theo trường">
          {loading ? <TableSkeleton rows={8} /> : <SchoolDebtTable rows={data.rows} />}
        </SectionCard>
      </div>
    </div>
  )
}
