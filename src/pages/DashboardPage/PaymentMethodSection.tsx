import { tokens } from '@fluentui/react-components'
import { WalletRegular } from '@fluentui/react-icons'
import { DonutChart } from '../../components/DonutChart'
import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { HinhThucThanhToan } from '../../mock-data'
import { formatCurrencyWithUnit } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

// Cùng nguyên tắc tách hue rõ ràng như donut "Cơ cấu khoản thu" — Forest/Pumpkin trước đây là
// biến thể tối của Green/DarkOrange, đổi sang đúng token Green/DarkOrange cho nhất quán.
const MAU_THEO_HINH_THUC: Record<HinhThucThanhToan, string> = {
  'Tiền mặt': tokens.colorPaletteGreenForeground2,
  'Chuyển khoản': tokens.colorPaletteBlueForeground2,
  'Ví điện tử': tokens.colorPalettePurpleForeground2,
  'QR Code': tokens.colorPaletteDarkOrangeForeground2,
}

interface PaymentMethodSectionProps {
  data: DashboardData
  loading?: boolean
}

export function PaymentMethodSection({ data, loading }: PaymentMethodSectionProps) {
  return (
    <SectionCard
      title="Cơ cấu hình thức thanh toán"
      icon={WalletRegular}
      iconColor={tokens.colorPalettePurpleForeground2}
    >
      {loading ? (
        <TableSkeleton rows={4} />
      ) : data.coCauHinhThuc.length === 0 ? (
        <EmptyState />
      ) : (
        <DonutChart
          data={data.coCauHinhThuc.map((item) => ({
            label: item.label,
            value: item.value,
            color: MAU_THEO_HINH_THUC[item.label],
          }))}
          valueFormatter={formatCurrencyWithUnit}
        />
      )}
    </SectionCard>
  )
}
