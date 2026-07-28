import { makeStyles, tokens } from '@fluentui/react-components'
import { CheckmarkCircleRegular, ClockRegular, ReceiptRegular, SplitHorizontalRegular } from '@fluentui/react-icons'
import { KpiCard } from '../../components/KpiCard'
import { formatCurrency, formatNumber } from '../../utils/currency'
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
      <KpiCard
        icon={ReceiptRegular}
        label="Tổng hoá đơn"
        value={`${formatNumber(kpi.tongSoHoaDon)} hoá đơn`}
        subValue={formatCurrency(kpi.tongTien)}
      />
      <KpiCard
        icon={CheckmarkCircleRegular}
        label="Đã thu"
        value={`${formatNumber(kpi.soDaThanhToan)} hoá đơn`}
        subValue={formatCurrency(kpi.tienDaThanhToan)}
        accent="success"
      />
      <KpiCard
        icon={SplitHorizontalRegular}
        label="Đã thu một phần"
        value={`${formatNumber(kpi.soMotPhan)} hoá đơn`}
        subValue={formatCurrency(kpi.tienMotPhan)}
        accent="warning"
      />
      <KpiCard
        icon={ClockRegular}
        label="Chưa thu"
        value={`${formatNumber(kpi.soChuaThu)} hoá đơn`}
        subValue={formatCurrency(kpi.tienChuaThu)}
        accent="warning"
      />
    </div>
  )
}
