import { Caption1, tokens } from '@fluentui/react-components'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { DashboardData } from './useDashboardData'

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
  const chartData = [...data.tyLeThuTheoPhuong]
    .sort((a, b) => b.tyLe - a.tyLe)
    .map((item) => ({
      phuongXaId: item.phuongXa.id,
      ten: item.phuongXa.ten,
      tyLePercent: Math.round(item.tyLe * 100),
    }))

  return (
    <SectionCard title="Bản đồ tỷ lệ thu theo Xã/Phường">
      {loading ? (
        <TableSkeleton rows={4} />
      ) : chartData.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} />
                <XAxis
                  dataKey="ten"
                  stroke={tokens.colorNeutralForeground3}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={70}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke={tokens.colorNeutralForeground3}
                  tickFormatter={(value: number) => `${value}%`}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar
                  dataKey="tyLePercent"
                  radius={[4, 4, 0, 0]}
                  onClick={(entry) => onSelectPhuongXa((entry.payload as (typeof chartData)[number]).phuongXaId)}
                  cursor="pointer"
                >
                  {chartData.map((item) => (
                    <Cell key={item.phuongXaId} fill={mauTheoTyLe(item.tyLePercent / 100)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Caption1 as="p">{data.soPhuongXaCoDuLieu} Xã/Phường trên địa bàn</Caption1>
        </>
      )}
    </SectionCard>
  )
}
