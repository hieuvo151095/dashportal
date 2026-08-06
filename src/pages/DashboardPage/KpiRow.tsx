import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowSyncRegular,
  BuildingMultipleRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  ReceiptRegular,
} from '@fluentui/react-icons'
import { KpiCard, type KpiTrend } from '../../components/KpiCard'
import { formatCurrencyWithUnit, formatNumber } from '../../utils/currency'
import { MiniProgressRing } from './MiniProgressRing'
import type { DashboardData } from './useDashboardData'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    columnGap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
})

interface KpiRowProps {
  data: DashboardData
}

// So sánh giá trị tiền hiện tại với kỳ trước — trả về undefined nếu không có kỳ trước (kỳ đầu
// tiên trong 6 kỳ gần nhất) hoặc kỳ trước không phát sinh gì (chia cho 0 → % vô nghĩa).
function trendTuKyTruoc(hienTai: number, truoc: number | null | undefined): KpiTrend | undefined {
  if (truoc === null || truoc === undefined || truoc === 0) return undefined
  const phanTram = Math.round(((hienTai - truoc) / truoc) * 100)
  return {
    direction: phanTram >= 0 ? 'up' : 'down',
    label: `${phanTram >= 0 ? '+' : ''}${phanTram}% so với kỳ trước`,
  }
}

// Tỉ lệ hoàn thành là phần trăm sẵn — so bằng chênh lệch điểm % (dễ hiểu hơn "% của %").
function trendTyLeTuKyTruoc(hienTai: number, truoc: number | null | undefined): KpiTrend | undefined {
  if (truoc === null || truoc === undefined) return undefined
  const diemChenhLech = Math.round((hienTai - truoc) * 100)
  return {
    direction: diemChenhLech >= 0 ? 'up' : 'down',
    label: `${diemChenhLech >= 0 ? '+' : ''}${diemChenhLech} điểm % so với kỳ trước`,
  }
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
        color="blue"
        trend={trendTuKyTruoc(kpi.tongTien, kpi.kyTruoc?.tongTien)}
      />
      <KpiCard
        icon={CheckmarkCircleRegular}
        label="Đã thu"
        value={`${formatNumber(kpi.soDaThanhToan)} hoá đơn`}
        subValue={formatCurrencyWithUnit(kpi.daThuTien)}
        accent="success"
        color="green"
        trend={trendTuKyTruoc(kpi.daThuTien, kpi.kyTruoc?.daThuTien)}
      />
      <KpiCard
        icon={ClockRegular}
        label="Cần thu (còn lại)"
        value={`${formatNumber(kpi.soCanThu)} hoá đơn`}
        subValue={formatCurrencyWithUnit(kpi.canThuTien)}
        accent="warning"
        color="marigold"
        trend={trendTuKyTruoc(kpi.canThuTien, kpi.kyTruoc?.canThuTien)}
      />
      <KpiCard
        icon={CheckmarkCircleRegular}
        label="Tỉ lệ hoàn thành"
        value={`${Math.round(kpi.tiLeHoanThanh * 100)}%`}
        trailing={<MiniProgressRing ratio={kpi.tiLeHoanThanh} />}
        color="navy"
        trend={trendTyLeTuKyTruoc(kpi.tiLeHoanThanh, kpi.kyTruoc?.tiLeHoanThanh)}
      />
      <KpiCard
        icon={BuildingMultipleRegular}
        label="Cơ sở giáo dục"
        value={`${formatNumber(kpi.soTruong)} trường`}
        subValue={`${Math.round(kpi.tyLeKetNoi * 100)}% đã kết nối`}
      />
      <KpiCard
        icon={ArrowSyncRegular}
        label="Tình trạng đồng bộ dữ liệu"
        value={`${Math.round(data.tyLeDongBoTrungBinh * 100)}%`}
        subValue="Tỷ lệ đồng bộ trung bình — 168 Phường/Xã"
        color="gold"
      />
    </div>
  )
}
