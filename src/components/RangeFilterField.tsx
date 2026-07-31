import { Field, makeStyles, tokens } from '@fluentui/react-components'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
  control: {
    flex: 1,
    minWidth: 0,
  },
  separator: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
})

interface RangeFilterFieldProps {
  label: string
  from: ReactNode
  to: ReactNode
}

// Gộp 2 control "từ"/"đến" (kỳ, ngày...) vào 1 khung Field duy nhất — thay cho pattern 2 Field
// riêng biệt (vd "Kỳ phí từ" + "đến kỳ", "Hạn thanh toán từ ngày" + "đến ngày") dùng rải rác
// trước đây. minWidth rộng hơn Field thường (FilterBar đặt minWidth 200px cho mỗi Field con)
// vì khung này chứa 2 control — set inline để thắng luôn selector `.fields > .fui-Field`.
export function RangeFilterField({ label, from, to }: RangeFilterFieldProps) {
  const styles = useStyles()

  return (
    <Field label={label} style={{ minWidth: '340px' }}>
      <div className={styles.row}>
        <div className={styles.control}>{from}</div>
        <span className={styles.separator}>–</span>
        <div className={styles.control}>{to}</div>
      </div>
    </Field>
  )
}
