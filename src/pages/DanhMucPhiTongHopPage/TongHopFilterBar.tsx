import { Dropdown, Field, Option } from '@fluentui/react-components'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { SearchableMultiCombobox } from '../../components/SearchableMultiCombobox'
import { SearchInput } from '../../components/SearchInput'
import { NGUON_THU_LIST, NHOM_PHI_LIST, NIEN_KHOA_LIST, mockDataset } from '../../mock-data'
import type { TongHopFilters } from './useTongHopFilters'

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
    () => truongList.filter((t) => draft.phuongXaIds.length === 0 || draft.phuongXaIds.includes(t.phuongXaId)),
    [truongList, draft.phuongXaIds],
  )

  // Đổi Xã/Phường (multi) → bỏ khỏi Trường đã chọn những trường không còn thuộc phạm vi mới —
  // atomic trong 1 lần setDraft (draft là state cục bộ nên không có nguy cơ đè lẫn nhau).
  function handlePhuongXaChange(values: string[]) {
    const scopedTruongIds = new Set(
      truongList.filter((t) => values.length === 0 || values.includes(t.phuongXaId)).map((t) => t.id),
    )
    setDraft({
      phuongXaIds: values,
      truongIds: draft.truongIds.filter((id) => scopedTruongIds.has(id)),
    })
  }

  return (
    <FilterBar onApply={onApply} onReset={onReset}>
      <Field label="Tìm kiếm">
        <SearchInput value={draft.q} onChange={(value) => setDraft({ q: value })} placeholder="Tên hoặc mã trường" />
      </Field>

      <Field label="Xã/Phường">
        <SearchableMultiCombobox
          options={phuongXaList.map((px) => ({ value: px.id, label: px.ten }))}
          selected={draft.phuongXaIds}
          onChange={handlePhuongXaChange}
          placeholder="Tìm Xã/Phường"
          allLabel="Toàn thành phố"
        />
      </Field>

      <Field label="Trường">
        <SearchableMultiCombobox
          options={truongOptions.map((t) => ({ value: t.id, label: t.tenTruong }))}
          selected={draft.truongIds}
          onChange={(values) => setDraft({ truongIds: values })}
          placeholder="Tìm trường"
          allLabel="Tất cả trường"
        />
      </Field>

      <Field label="Niên khoá">
        <Dropdown
          value={draft.nienKhoa}
          selectedOptions={[draft.nienKhoa]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ nienKhoa: data.optionValue })}
        >
          {NIEN_KHOA_LIST.map((nk) => (
            <Option key={nk} value={nk}>
              {nk}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Nhóm phí">
        <Dropdown
          value={draft.nhomPhi === TAT_CA ? 'Tất cả nhóm phí' : draft.nhomPhi}
          selectedOptions={[draft.nhomPhi]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ nhomPhi: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả nhóm phí</Option>
          {NHOM_PHI_LIST.map((nhom) => (
            <Option key={nhom} value={nhom}>
              {nhom}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Nguồn thu">
        <Dropdown
          value={draft.nguonThu === TAT_CA ? 'Tất cả nguồn thu' : draft.nguonThu}
          selectedOptions={[draft.nguonThu]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ nguonThu: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả nguồn thu</Option>
          {NGUON_THU_LIST.map((nguon) => (
            <Option key={nguon} value={nguon}>
              {nguon}
            </Option>
          ))}
        </Dropdown>
      </Field>
    </FilterBar>
  )
}
