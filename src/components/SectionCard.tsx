import { Card, Caption1, Subtitle2, makeStyles, tokens } from '@fluentui/react-components'
import type { FluentIcon } from '@fluentui/react-icons'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalM,
    height: '100%',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
})

interface SectionCardProps {
  title: string
  note?: string
  action?: ReactNode
  children: ReactNode
  /** Icon nhỏ màu cạnh tiêu đề — không truyền = không có icon (giữ nguyên như cũ). */
  icon?: FluentIcon
  /** Màu icon (token palette). Chỉ có tác dụng khi truyền kèm `icon`. */
  iconColor?: string
}

export function SectionCard({ title, note, action, children, icon: Icon, iconColor }: SectionCardProps) {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <div className={styles.header} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <div>
          <div className={styles.titleRow}>
            {Icon && <Icon fontSize={18} style={{ color: iconColor }} />}
            <Subtitle2>{title}</Subtitle2>
          </div>
          {note && <Caption1 as="p">{note}</Caption1>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}
