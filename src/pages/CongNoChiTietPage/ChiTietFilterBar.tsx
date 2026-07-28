import { Dropdown, Field, Option } from '@fluentui/react-components'
import { FilterBar } from '../../components/FilterBar'
import { SearchInput } from '../../components/SearchInput'
import { NHOM_TUOI_NO_LIST } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import type { ChiTietFilters } from './useChiTietFilters'

const KY_OPTIONS = getKyOptions()
const TAT_CA = 'all'

interface ChiTietFilterBarProps {
  draft: ChiTietFilters
  setDraft: (patch: Partial<ChiTietFilters>) => void
  onApply: () => void
  onReset: () => void
  khoiOptions: string[]
  lopOptions: string[]
}

export function ChiTietFilterBar({ draft, setDraft, onApply, onReset, khoiOptions, lopOptions }: ChiTietFilterBarProps) {
  return (
    <FilterBar onApply={onApply} onReset={onReset}>
      <Field label="Mã học sinh">
        <SearchInput value={draft.maHocSinh} onChange={(value) => setDraft({ maHocSinh: value })} placeholder="Tìm theo mã học sinh" />
      </Field>

      <Field label="Khối">
        <Dropdown
          value={draft.khoi === TAT_CA ? 'Tất cả khối' : draft.khoi}
          selectedOptions={[draft.khoi]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ khoi: data.optionValue, lop: TAT_CA })}
        >
          <Option value={TAT_CA}>Tất cả khối</Option>
          {khoiOptions.map((khoi) => (
            <Option key={khoi} value={khoi}>
              {khoi}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Lớp">
        <Dropdown
          value={draft.lop === TAT_CA ? 'Tất cả lớp' : draft.lop}
          selectedOptions={[draft.lop]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ lop: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả lớp</Option>
          {lopOptions.map((lop) => (
            <Option key={lop} value={lop}>
              {lop}
            </Option>
          ))}
        </Dropdown>
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
