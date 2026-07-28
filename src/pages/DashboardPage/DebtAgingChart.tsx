import { tokens } from '@fluentui/react-components'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { NhomTuoiNo } from '../../mock-data'
import { formatCurrency, formatNumber } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

const MAU_THEO_NHOM: Record<NhomTuoiNo, string> = {
  '≤30 ngày': tokens.colorPaletteYellowForeground2,
  '31–60 ngày': tokens.colorPaletteMarigoldForeground2,
  '61–90 ngày': tokens.colorPaletteDarkOrangeForeground2,
  '>90 ngày': tokens.colorPaletteRedForeground1,
}

interface DebtAgingChartProps {
  data: DashboardData
  loading?: boolean
}

export function DebtAgingChart({ data, loading }: DebtAgingChartProps) {
  const chartData = data.congNoTheoTuoiNo.map((item) => ({
    nhom: item.nhom,
    tongTien: item.tongTien,
    soHocSinh: item.soHocSinh,
  }))

  if (loading) {
    return (
      <SectionCard title="Công nợ theo tuổi nợ">
        <TableSkeleton rows={4} />
      </SectionCard>
    )
  }

  return (
    <SectionCard title="Công nợ theo tuổi nợ">
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} />
            <XAxis
              type="number"
              stroke={tokens.colorNeutralForeground3}
              tickFormatter={(value: number) => `${Math.round(value / 1_000_000)}tr`}
            />
            <YAxis type="category" dataKey="nhom" stroke={tokens.colorNeutralForeground3} width={80} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const item = payload[0].payload as { nhom: string; tongTien: number; soHocSinh: number }
                return (
                  <div
                    style={{
                      background: tokens.colorNeutralBackground1,
                      border: `1px solid ${tokens.colorNeutralStroke2}`,
                      borderRadius: tokens.borderRadiusMedium,
                      padding: tokens.spacingHorizontalS,
                    }}
                  >
                    <div>{item.nhom}</div>
                    <div>{formatCurrency(item.tongTien)}</div>
                    <div>{formatNumber(item.soHocSinh)} học sinh</div>
                  </div>
                )
              }}
            />
            <Bar dataKey="tongTien" radius={[0, 4, 4, 0]}>
              {chartData.map((item) => (
                <Cell key={item.nhom} fill={MAU_THEO_NHOM[item.nhom]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}
