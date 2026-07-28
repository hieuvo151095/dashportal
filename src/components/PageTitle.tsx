import { Caption1, Title2, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
  },
  unit: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
})

interface PageTitleProps {
  title: string
}

// Tiêu đề trang dùng chung — luôn kèm ghi chú đơn vị tiền tệ ở góc phải cùng hàng,
// vì toàn bộ số tiền trong app đã bỏ hậu tố "đ" (formatCurrency chỉ trả số thô).
export function PageTitle({ title }: PageTitleProps) {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Title2 as="h1">{title}</Title2>
      <Caption1 className={styles.unit}>Đơn vị: Đồng</Caption1>
    </div>
  )
}
