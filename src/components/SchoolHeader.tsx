import { Body1, Caption1, Card, Field, makeStyles, tokens } from '@fluentui/react-components'
import { mockDataset, type PhuongXa, type Truong } from '../mock-data'
import { SearchableCombobox } from './SearchableCombobox'

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalL,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalM,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
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
  truong: Truong | undefined
  phuongXa: PhuongXa | undefined
  truongId: string
  onSelectTruong: (truongId: string) => void
}

export function SchoolHeader({ truong, phuongXa, truongId, onSelectTruong }: SchoolHeaderProps) {
  const styles = useStyles()
  const { truongList } = mockDataset

  return (
    <Card className={styles.card}>
      <div className={styles.infoRow}>
        <div className={styles.info}>
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
          <SearchableCombobox
            options={truongList.map((t) => ({ value: t.id, label: t.tenTruong }))}
            value={truongId}
            onChange={onSelectTruong}
          />
        </Field>
      </div>
    </Card>
  )
}
