import { Body1, Caption1, Combobox, Field, Option, Title2, makeStyles, tokens } from '@fluentui/react-components'
import { mockDataset } from '../../mock-data'
import type { ChiTietData } from './useChiTietData'
import type { ChiTietFiltersApi } from './useChiTietFilters'

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

interface ChiTietHeaderProps {
  data: ChiTietData
  filters: ChiTietFiltersApi
}

export function ChiTietHeader({ data, filters }: ChiTietHeaderProps) {
  const styles = useStyles()
  const { truongList } = mockDataset

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <Title2 as="h1">Danh mục Phí — Chi tiết theo trường</Title2>
        {data.truong && (
          <Body1 as="p">
            {data.truong.tenTruong}
            {data.phuongXa && ` — ${data.phuongXa.ten}`}
            {` — ${data.truong.capHoc}`}
          </Body1>
        )}
        <Caption1 as="p">{`Mã trường: ${data.truong?.maTruong ?? '—'}`}</Caption1>
      </div>

      <Field label="Chọn trường" className={styles.picker}>
        <Combobox
          value={data.truong?.tenTruong ?? ''}
          selectedOptions={[filters.truongId]}
          onOptionSelect={(_, optionData) => optionData.optionValue && filters.setTruongId(optionData.optionValue)}
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
