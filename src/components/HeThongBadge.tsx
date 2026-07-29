import { Badge, type BadgeProps } from '@fluentui/react-components'
import type { HeThongDoiTac } from '../mock-data'

const HE_THONG_BADGE_COLOR: Record<HeThongDoiTac, BadgeProps['color']> = {
  SSC: 'brand',
  Misa: 'success',
  Viettel: 'danger',
  VNPT: 'informative',
  eNetViet: 'warning',
  YoYoSchool: 'severe',
  'ECO School': 'important',
}

interface HeThongBadgeProps {
  value: HeThongDoiTac
}

export function HeThongBadge({ value }: HeThongBadgeProps) {
  return (
    <Badge appearance="tint" color={HE_THONG_BADGE_COLOR[value]}>
      {value}
    </Badge>
  )
}
