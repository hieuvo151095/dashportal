import { makeStyles, tokens } from '@fluentui/react-components'
import { BuildingMultipleRegular, CheckmarkCircleRegular, ClockRegular, ReceiptRegular } from '@fluentui/react-icons'
import { KpiCard } from '../../components/KpiCard'
import { formatCurrencyWithUnit, formatNumber } from '../../utils/currency'
import { MiniProgressRing } from './MiniProgressRing'
import type { DashboardData } from './useDashboardData'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    columnGap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
})

interface KpiRowProps {
  data: DashboardData
}

export function KpiRow({ data }: KpiRowProps) {
  const styles = useStyles()
  const { kpi } = data

  return (
    <div className={styles.root}>
      <KpiCard
        icon={ReceiptRegular}
        label="Tổng hoá đơn"
        value={`${formatNumber(kpi.tongSoHoaDon)} hoá đơn`}
        subValue={formatCurrencyWithUnit(kpi.tongTien)}
      />
      <KpiCard
        icon={CheckmarkCircleRegular}
        label="Đã thu"
        value={`${formatNumber(kpi.soDaThanhToan)} hoá đơn`}
        subValue={formatCurrencyWithUnit(kpi.daThuTien)}
        accent="success"
      />
      <KpiCard
        icon={ClockRegular}
        label="Cần thu (còn lại)"
        value={`${formatNumber(kpi.soCanThu)} hoá đơn`}
        subValue={formatCurrencyWithUnit(kpi.canThuTien)}
        accent="warning"
      />
      <KpiCard
        icon={CheckmarkCircleRegular}
        label="Tỉ lệ hoàn thành"
        value={`${Math.round(kpi.tiLeHoanThanh * 100)}%`}
        trailing={<MiniProgressRing ratio={kpi.tiLeHoanThanh} />}
      />
      <KpiCard
        icon={BuildingMultipleRegular}
        label="Cơ sở giáo dục"
        value={`${formatNumber(kpi.soTruong)} trường`}
        subValue={`${Math.round(kpi.tyLeKetNoi * 100)}% đã kết nối`}
      />
    </div>
  )
}
