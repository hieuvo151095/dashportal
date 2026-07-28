import { makeStyles, tokens } from '@fluentui/react-components'
import { PageTitle } from '../../components/PageTitle'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { AgingChart } from './AgingChart'
import { KpiRow } from './KpiRow'
import { SchoolDebtTable } from './SchoolDebtTable'
import { TongHopFilterBar } from './TongHopFilterBar'
import { TrendChart } from './TrendChart'
import { useTongHopData } from './useTongHopData'
import { useTongHopFilters, type TongHopFilters } from './useTongHopFilters'

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

export function CongNoTongHopPage() {
  const styles = useStyles()
  const filters = useTongHopFilters()
  const [draft, setDraft] = useFilterDraft<TongHopFilters>({
    phuongXaId: filters.phuongXaId,
    truongId: filters.truongId,
    kyTu: filters.kyTu,
    kyDen: filters.kyDen,
    nhomTuoiNo: filters.nhomTuoiNo,
  })
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
      <PageTitle title="Công nợ Học phí — Tổng hợp toàn thành phố" />

      <TongHopFilterBar draft={draft} setDraft={setDraft} onApply={() => filters.apply(draft)} onReset={filters.reset} />

      <KpiRow data={data} />

      <div className={styles.twoColRow}>
        <AgingChart data={data} loading={loading} />
        <TrendChart data={data} loading={loading} />
      </div>

      <div className={styles.fullRow}>
        <SectionCard title="Công nợ theo trường">
          {loading ? <TableSkeleton rows={8} /> : <SchoolDebtTable rows={data.rows} />}
        </SectionCard>
      </div>
    </div>
  )
}
