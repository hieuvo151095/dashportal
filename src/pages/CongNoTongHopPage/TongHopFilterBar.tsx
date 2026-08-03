import { Dropdown, Field, Option } from '@fluentui/react-components'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { RangeFilterField } from '../../components/RangeFilterField'
import { SearchInput } from '../../components/SearchInput'
import { SearchableMultiCombobox } from '../../components/SearchableMultiCombobox'
import { mockDataset } from '../../mock-data'
import { NHOM_TUOI_NO_LIST } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import { ALL_OPTION_VALUE, resolveMultiSelectChange, withAllOptionSelected } from '../../utils/multiSelectAll'
import type { TongHopFilters } from './useTongHopFilters'

const KY_OPTIONS = getKyOptions()
const KY_INDEX = new Map(KY_OPTIONS.map((ky, index) => [ky, index]))
// Công nợ 4.1 giới hạn tối đa 6 kỳ trong khoảng chọn — hiện KY_OPTIONS chỉ có đúng 6 kỳ nên
// giới hạn này chưa từng thực sự "chặn" được gì, nhưng vẫn tính tổng quát theo index để đúng
// nếu sau này danh sách kỳ dài hơn 6.
const MAX_KY_SPAN = 6

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

  const nhomTuoiNoLabel =
    draft.nhomTuoiNoList.length === NHOM_TUOI_NO_LIST.length ? 'Tất cả nhóm' : draft.nhomTuoiNoList.join(', ')

  function handlePhuongXaChange(values: string[]) {
    const scopedTruongIds = new Set(
      truongList.filter((t) => values.length === 0 || values.includes(t.phuongXaId)).map((t) => t.id),
    )
    setDraft({
      phuongXaIds: values,
      truongIds: draft.truongIds.filter((id) => scopedTruongIds.has(id)),
    })
  }

  // Vô hiệu hoá (xám) option ngoài phạm vi ở đầu kia của khoảng — vừa giữ đúng thứ tự từ ≤ đến,
  // vừa giữ khoảng không vượt quá MAX_KY_SPAN kỳ. Không cần tự động kẹp giá trị vì option
  // không hợp lệ đã không thể bấm chọn được ngay từ đầu.
  const idxTu = KY_INDEX.get(draft.kyTu) ?? 0
  const idxDen = KY_INDEX.get(draft.kyDen) ?? KY_OPTIONS.length - 1

  return (
    <FilterBar onApply={onApply} onReset={onReset}>
      <Field label="Tìm kiếm">
        <SearchInput value={draft.q} onChange={(value) => setDraft({ q: value })} placeholder="Tìm theo tên và mã trường" />
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

      <RangeFilterField
        label="Kỳ phí"
        from={
          <Dropdown
            value={draft.kyTu}
            selectedOptions={[draft.kyTu]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ kyTu: data.optionValue })}
          >
            {KY_OPTIONS.map((ky, idx) => (
              <Option key={ky} value={ky} disabled={idx > idxDen || idx < idxDen - (MAX_KY_SPAN - 1)}>
                {ky}
              </Option>
            ))}
          </Dropdown>
        }
        to={
          <Dropdown
            value={draft.kyDen}
            selectedOptions={[draft.kyDen]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ kyDen: data.optionValue })}
          >
            {KY_OPTIONS.map((ky, idx) => (
              <Option key={ky} value={ky} disabled={idx < idxTu || idx > idxTu + (MAX_KY_SPAN - 1)}>
                {ky}
              </Option>
            ))}
          </Dropdown>
        }
      />

      <Field label="Nhóm tuổi nợ">
        <Dropdown
          multiselect
          value={nhomTuoiNoLabel}
          selectedOptions={withAllOptionSelected(NHOM_TUOI_NO_LIST, draft.nhomTuoiNoList)}
          onOptionSelect={(_, data) => setDraft({ nhomTuoiNoList: resolveMultiSelectChange(NHOM_TUOI_NO_LIST, data) })}
        >
          <Option value={ALL_OPTION_VALUE}>Tất cả</Option>
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
