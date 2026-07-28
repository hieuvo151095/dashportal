import { Body1, Button, makeStyles, tokens } from '@fluentui/react-components'
import { ChevronLeftRegular, ChevronRightRegular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalM,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
})

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) {
  const styles = useStyles()
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className={styles.root}>
      <Body1>{`Hiển thị ${start}–${end} / ${totalItems} dòng`}</Body1>
      <div className={styles.controls}>
        <Button
          appearance="subtle"
          icon={<ChevronLeftRegular />}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Trang trước"
        />
        <Body1>{`Trang ${page} / ${totalPages}`}</Body1>
        <Button
          appearance="subtle"
          icon={<ChevronRightRegular />}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Trang sau"
        />
      </div>
    </div>
  )
}
