import { Body1, Button, makeStyles, tokens } from '@fluentui/react-components'
import { ClockAlarmRegular } from '@fluentui/react-icons'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { NhomTuoiNo } from '../../mock-data'
import { formatCurrencyWithUnit, formatNumber } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

const MAU_THEO_NHOM: Record<NhomTuoiNo, string> = {
  '≤30 ngày': tokens.colorPaletteYellowForeground2,
  '31–60 ngày': tokens.colorPaletteMarigoldForeground2,
  '61–90 ngày': tokens.colorPaletteDarkOrangeForeground2,
  '>90 ngày': tokens.colorPaletteRedForeground1,
}

const useStyles = makeStyles({
  tongCongNo: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorPaletteRedForeground1,
    marginBottom: tokens.spacingVerticalM,
  },
})

interface DebtAgingChartProps {
  data: DashboardData
  loading?: boolean
  ky: string
}

export function DebtAgingChart({ data, loading, ky }: DebtAgingChartProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const chartData = data.congNoTheoTuoiNo.map((item) => ({
    nhom: item.nhom,
    tongTien: item.tongTien,
    soHocSinh: item.soHocSinh,
  }))
  const tongCongNo = chartData.reduce((sum, item) => sum + item.tongTien, 0)

  const action = (
    <Button
      appearance="subtle"
      onClick={() => navigate(`/cong-no/tong-hop?kyTu=${encodeURIComponent(ky)}&kyDen=${encodeURIComponent(ky)}`)}
    >
      Xem chi tiết
    </Button>
  )

  if (loading) {
    return (
      <SectionCard
      title="Công nợ theo số ngày trả trễ"
      action={action}
      icon={ClockAlarmRegular}
      iconColor={tokens.colorPaletteDarkOrangeForeground2}
    >
        <TableSkeleton rows={4} />
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title="Công nợ theo số ngày trả trễ"
      action={action}
      icon={ClockAlarmRegular}
      iconColor={tokens.colorPaletteDarkOrangeForeground2}
    >
      <Body1 as="p" className={styles.tongCongNo}>{`Tổng công nợ: ${formatCurrencyWithUnit(tongCongNo)}`}</Body1>
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
                    <div>{formatCurrencyWithUnit(item.tongTien)}</div>
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
