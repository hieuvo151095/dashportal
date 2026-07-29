import { tokens } from '@fluentui/react-components'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { DashboardData } from './useDashboardData'

interface TopRegionsRankingProps {
  data: DashboardData
  loading?: boolean
}

interface TopRegionDatum {
  ten: string
  nhan: string
  tyLePercent: number
}

export function TopRegionsRanking({ data, loading }: TopRegionsRankingProps) {
  // data.top10Phuong đã sắp xếp giảm dần theo tỷ lệ thu — Recharts vẽ category axis theo
  // đúng thứ tự mảng (phần tử đầu nằm trên cùng), nên hạng 1 tự nhiên nằm trên cùng.
  const chartData: TopRegionDatum[] = data.top10Phuong.map((item, index) => ({
    ten: item.phuongXa.ten,
    nhan: `${index + 1}. ${item.phuongXa.ten}`,
    tyLePercent: Math.round(item.tyLe * 100),
  }))

  return (
    <SectionCard title="Top 10 Xã/Phường có tỷ lệ thu cao nhất">
      {loading ? (
        <TableSkeleton rows={4} />
      ) : chartData.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} />
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke={tokens.colorNeutralForeground3}
                tickFormatter={(value: number) => `${value}%`}
              />
              <YAxis type="category" dataKey="nhan" stroke={tokens.colorNeutralForeground3} width={150} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const item = payload[0].payload as TopRegionDatum
                  return (
                    <div
                      style={{
                        background: tokens.colorNeutralBackground1,
                        border: `1px solid ${tokens.colorNeutralStroke2}`,
                        borderRadius: tokens.borderRadiusMedium,
                        padding: tokens.spacingHorizontalS,
                      }}
                    >
                      <div>{item.ten}</div>
                      <div>{`${item.tyLePercent}%`}</div>
                    </div>
                  )
                }}
              />
              <Bar dataKey="tyLePercent" radius={[0, 4, 4, 0]}>
                {chartData.map((item) => (
                  <Cell key={item.ten} fill={tokens.colorBrandBackground} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  )
}
