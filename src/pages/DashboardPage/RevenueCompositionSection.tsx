import { tokens } from '@fluentui/react-components'
import { DonutChart } from '../../components/DonutChart'
import { SectionCard } from '../../components/SectionCard'
import type { DanhMucKhoanThu } from '../../mock-data'
import { formatCurrency } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

const MAU_THEO_DANH_MUC: Record<DanhMucKhoanThu, string> = {
  'Học phí': tokens.colorPaletteBlueForeground2,
  'Bán trú': tokens.colorPaletteTealForeground2,
  'Đưa đón': tokens.colorPaletteMarigoldForeground2,
  'Bảo hiểm y tế': tokens.colorPaletteBerryForeground2,
  'Đồng phục': tokens.colorPaletteGrapeForeground2,
  'Ngoại khoá': tokens.colorPaletteGreenForeground2,
  'Khoản thu khác': tokens.colorPaletteSteelForeground2,
}

interface RevenueCompositionSectionProps {
  data: DashboardData
}

export function RevenueCompositionSection({ data }: RevenueCompositionSectionProps) {
  return (
    <SectionCard title="Cơ cấu khoản thu">
      <DonutChart
        data={data.coCauKhoanThu.map((item) => ({
          label: item.label,
          value: item.value,
          color: MAU_THEO_DANH_MUC[item.label],
        }))}
        valueFormatter={formatCurrency}
      />
    </SectionCard>
  )
}
