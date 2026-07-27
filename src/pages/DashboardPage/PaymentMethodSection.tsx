import { tokens } from '@fluentui/react-components'
import { DonutChart } from '../../components/DonutChart'
import { SectionCard } from '../../components/SectionCard'
import type { HinhThucThanhToan } from '../../mock-data'
import { formatCurrency } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

const MAU_THEO_HINH_THUC: Record<HinhThucThanhToan, string> = {
  'Tiền mặt': tokens.colorPaletteForestForeground2,
  'Chuyển khoản': tokens.colorPaletteBlueForeground2,
  'Ví điện tử': tokens.colorPalettePurpleForeground2,
  'QR Code': tokens.colorPalettePumpkinForeground2,
}

interface PaymentMethodSectionProps {
  data: DashboardData
}

export function PaymentMethodSection({ data }: PaymentMethodSectionProps) {
  return (
    <SectionCard title="Cơ cấu hình thức thanh toán">
      <DonutChart
        data={data.coCauHinhThuc.map((item) => ({
          label: item.label,
          value: item.value,
          color: MAU_THEO_HINH_THUC[item.label],
        }))}
        valueFormatter={formatCurrency}
      />
    </SectionCard>
  )
}
