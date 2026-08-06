import {
  ArrowTrendingDownRegular,
  DataBarVerticalRegular,
  FolderRegular,
  MoneyRegular,
  SettingsRegular,
} from '@fluentui/react-icons'
import type { FluentIcon } from '@fluentui/react-icons'

export interface NavLeaf {
  type: 'leaf'
  path: string
  label: string
}

export interface NavGroup {
  type: 'group'
  value: string
  label: string
  icon: FluentIcon
  items: { path: string; label: string }[]
}

export type NavEntry = NavLeaf | NavGroup

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return entry.type === 'group'
}

export const navTree: NavEntry[] = [
  { type: 'leaf', path: '/dashboard', label: 'Tổng quan' },
  {
    type: 'group',
    value: 'danh-muc-phi',
    label: 'Danh mục Phí',
    icon: FolderRegular,
    items: [
      { path: '/danh-muc-phi/tong-hop', label: 'Tổng hợp toàn thành phố' },
      { path: '/danh-muc-phi/chi-tiet', label: 'Chi tiết theo trường' },
    ],
  },
  {
    type: 'group',
    value: 'thu-hoc-phi',
    label: 'Thu Học phí',
    icon: MoneyRegular,
    items: [
      { path: '/thu-hoc-phi/tong-hop', label: 'Tổng hợp toàn thành phố' },
      { path: '/thu-hoc-phi/chi-tiet', label: 'Chi tiết theo trường' },
    ],
  },
  {
    type: 'group',
    value: 'cong-no',
    label: 'Công nợ Học phí',
    icon: ArrowTrendingDownRegular,
    items: [
      { path: '/cong-no/tong-hop', label: 'Tổng hợp toàn thành phố' },
      { path: '/cong-no/chi-tiet', label: 'Chi tiết theo trường' },
    ],
  },
  { type: 'leaf', path: '/thiet-lap', label: 'Thiết lập' },
]

export const ThietLapIcon: FluentIcon = SettingsRegular

export const DashboardIcon: FluentIcon = DataBarVerticalRegular

export interface BreadcrumbTrailItem {
  label: string
  path?: string
}

// Suy ra breadcrumb "Trang chủ / Nhóm / Trang" từ navTree — dùng chung 1 nguồn với Sidebar.
export function getBreadcrumbTrail(pathname: string): BreadcrumbTrailItem[] {
  const trail: BreadcrumbTrailItem[] = [{ label: 'Trang chủ', path: '/dashboard' }]

  for (const entry of navTree) {
    if (entry.type === 'leaf' && entry.path === pathname) {
      trail.push({ label: entry.label })
      return trail
    }
    if (entry.type === 'group') {
      const item = entry.items.find((it) => it.path === pathname)
      if (item) {
        trail.push({ label: entry.label }, { label: item.label })
        return trail
      }
    }
  }

  return trail
}
