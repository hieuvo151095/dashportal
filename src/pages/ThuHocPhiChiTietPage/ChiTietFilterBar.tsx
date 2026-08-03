import { Dropdown, Field, Input, Option } from '@fluentui/react-components'
import { FilterBar } from '../../components/FilterBar'
import { RangeFilterField } from '../../components/RangeFilterField'
import { SearchInput } from '../../components/SearchInput'
import { HINH_THUC_THANH_TOAN_LIST, NIEN_KHOA, type TrangThaiHoaDon } from '../../mock-data'
import { getKyOptions } from '../../utils/ky'
import { TRANG_THAI_LABEL, TRANG_THAI_LIST } from './useChiTietData'
import type { ChiTietFilters } from './useChiTietFilters'

const KY_OPTIONS = [...getKyOptions(), NIEN_KHOA]
const TAT_CA = 'all'

interface ChiTietFilterBarProps {
  draft: ChiTietFilters
  setDraft: (patch: Partial<ChiTietFilters>) => void
  onApply: () => void
  onReset: () => void
  lopOptions: string[]
}

export function ChiTietFilterBar({ draft, setDraft, onApply, onReset, lopOptions }: ChiTietFilterBarProps) {
  return (
    <FilterBar onApply={onApply} onReset={onReset}>
      <Field label="Tìm kiếm">
        <SearchInput
          value={draft.q}
          onChange={(value) => setDraft({ q: value })}
          placeholder="Tìm theo học sinh và tên hoá đơn"
        />
      </Field>

      <Field label="Lớp">
        <Dropdown
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
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

      <Field label="Kỳ">
        <Dropdown
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          value={draft.ky === TAT_CA ? 'Tất cả các kỳ' : draft.ky}
          selectedOptions={[draft.ky]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ ky: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả các kỳ</Option>
          {KY_OPTIONS.map((ky) => (
            <Option key={ky} value={ky}>
              {ky}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Trạng thái">
        <Dropdown
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          value={draft.trangThai === TAT_CA ? 'Tất cả trạng thái' : TRANG_THAI_LABEL[draft.trangThai as TrangThaiHoaDon]}
          selectedOptions={[draft.trangThai]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ trangThai: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả trạng thái</Option>
          {TRANG_THAI_LIST.map((tt) => (
            <Option key={tt} value={tt}>
              {TRANG_THAI_LABEL[tt]}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Hình thức thanh toán">
        <Dropdown
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          value={draft.hinhThucThanhToan === TAT_CA ? 'Tất cả hình thức' : draft.hinhThucThanhToan}
          selectedOptions={[draft.hinhThucThanhToan]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ hinhThucThanhToan: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả hình thức</Option>
          {HINH_THUC_THANH_TOAN_LIST.map((ht) => (
            <Option key={ht} value={ht}>
              {ht}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <RangeFilterField
        label="Hạn thanh toán"
        from={<Input type="date" value={draft.hanTu} onChange={(_, data) => setDraft({ hanTu: data.value })} />}
        to={<Input type="date" value={draft.hanDen} onChange={(_, data) => setDraft({ hanDen: data.value })} />}
      />

      <RangeFilterField
        label="Ngày thanh toán"
        from={<Input type="date" value={draft.ngayTtTu} onChange={(_, data) => setDraft({ ngayTtTu: data.value })} />}
        to={<Input type="date" value={draft.ngayTtDen} onChange={(_, data) => setDraft({ ngayTtDen: data.value })} />}
      />
    </FilterBar>
  )
}
