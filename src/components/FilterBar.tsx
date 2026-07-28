import { Button, Card, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowResetRegular, CheckmarkRegular } from '@fluentui/react-icons'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalL,
  },
  fields: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalS,
    flexGrow: 1,
    // Field width cố định theo nội dung field (không theo giá trị đang chọn) — tránh
    // khung filter tự giãn/co khi chọn 1 giá trị dài/ngắn khác nhau.
    '& > .fui-Field': {
      minWidth: '200px',
    },
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
})

interface FilterBarProps {
  children: ReactNode
  action?: ReactNode
  onApply: () => void
  onReset: () => void
}

// Filter bar dùng chung cho mọi trang — bọc trong khung (Card) kích thước cố định, luôn
// có 2 nút Áp dụng/Làm mới: chỉnh filter chưa lọc ngay, phải bấm Áp dụng mới thực sự lọc
// dữ liệu; Làm mới đưa toàn bộ filter về mặc định cứng.
export function FilterBar({ children, action, onApply, onReset }: FilterBarProps) {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <div className={styles.fields}>{children}</div>
      <div className={styles.buttons}>
        {action}
        <Button appearance="secondary" icon={<ArrowResetRegular />} onClick={onReset}>
          Làm mới
        </Button>
        <Button appearance="primary" icon={<CheckmarkRegular />} onClick={onApply}>
          Áp dụng
        </Button>
      </div>
    </Card>
  )
}
