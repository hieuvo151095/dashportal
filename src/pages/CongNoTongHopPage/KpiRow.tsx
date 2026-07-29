import { makeStyles, tokens } from '@fluentui/react-components'
import { AlertRegular, MoneyRegular, PeopleRegular, WarningRegular } from '@fluentui/react-icons'
import { KpiCard } from '../../components/KpiCard'
import { formatCurrencyWithUnit, formatNumber } from '../../utils/currency'
import type { TongHopData } from './useTongHopData'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    columnGap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
})

interface KpiRowProps {
  data: TongHopData
}

export function KpiRow({ data }: KpiRowProps) {
  const styles = useStyles()
  const { kpi } = data

  return (
    <div className={styles.root}>
      <KpiCard icon={MoneyRegular} label="Tổng công nợ" value={formatCurrencyWithUnit(kpi.tongCongNo)} accent="warning" />
      <KpiCard
        icon={PeopleRegular}
        label="Số học sinh chưa đóng"
        value={`${formatNumber(kpi.soHocSinhChuaDong)} học sinh`}
      />
      <KpiCard icon={AlertRegular} label="Tỉ lệ nợ trung bình" value={`${Math.round(kpi.tyLeNoTrungBinh * 100)}%`} />
      <KpiCard
        icon={WarningRegular}
        label="Công nợ quá hạn > 90 ngày"
        value={formatCurrencyWithUnit(kpi.congNoQuaHan90)}
        accent="danger"
      />
    </div>
  )
}
