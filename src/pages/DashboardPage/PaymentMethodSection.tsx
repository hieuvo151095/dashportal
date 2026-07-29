import { tokens } from '@fluentui/react-components'
import { DonutChart } from '../../components/DonutChart'
import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { HinhThucThanhToan } from '../../mock-data'
import { formatCurrencyWithUnit } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

const MAU_THEO_HINH_THUC: Record<HinhThucThanhToan, string> = {
  'Tiền mặt': tokens.colorPaletteForestForeground2,
  'Chuyển khoản': tokens.colorPaletteBlueForeground2,
  'Ví điện tử': tokens.colorPalettePurpleForeground2,
  'QR Code': tokens.colorPalettePumpkinForeground2,
}

interface PaymentMethodSectionProps {
  data: DashboardData
  loading?: boolean
}

export function PaymentMethodSection({ data, loading }: PaymentMethodSectionProps) {
  return (
    <SectionCard title="Cơ cấu hình thức thanh toán">
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
