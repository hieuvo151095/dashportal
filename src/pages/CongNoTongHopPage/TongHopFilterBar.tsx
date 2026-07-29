import { Combobox, Dropdown, Field, Option } from '@fluentui/react-components'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { SearchInput } from '../../components/SearchInput'
import { mockDataset } from '../../mock-data'
import { NHOM_TUOI_NO_LIST } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import type { TongHopFilters } from './useTongHopFilters'

const KY_OPTIONS = getKyOptions()
const TOAN_THANH_PHO = 'all'
const TAT_CA = 'all'

interface TongHopFilterBarProps {
  draft: TongHopFilters
  setDraft: (patch: Partial<TongHopFilters>) => void
  onApply: () => void
  onReset: () => void
}

export function TongHopFilterBar({ draft, setDraft, onApply, onReset }: TongHopFilterBarProps) {
  const { phuongXaList, truongList } = mockDataset

  const truongOptions = useMemo(
    () => truongList.filter((t) => draft.phuongXaId === TOAN_THANH_PHO || t.phuongXaId === draft.phuongXaId),
    [truongList, draft.phuongXaId],
  )

  const phuongXaLabel =
    draft.phuongXaId === TOAN_THANH_PHO
      ? 'Toàn thành phố'
      : (phuongXaList.find((p) => p.id === draft.phuongXaId)?.ten ?? 'Toàn thành phố')

  const truongLabel =
    draft.truongId === TAT_CA
      ? 'Tất cả trường'
      : (truongList.find((t) => t.id === draft.truongId)?.tenTruong ?? 'Tất cả trường')

  return (
    <FilterBar onApply={onApply} onReset={onReset}>
      <Field label="Tìm kiếm">
        <SearchInput value={draft.q} onChange={(value) => setDraft({ q: value })} placeholder="Tìm theo tên và mã trường" />
      </Field>

      <Field label="Xã/Phường">
        <Combobox
          value={phuongXaLabel}
          selectedOptions={[draft.phuongXaId]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ phuongXaId: data.optionValue, truongId: TAT_CA })}
        >
          <Option value={TOAN_THANH_PHO}>Toàn thành phố</Option>
          {phuongXaList.map((px) => (
            <Option key={px.id} value={px.id}>
              {px.ten}
            </Option>
          ))}
        </Combobox>
      </Field>

      <Field label="Trường">
        <Combobox
          value={truongLabel}
          selectedOptions={[draft.truongId]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ truongId: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả trường</Option>
          {truongOptions.map((t) => (
            <Option key={t.id} value={t.id}>
              {t.tenTruong}
            </Option>
          ))}
        </Combobox>
      </Field>

      <Field label="Kỳ phí từ">
        <Dropdown
          value={draft.kyTu}
          selectedOptions={[draft.kyTu]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ kyTu: data.optionValue })}
        >
          {KY_OPTIONS.map((ky) => (
            <Option key={ky} value={ky}>
              {ky}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="đến kỳ">
        <Dropdown
          value={draft.kyDen}
          selectedOptions={[draft.kyDen]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ kyDen: data.optionValue })}
        >
          {KY_OPTIONS.map((ky) => (
            <Option key={ky} value={ky}>
              {ky}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Nhóm tuổi nợ">
        <Dropdown
          value={draft.nhomTuoiNo === TAT_CA ? 'Tất cả nhóm' : draft.nhomTuoiNo}
          selectedOptions={[draft.nhomTuoiNo]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ nhomTuoiNo: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả nhóm</Option>
          {NHOM_TUOI_NO_LIST.map((nhom) => (
            <Option key={nhom} value={nhom}>
              {nhom}
            </Option>
          ))}
        </Dropdown>
      </Field>
    </FilterBar>
  )
}
