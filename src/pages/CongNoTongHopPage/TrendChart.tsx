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
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatCurrency, formatNumber } from '../../utils/currency'
import type { TongHopData } from './useTongHopData'

interface TrendChartProps {
  data: TongHopData
  loading?: boolean
}

export function TrendChart({ data, loading }: TrendChartProps) {
  const chartData = data.xuHuongThang.map((item) => ({
    thang: item.thang,
    'Công nợ': item.tongNo,
    'HS nợ mới phát sinh': item.soHocSinhNoMoi,
  }))

  if (loading) {
    return (
      <SectionCard title="Xu hướng công nợ theo tháng">
        <TableSkeleton rows={5} />
      </SectionCard>
    )
  }

  return (
    <SectionCard title="Xu hướng công nợ theo tháng">
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
            <YAxis yAxisId="soLuong" orientation="right" stroke={tokens.colorNeutralForeground3} />
            <Tooltip
              formatter={(value, name) =>
                name === 'Công nợ' ? formatCurrency(Number(value)) : `${formatNumber(Number(value))} học sinh`
              }
            />
            <Bar yAxisId="soLuong" dataKey="HS nợ mới phát sinh" fill={tokens.colorPaletteMarigoldBackground2} radius={[4, 4, 0, 0]} />
            <Line
              yAxisId="tien"
              type="monotone"
              dataKey="Công nợ"
              stroke={tokens.colorPaletteRedForeground1}
              strokeWidth={2}
              dot
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}
