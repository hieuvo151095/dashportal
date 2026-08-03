import { Body1, Card, Caption1, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowDownRegular, ArrowUpRegular, type FluentIcon } from '@fluentui/react-icons'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalXS,
    // Card không tự set height — grid 5 cột (KpiRow) mặc định stretch item theo hàng, nhưng
    // Fluent Card có sẵn quy tắc nội bộ ghi đè việc đó, khiến 2 card thiếu subValue/trend (Tỉ
    // lệ hoàn thành, Cơ sở giáo dục) co lại thấp hơn 3 card còn lại. height:100% ép card luôn
    // lấp đầy đúng chiều cao hàng grid, các card thiếu dòng chỉ để trống khoảng dưới.
    height: '100%',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: '20px',
    color: tokens.colorNeutralForeground3,
  },
  iconBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: '18px',
    flexShrink: 0,
  },
  valueRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  value: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero700,
  },
  trendRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXXS,
  },
})

export type KpiAccent = 'default' | 'success' | 'warning' | 'danger'

const ACCENT_COLOR: Record<KpiAccent, string> = {
  default: tokens.colorNeutralForeground1,
  success: tokens.colorPaletteGreenForeground1,
  warning: tokens.colorPaletteDarkOrangeForeground1,
  danger: tokens.colorPaletteRedForeground1,
}

// Màu KPI card — dùng token palette có sẵn trong theme Fluent 2 (colorPaletteXBackground2 cho
// nền cả card, colorPaletteXForeground2 cho badge/icon), không hardcode hex mới. Các màu accent
// chung (blue/purple/teal/...) trong Fluent 2 chỉ có 1 tầng Background — nên card dùng tầng nhạt
// đó, còn badge dùng chính màu Foreground2 làm nền đặc (đậm hơn hẳn) + icon trắng để nổi bật.
export type KpiColor = 'blue' | 'green' | 'marigold' | 'purple' | 'teal' | 'red'

const COLOR_TOKENS: Record<KpiColor, { cardBackground: string; badgeBackground: string }> = {
  blue: { cardBackground: tokens.colorPaletteBlueBackground2, badgeBackground: tokens.colorPaletteBlueForeground2 },
  green: {
    cardBackground: tokens.colorPaletteGreenBackground2,
    badgeBackground: tokens.colorPaletteGreenForeground2,
  },
  marigold: {
    cardBackground: tokens.colorPaletteMarigoldBackground2,
    badgeBackground: tokens.colorPaletteMarigoldForeground2,
  },
  purple: {
    cardBackground: tokens.colorPalettePurpleBackground2,
    badgeBackground: tokens.colorPalettePurpleForeground2,
  },
  teal: { cardBackground: tokens.colorPaletteTealBackground2, badgeBackground: tokens.colorPaletteTealForeground2 },
  red: { cardBackground: tokens.colorPaletteRedBackground2, badgeBackground: tokens.colorPaletteRedForeground1 },
}

export interface KpiTrend {
  direction: 'up' | 'down'
  label: string
}

interface KpiCardProps {
  icon: FluentIcon
  label: string
  value: string
  subValue?: string
  accent?: KpiAccent
  trailing?: ReactNode
  /** Bọc icon trong khối nền màu (icon badge). Không truyền = icon phẳng như cũ. */
  color?: KpiColor
  /** Dòng "+X% so với kỳ trước" dưới số liệu chính. Không truyền = không hiện dòng này. */
  trend?: KpiTrend
}

export function KpiCard({
  icon: Icon,
  label,
  value,
  subValue,
  accent = 'default',
  trailing,
  color,
  trend,
}: KpiCardProps) {
  const styles = useStyles()
  const colorTokens = color ? COLOR_TOKENS[color] : null
  const trendColor = trend?.direction === 'up' ? tokens.colorPaletteGreenForeground1 : tokens.colorPaletteRedForeground1
  const TrendArrow = trend?.direction === 'up' ? ArrowUpRegular : ArrowDownRegular

  return (
    <Card className={styles.card} style={colorTokens ? { backgroundColor: colorTokens.cardBackground } : undefined}>
      <div className={styles.header}>
        <Caption1>{label}</Caption1>
        {colorTokens ? (
          <div
            className={styles.iconBadge}
            style={{
              backgroundColor: colorTokens.badgeBackground,
              color: tokens.colorNeutralForegroundStaticInverted,
            }}
          >
            <Icon />
          </div>
        ) : (
          <Icon className={styles.icon} />
        )}
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value} style={{ color: ACCENT_COLOR[accent] }}>
          {value}
        </span>
        {trailing}
      </div>
      {subValue && <Body1>{subValue}</Body1>}
      {trend && (
        <div className={styles.trendRow} style={{ color: trendColor }}>
          <TrendArrow fontSize={14} />
          <Caption1 style={{ color: trendColor }}>{trend.label}</Caption1>
        </div>
      )}
    </Card>
  )
}
