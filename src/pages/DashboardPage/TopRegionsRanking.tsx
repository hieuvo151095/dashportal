import { Body1, Caption1, ProgressBar, makeStyles, tokens } from '@fluentui/react-components'
import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { DashboardData } from './useDashboardData'

const useStyles = makeStyles({
  row: {
    display: 'grid',
    gridTemplateColumns: '24px 1fr 96px 44px',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
  },
  ten: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  ratio: {
    textAlign: 'right',
  },
})

interface TopRegionsRankingProps {
  data: DashboardData
  loading?: boolean
}

export function TopRegionsRanking({ data, loading }: TopRegionsRankingProps) {
  const styles = useStyles()

  return (
    <SectionCard title="Top 10 Xã/Phường có tỷ lệ thu cao nhất">
      {loading ? (
        <TableSkeleton rows={4} />
      ) : data.top10Phuong.length === 0 ? (
        <EmptyState />
      ) : (
        data.top10Phuong.map((item, index) => (
          <div className={styles.row} key={item.phuongXa.id}>
            <Caption1>{index + 1}</Caption1>
            <Body1 className={styles.ten}>{item.phuongXa.ten}</Body1>
            <ProgressBar value={item.tyLe} />
            <Caption1 className={styles.ratio}>{Math.round(item.tyLe * 100)}%</Caption1>
          </div>
        ))
      )}
    </SectionCard>
  )
}
