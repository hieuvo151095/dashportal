import { Button, tokens } from '@fluentui/react-components'
import { ArrowTrendingRegular } from '@fluentui/react-icons'
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
import { useNavigate } from 'react-router-dom'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatCurrencyWithUnit } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

interface MonthlyTrendChartProps {
  data: DashboardData
  loading?: boolean
  ky: string
}

export function MonthlyTrendChart({ data, loading, ky }: MonthlyTrendChartProps) {
  const navigate = useNavigate()
  const chartData = data.xuHuongThang.map((item) => ({
    thang: item.thang,
    'Đã thu': item.daThu,
    'Tổng phát sinh': item.tongTien,
    'Tỉ lệ thu (%)': Math.round(item.tyLe * 100),
  }))

  const action = (
    <Button appearance="subtle" onClick={() => navigate(`/thu-hoc-phi/tong-hop?ky=${encodeURIComponent(ky)}`)}>
      Xem chi tiết
    </Button>
  )

  if (loading) {
    return (
      <SectionCard
      title="Xu hướng thu theo tháng"
      action={action}
      icon={ArrowTrendingRegular}
      iconColor={tokens.colorPaletteGreenForeground2}
    >
        <TableSkeleton rows={5} />
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title="Xu hướng thu theo tháng"
      action={action}
      icon={ArrowTrendingRegular}
      iconColor={tokens.colorPaletteGreenForeground2}
    >
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
              formatter={(value, name) =>
                name === 'Tỉ lệ thu (%)' ? `${value}%` : formatCurrencyWithUnit(Number(value))
              }
            />
            <Bar yAxisId="tien" dataKey="Đã thu" fill={tokens.colorBrandBackground} radius={[4, 4, 0, 0]} />
            <Bar
              yAxisId="tien"
              dataKey="Tổng phát sinh"
              fill={tokens.colorNeutralStroke1}
              radius={[4, 4, 0, 0]}
            />
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
