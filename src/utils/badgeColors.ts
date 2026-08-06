import { tokens } from '@fluentui/react-components'

// Fluent Badge color="informative" mặc định trỏ vào token xám trung tính (colorNeutralBackground4/
// colorNeutralForeground3), không phải xanh — 2 token đó dùng chung cho skeleton/hover/nền "chưa
// có dữ liệu" (xem GridMap.tsx) nên KHÔNG override toàn cục được. Nơi nào cần badge "informative"
// mang nghĩa xanh dương (VaultLine Info/"processing") thì set style trực tiếp bằng hằng số này
// thay vì dựa vào color="informative".
export const BADGE_INFO_STYLE = {
  backgroundColor: tokens.colorPaletteBlueBackground2,
  color: tokens.colorPaletteBlueForeground2,
  borderColor: tokens.colorPaletteBlueBorderActive,
}
