import { Caption1, Tooltip, makeStyles, tokens } from '@fluentui/react-components'
import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { DashboardData } from './useDashboardData'

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: tokens.spacingHorizontalXS,
  },
  cell: {
    aspectRatio: '1',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    border: 'none',
    cursor: 'pointer',
  },
  footer: {
    marginTop: tokens.spacingVerticalS,
  },
})

// Đỏ (tỷ lệ thấp) -> Xanh lá (tỷ lệ cao), nội suy qua HSL.
function mauTheoTyLe(tyLe: number): string {
  const hue = Math.max(0, Math.min(1, tyLe)) * 120
  return `hsl(${hue}, 65%, 42%)`
}

interface RegionHeatmapProps {
  data: DashboardData
  onSelectPhuongXa: (phuongXaId: string) => void
  loading?: boolean
}

export function RegionHeatmap({ data, onSelectPhuongXa, loading }: RegionHeatmapProps) {
  const styles = useStyles()

  return (
    <SectionCard title="Bản đồ tỷ lệ thu theo Xã/Phường">
      {loading ? (
        <TableSkeleton rows={4} />
      ) : data.tyLeThuTheoPhuong.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className={styles.grid}>
            {data.tyLeThuTheoPhuong.map(({ phuongXa, tyLe }) => (
              <Tooltip key={phuongXa.id} content={`${phuongXa.ten}: ${Math.round(tyLe * 100)}%`} relationship="label">
                <button
                  type="button"
                  className={styles.cell}
                  style={{ backgroundColor: mauTheoTyLe(tyLe) }}
                  onClick={() => onSelectPhuongXa(phuongXa.id)}
                >
                  {Math.round(tyLe * 100)}%
                </button>
              </Tooltip>
            ))}
          </div>
          <Caption1 className={styles.footer} as="p">
            {data.soPhuongXaCoDuLieu} Xã/Phường trên địa bàn
          </Caption1>
        </>
      )}
    </SectionCard>
  )
}
