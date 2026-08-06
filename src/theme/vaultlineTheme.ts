import { createLightTheme, type BrandVariants, type Theme } from '@fluentui/react-components'

// VaultLine design system — navy/gold, xem docs/vaultline-DESIGN.md (đính kèm yêu cầu gốc).
// Palette chính thức:
const NAVY = '#1E3A5F' // Primary
const GOLD = '#C49A2A' // Secondary
const IVORY = '#FFFDF7' // Background
const SURFACE = '#FFFFFF'
const COOL_GRAY = '#9CA3AF'
const SUCCESS = '#16A34A'
const WARNING = '#CA8A04'
const ERROR = '#DC2626'
const INFO = '#2563EB'
// Không nằm trong 4 màu trạng thái chính thức của VaultLine — dùng riêng cho họ DarkOrange
// (Badge color="severe") để bảng Công nợ theo tuổi nợ vẫn có 4 mức leo thang phân biệt được
// (≤30 ngày info xanh → 31-60 warning vàng hổ phách → 61-90 severe cam cháy → >90 danger đỏ).
// Nếu dùng lại đúng WARNING cho severe thì 2 mức 31-60/61-90 trùng màu, mất phân biệt.
const SEVERE = '#EA580C'

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const toHex = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function mix(hexA: string, hexB: string, t: number): string {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  return rgbToHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t])
}

// Fluent BrandVariants cần đủ 16 bậc (10..160), Fluent không có API public sinh ramp từ 1 màu
// (chỉ có Theme Designer online) — tự nội suy: bậc <=90 pha dần với đen (đậm nhất ở 10), bậc
// >=90 pha dần với trắng (nhạt nhất ở 160), giữ nguyên màu gốc Navy ở bậc 90.
function tinhBrandRamp(baseHex: string): BrandVariants {
  const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160] as const
  const ramp = {} as BrandVariants
  for (const step of steps) {
    if (step <= 90) {
      const t = (90 - step) / 80
      ramp[step] = mix(baseHex, '#000000', t)
    } else {
      const t = (step - 90) / 70
      ramp[step] = mix(baseHex, '#FFFFFF', t)
    }
  }
  return ramp
}

const vaultlineBrandRamp = tinhBrandRamp(NAVY)

export const vaultlineTheme: Theme = {
  ...createLightTheme(vaultlineBrandRamp),

  // Nền trang/bề mặt — Ivory cho page background, trắng cho Card/Dialog/Input.
  colorNeutralBackground1: SURFACE,
  colorNeutralBackground2: IVORY,
  colorNeutralBackground3: IVORY,

  // Neutral Cool Gray cho text phụ/border — giữ colorNeutralForeground1 (text chính) mặc định
  // đen-navy của Fluent, chỉ chỉnh foreground3 (text phụ/mờ) theo đúng mã Cool Gray.
  colorNeutralForeground3: COOL_GRAY,
  colorNeutralStroke1: '#E2DFD5',
  colorNeutralStroke2: '#E2DFD5',

  // Success / Warning / Error — đúng họ token Badge tint-* + KpiCard accent đang dùng (xác nhận
  // qua source @fluentui/react-badge): Green/Yellow/Red Background1+Foreground1+Border1. Ghi đè
  // thêm DarkOrange + Marigold (KpiCard đang dùng cho accent/màu card "warning") để mọi chỗ quy
  // về cùng 1 tông vàng hổ phách #CA8A04 thay vì lệch màu giữa các component.
  colorPaletteGreenBackground1: '#F0FDF4',
  colorPaletteGreenForeground1: SUCCESS,
  colorPaletteGreenBorder1: SUCCESS,
  colorPaletteGreenBackground2: '#DCFCE7',
  colorPaletteGreenForeground2: SUCCESS,

  colorPaletteRedBackground1: '#FEF2F2',
  colorPaletteRedForeground1: ERROR,
  colorPaletteRedBorder1: ERROR,
  colorPaletteRedBackground2: '#FEE2E2',
  colorPaletteRedForeground2: ERROR,

  colorPaletteYellowBackground1: '#FEFCE8',
  colorPaletteYellowForeground1: WARNING,
  colorPaletteYellowBorder1: WARNING,

  colorPaletteDarkOrangeBackground1: '#FFF3EA',
  colorPaletteDarkOrangeForeground1: SEVERE,
  colorPaletteDarkOrangeBorder1: SEVERE,

  colorPaletteMarigoldBackground2: '#FEFCE8',
  colorPaletteMarigoldForeground2: WARNING,

  // Info/"processing" — Fluent Badge "informative" mặc định trỏ vào token xám trung tính (không
  // phải xanh), nên KHÔNG override colorNeutralBackground4/Foreground3 (dùng chung cho skeleton,
  // hover...). Thay vào đó chuẩn hoá bằng họ Blue — nơi cần badge "processing" xanh sẽ set style
  // trực tiếp theo colorPaletteBlue* ở Phase 2 thay vì dựa vào color="informative".
  colorPaletteBlueBackground2: '#EFF6FF',
  colorPaletteBlueForeground2: INFO,

  // Gold — nhấn vàng đồng, dùng tiết chế (KPI chính, số liệu quan trọng), Fluent có sẵn họ
  // Gold 2 tầng (Background2/Foreground2) đúng khớp nhu cầu.
  colorPaletteGoldBackground2: '#FBF3DD',
  colorPaletteGoldForeground2: GOLD,

  // Navy — dùng cho KpiCard biến thể 'navy' (thay Purple mặc định Fluent không có trong bảng
  // màu VaultLine), cùng họ 2 tầng như Gold.
  colorPaletteNavyBackground2: '#E7ECF2',
  colorPaletteNavyForeground2: NAVY,

  // Typography — Inter (thân chữ) + IBM Plex Mono (số liệu/mã), nhúng qua Google Fonts ở
  // index.html. Serif tiêu đề (Roboto Serif) áp riêng qua CSS nhắm class fui-Title1/Title2/
  // Subtitle1/Subtitle2/Display (xem index.css) vì Fluent không có token fontFamily riêng cho
  // heading.
  fontFamilyBase:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyNumeric: "'IBM Plex Mono', ui-monospace, monospace",
  fontFamilyMonospace: "'IBM Plex Mono', ui-monospace, monospace",
}
