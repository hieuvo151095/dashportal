import { Body1, Caption1, Card, Combobox, Field, Option, Title2, makeStyles, tokens } from '@fluentui/react-components'
import { mockDataset, type PhuongXa, type Truong } from '../mock-data'

const useStyles = makeStyles({
  card: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalL,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
  moduleRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalM,
  },
  unit: {
    color: tokens.colorNeutralForeground3,
  },
  pageTitle: {
    color: tokens.colorNeutralForeground3,
  },
  picker: {
    minWidth: '320px',
  },
  truongInfo: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
})

interface SchoolHeaderProps {
  moduleTitle: string
  pageTitle: string
  truong: Truong | undefined
  phuongXa: PhuongXa | undefined
  truongId: string
  onSelectTruong: (truongId: string) => void
}

export function SchoolHeader({ moduleTitle, pageTitle, truong, phuongXa, truongId, onSelectTruong }: SchoolHeaderProps) {
  const styles = useStyles()
  const { truongList } = mockDataset

  return (
    <Card className={styles.card}>
      <div className={styles.info}>
        <div className={styles.moduleRow}>
          <Title2 as="h1">{moduleTitle}</Title2>
          <Caption1 className={styles.unit}>Đơn vị: Đồng</Caption1>
        </div>
        <Caption1 as="p" className={styles.pageTitle}>
          {pageTitle}
        </Caption1>
        {truong && (
          <Body1 as="p" className={styles.truongInfo}>
            {truong.tenTruong}
            {phuongXa && ` — ${phuongXa.ten}`}
            {` — ${truong.capHoc}`}
          </Body1>
        )}
        <Caption1 as="p">{`Mã trường: ${truong?.maTruong ?? '—'}`}</Caption1>
      </div>

      <Field label="Chọn trường" className={styles.picker}>
        <Combobox
          value={truong?.tenTruong ?? ''}
          selectedOptions={[truongId]}
          onOptionSelect={(_, data) => data.optionValue && onSelectTruong(data.optionValue)}
        >
          {truongList.map((t) => (
            <Option key={t.id} value={t.id}>
              {t.tenTruong}
            </Option>
          ))}
        </Combobox>
      </Field>
    </Card>
  )
}
