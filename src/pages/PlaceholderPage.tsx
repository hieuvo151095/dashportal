import { Body1, Card, Title2, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalXL,
    rowGap: tokens.spacingVerticalS,
    maxWidth: '480px',
  },
})

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <Title2>{title}</Title2>
      <Body1>Nội dung trang này sẽ được xây dựng ở giai đoạn tiếp theo.</Body1>
    </Card>
  )
}
