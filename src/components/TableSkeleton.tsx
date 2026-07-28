import { Skeleton, SkeletonItem, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
  },
})

interface TableSkeletonProps {
  rows?: number
}

export function TableSkeleton({ rows = 6 }: TableSkeletonProps) {
  const styles = useStyles()

  return (
    <Skeleton className={styles.root}>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonItem key={index} shape="rectangle" style={{ height: '32px' }} />
      ))}
    </Skeleton>
  )
}
