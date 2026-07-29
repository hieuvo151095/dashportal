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
  showUnit?: boolean
}

// Tiêu đề trang dùng chung — kèm ghi chú đơn vị tiền tệ ở góc phải cùng hàng cho trang có
// cột tiền dạng bảng (case c). showUnit={false} cho trang không có số liệu tiền nào (case a
// — vd Danh mục Phí Tổng hợp, chỉ có "Số mục phí").
export function PageTitle({ title, showUnit = true }: PageTitleProps) {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Title2 as="h1">{title}</Title2>
      {showUnit && <Caption1 className={styles.unit}>Đơn vị: Đồng</Caption1>}
    </div>
  )
}
