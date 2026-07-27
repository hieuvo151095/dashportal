import {
  Body1,
  Button,
  Card,
  CardHeader,
  Title3,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { formatCurrency } from './utils/currency'
import { formatDate, formatMonthYear } from './utils/date'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    fontFamily: tokens.fontFamilyBase,
  },
  card: {
    width: '360px',
    padding: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalM,
  },
})

function App() {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <CardHeader
          header={<Title3>Portal Giám sát Thu học phí</Title3>}
          description={<Body1>Phase 1 — Design system &amp; theme (Fluent 2)</Body1>}
        />
        <Body1>Tổng thu mẫu: {formatCurrency(586630000)}</Body1>
        <Body1>Kỳ báo cáo mẫu: {formatMonthYear(new Date())}</Body1>
        <Body1>Ngày cập nhật mẫu: {formatDate(new Date())}</Body1>
        <Button appearance="primary">Nút primary (Fluent 2)</Button>
      </Card>
    </div>
  )
}

export default App
