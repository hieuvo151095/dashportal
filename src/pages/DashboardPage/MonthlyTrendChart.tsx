import { tokens } from '@fluentui/react-components'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionCard } from '../../components/SectionCard'
import { formatCurrency } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

interface MonthlyTrendChartProps {
  data: DashboardData
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.xuHuongThang.map((item) => ({
    thang: item.thang,
    'Đã thu': item.daThu,
    'Tỉ lệ thu (%)': Math.round(item.tyLe * 100),
  }))

  return (
    <SectionCard title="Xu hướng thu theo tháng">
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} />
            <XAxis dataKey="thang" stroke={tokens.colorNeutralForeground3} />
            <YAxis
              yAxisId="tien"
              stroke={tokens.colorNeutralForeground3}
              tickFormatter={(value: number) => `${Math.round(value / 1_000_000)}tr`}
            />
            <YAxis yAxisId="tyLe" orientation="right" domain={[0, 100]} stroke={tokens.colorNeutralForeground3} />
            <Tooltip
              formatter={(value, name) => (name === 'Đã thu' ? formatCurrency(Number(value)) : `${value}%`)}
            />
            <Bar yAxisId="tien" dataKey="Đã thu" fill={tokens.colorBrandBackground} radius={[4, 4, 0, 0]} />
            <Line
              yAxisId="tyLe"
              type="monotone"
              dataKey="Tỉ lệ thu (%)"
              stroke={tokens.colorPaletteDarkOrangeForeground1}
              strokeWidth={2}
              dot
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}
