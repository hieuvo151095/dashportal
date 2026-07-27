import { Card, Caption1, Subtitle2, makeStyles, tokens } from '@fluentui/react-components'
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
})

interface SectionCardProps {
  title: string
  note?: string
  action?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, note, action, children }: SectionCardProps) {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <div className={styles.header} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <div>
          <Subtitle2>{title}</Subtitle2>
          {note && <Caption1 as="p">{note}</Caption1>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}
