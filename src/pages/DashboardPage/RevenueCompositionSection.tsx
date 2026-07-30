import { tokens } from '@fluentui/react-components'
import { DataPieRegular } from '@fluentui/react-icons'
import { DonutChart } from '../../components/DonutChart'
import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import type { DanhMucKhoanThu } from '../../mock-data'
import { formatCurrencyWithUnit } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

// 7 màu tách biệt rõ theo hue (xanh dương, xanh lá, cam, đỏ, tím, vàng, xanh ngọc) — tránh dùng
// nhiều sắc độ của cùng 1 tông (vd Teal/Blue/Steel trước đây đều là họ xanh dương, khó phân
// biệt). Dùng Teal thay vì Brown cho "Khoản thu khác" — Brown nằm quá gần vùng cam/đỏ trên
// vòng màu (hue ~24°, kẹp giữa Đưa đón ~16° và Bảo hiểm y tế ~359°), còn Teal (~182°) cách xa
// mọi màu còn lại.
const MAU_THEO_DANH_MUC: Record<DanhMucKhoanThu, string> = {
  'Học phí': tokens.colorPaletteBlueForeground2,
  'Bán trú': tokens.colorPaletteGreenForeground2,
  'Đưa đón': tokens.colorPaletteDarkOrangeForeground2,
  'Bảo hiểm y tế': tokens.colorPaletteRedForeground2,
  'Đồng phục': tokens.colorPalettePurpleForeground2,
  'Ngoại khoá': tokens.colorPaletteYellowForeground2,
  'Khoản thu khác': tokens.colorPaletteTealForeground2,
}

interface RevenueCompositionSectionProps {
  data: DashboardData
  loading?: boolean
}

export function RevenueCompositionSection({ data, loading }: RevenueCompositionSectionProps) {
  return (
    <SectionCard title="Cơ cấu khoản thu" icon={DataPieRegular} iconColor={tokens.colorPaletteBlueForeground2}>
      {loading ? (
        <TableSkeleton rows={4} />
      ) : data.coCauKhoanThu.length === 0 ? (
        <EmptyState />
      ) : (
        <DonutChart
          data={data.coCauKhoanThu.map((item) => ({
            label: item.label,
            value: item.value,
            color: MAU_THEO_DANH_MUC[item.label],
          }))}
          valueFormatter={formatCurrencyWithUnit}
        />
      )}
    </SectionCard>
  )
}
