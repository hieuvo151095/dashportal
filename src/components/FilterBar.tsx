import { makeStyles, tokens } from '@fluentui/react-components'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalL,
  },
  fields: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalS,
    flexGrow: 1,
  },
})

interface FilterBarProps {
  children: ReactNode
  action?: ReactNode
}

export function FilterBar({ children, action }: FilterBarProps) {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <div className={styles.fields}>{children}</div>
      {action}
    </div>
  )
}
