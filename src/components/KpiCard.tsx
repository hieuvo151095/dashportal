import { Body1, Card, Caption1, makeStyles, tokens } from '@fluentui/react-components'
import type { FluentIcon } from '@fluentui/react-icons'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalXS,
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
})

export type KpiAccent = 'default' | 'success' | 'warning'

const ACCENT_COLOR: Record<KpiAccent, string> = {
  default: tokens.colorNeutralForeground1,
  success: tokens.colorPaletteGreenForeground1,
  warning: tokens.colorPaletteDarkOrangeForeground1,
}

interface KpiCardProps {
  icon: FluentIcon
  label: string
  value: string
  subValue?: string
  accent?: KpiAccent
  trailing?: ReactNode
}

export function KpiCard({ icon: Icon, label, value, subValue, accent = 'default', trailing }: KpiCardProps) {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Caption1>{label}</Caption1>
        <Icon className={styles.icon} />
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value} style={{ color: ACCENT_COLOR[accent] }}>
          {value}
        </span>
        {trailing}
      </div>
      {subValue && <Body1>{subValue}</Body1>}
    </Card>
  )
}
