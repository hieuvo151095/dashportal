import { Button, Card, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowResetRegular, CheckmarkRegular } from '@fluentui/react-icons'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  card: {
    // flexDirection: column thay vì row+wrap — khối field và khối nút luôn là 2 "dòng"
    // riêng biệt, tách bạch. Với row+wrap, khi field ít/ngắn đủ để nằm chung 1 dòng với
    // nút (vd Dashboard chỉ 3 field), phép tính flex-shrink của trình duyệt co khối field
    // lại và đẩy lệch phải một cách khó đoán. column loại bỏ hẳn sự phụ thuộc vào số
    // lượng/độ dài field — field luôn căn trái, chiếm trọn chiều rộng.
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalL,
    // VaultLine Subtle shadow — Fluent Card mặc định dùng shadow4 (đậm hơn spec).
    boxShadow: '0 1px 3px rgba(30, 41, 59, 0.04), 0 1px 2px rgba(30, 41, 59, 0.02)',
  },
  fields: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalS,
    width: '100%',
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
    alignSelf: 'flex-end',
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
    <Card className={styles.card} appearance="outline">
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
