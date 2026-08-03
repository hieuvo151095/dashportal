import { Dropdown, Field, Input, Option } from '@fluentui/react-components'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { RangeFilterField } from '../../components/RangeFilterField'
import { SearchInput } from '../../components/SearchInput'
import { NHOM_TUOI_NO_LIST } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import {
  ALL_OPTION_VALUE,
  resolveMultiSelectChange,
  resolveMultiSelectChangeEmpty,
  withAllOptionSelected,
  withAllOptionSelectedEmpty,
} from '../../utils/multiSelectAll'
import type { ChiTietFilters } from './useChiTietFilters'

const KY_OPTIONS = getKyOptions()

interface ChiTietFilterBarProps {
  draft: ChiTietFilters
  setDraft: (patch: Partial<ChiTietFilters>) => void
  onApply: () => void
  onReset: () => void
  khoiOptions: string[]
  lopOptionsTheoKhoi: Record<string, string[]>
}

export function ChiTietFilterBar({
  draft,
  setDraft,
  onApply,
  onReset,
  khoiOptions,
  lopOptionsTheoKhoi,
}: ChiTietFilterBarProps) {
  // Lớp phải phản ứng theo Khối đang chỉnh trong DRAFT (chưa Áp dụng) — không dùng lại
  // data.lopOptions vốn tính theo filters (URL) đã áp dụng, kẻo hiển thị sai khi đang gõ dở.
  const lopOptions = useMemo(() => {
    const khoiXet = draft.khoiList.length === 0 ? khoiOptions : draft.khoiList
    return [...new Set(khoiXet.flatMap((k) => lopOptionsTheoKhoi[k] ?? []))].sort((a, b) => a.localeCompare(b, 'vi'))
  }, [draft.khoiList, khoiOptions, lopOptionsTheoKhoi])

  const khoiLabel = draft.khoiList.length === 0 ? 'Tất cả khối' : draft.khoiList.join(', ')
  const lopLabel = draft.lopList.length === 0 ? 'Tất cả lớp' : draft.lopList.join(', ')
  const nhomTuoiNoLabel =
    draft.nhomTuoiNoList.length === NHOM_TUOI_NO_LIST.length ? 'Tất cả nhóm' : draft.nhomTuoiNoList.join(', ')

  // Đổi Khối (multi) → bỏ khỏi Lớp đã chọn những lớp không còn thuộc các khối mới chọn.
  function handleKhoiChange(values: string[]) {
    const khoiXet = values.length === 0 ? khoiOptions : values
    const allowedLop = new Set(khoiXet.flatMap((k) => lopOptionsTheoKhoi[k] ?? []))
    setDraft({
      khoiList: values,
      lopList: draft.lopList.filter((l) => allowedLop.has(l)),
    })
  }

  return (
    <FilterBar onApply={onApply} onReset={onReset}>
      <Field label="Tìm kiếm">
        <SearchInput value={draft.q} onChange={(value) => setDraft({ q: value })} placeholder="Tìm theo mã và tên học sinh" />
      </Field>

      <Field label="Khối">
        <Dropdown
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          multiselect
          value={khoiLabel}
          selectedOptions={withAllOptionSelectedEmpty(draft.khoiList)}
          onOptionSelect={(_, data) => handleKhoiChange(resolveMultiSelectChangeEmpty(data))}
        >
          <Option value={ALL_OPTION_VALUE}>Tất cả</Option>
          {khoiOptions.map((khoi) => (
            <Option key={khoi} value={khoi}>
              {khoi}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Lớp">
        <Dropdown
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          multiselect
          value={lopLabel}
          selectedOptions={withAllOptionSelectedEmpty(draft.lopList)}
          onOptionSelect={(_, data) => setDraft({ lopList: resolveMultiSelectChangeEmpty(data) })}
        >
          <Option value={ALL_OPTION_VALUE}>Tất cả</Option>
          {lopOptions.map((lop) => (
            <Option key={lop} value={lop}>
              {lop}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <RangeFilterField
        label="Kỳ phí"
        from={
          <Dropdown
            positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
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
        }
        to={
          <Dropdown
            positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
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
        }
      />

      <RangeFilterField
        label="Hạn thanh toán"
        from={<Input type="date" value={draft.hanTu} onChange={(_, data) => setDraft({ hanTu: data.value })} />}
        to={<Input type="date" value={draft.hanDen} onChange={(_, data) => setDraft({ hanDen: data.value })} />}
      />

      <Field label="Nhóm tuổi nợ">
        <Dropdown
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          multiselect
          value={nhomTuoiNoLabel}
          selectedOptions={withAllOptionSelected(NHOM_TUOI_NO_LIST, draft.nhomTuoiNoList)}
          onOptionSelect={(_, data) =>
            setDraft({ nhomTuoiNoList: resolveMultiSelectChange(NHOM_TUOI_NO_LIST, data) })
          }
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
