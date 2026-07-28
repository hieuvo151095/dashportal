import { Body1, Caption1, Combobox, Field, Option, Title2, makeStyles, tokens } from '@fluentui/react-components'
import { mockDataset, type PhuongXa, type Truong } from '../mock-data'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
  picker: {
    minWidth: '320px',
  },
})

interface SchoolHeaderProps {
  title: string
  truong: Truong | undefined
  phuongXa: PhuongXa | undefined
  truongId: string
  onSelectTruong: (truongId: string) => void
}

export function SchoolHeader({ title, truong, phuongXa, truongId, onSelectTruong }: SchoolHeaderProps) {
  const styles = useStyles()
  const { truongList } = mockDataset

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <Title2 as="h1">{title}</Title2>
        {truong && (
          <Body1 as="p">
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
    </div>
  )
}
