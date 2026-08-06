import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import type { HTMLAttributes } from 'react'

const useStyles = makeStyles({
  root: {
    fontFamily: tokens.fontFamilyNumeric,
  },
})

interface MonoAmountProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

// VaultLine: định dạng tiền tệ/số liệu dùng IBM Plex Mono để căn thẳng hàng (xem
// vaultlineTheme.ts — fontFamilyNumeric). Bọc quanh output của utils/currency.ts tại nơi
// render, không sửa hàm format (vẫn trả string thuần để dùng được ở chỗ không cần font riêng).
export function MonoAmount({ children, className, ...rest }: MonoAmountProps) {
  const styles = useStyles()
  return (
    <span className={mergeClasses(styles.root, className)} {...rest}>
      {children}
    </span>
  )
}
