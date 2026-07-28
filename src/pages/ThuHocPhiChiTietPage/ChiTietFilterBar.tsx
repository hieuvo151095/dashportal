import { Button, Dropdown, Field, Input, Option } from '@fluentui/react-components'
import { FilterRegular } from '@fluentui/react-icons'
import { useState } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { SearchInput } from '../../components/SearchInput'
import { HINH_THUC_THANH_TOAN_LIST, NIEN_KHOA, type TrangThaiHoaDon } from '../../mock-data'
import { getKyOptions } from '../../utils/ky'
import type { ChiTietFilters } from './useChiTietFilters'

const KY_OPTIONS = [...getKyOptions(), NIEN_KHOA]
const TRANG_THAI_LIST: TrangThaiHoaDon[] = ['Đã gửi', 'Thanh toán một phần', 'Đã thanh toán']
const TAT_CA = 'all'

interface ChiTietFilterBarProps {
  draft: ChiTietFilters
  setDraft: (patch: Partial<ChiTietFilters>) => void
  onApply: () => void
  onReset: () => void
  lopOptions: string[]
}

export function ChiTietFilterBar({ draft, setDraft, onApply, onReset, lopOptions }: ChiTietFilterBarProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  return (
    <FilterBar
      onApply={onApply}
      onReset={onReset}
      action={
        <Button icon={<FilterRegular />} appearance="subtle" onClick={() => setAdvancedOpen((v) => !v)}>
          Lọc mở rộng
        </Button>
      }
    >
      <Field label="Tìm học sinh">
        <SearchInput value={draft.q} onChange={(value) => setDraft({ q: value })} placeholder="Tên hoặc mã học sinh" />
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

      <Field label="Kỳ">
        <Dropdown
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

      <Field label="Trạng thái hoá đơn">
        <Dropdown
          value={draft.trangThai === TAT_CA ? 'Tất cả trạng thái' : draft.trangThai}
          selectedOptions={[draft.trangThai]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ trangThai: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả trạng thái</Option>
          {TRANG_THAI_LIST.map((tt) => (
            <Option key={tt} value={tt}>
              {tt}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Hình thức thanh toán">
        <Dropdown
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

      {advancedOpen && (
        <>
          <Field label="Hạn thanh toán từ ngày">
            <Input type="date" value={draft.hanTu} onChange={(_, data) => setDraft({ hanTu: data.value })} />
          </Field>
          <Field label="đến ngày">
            <Input type="date" value={draft.hanDen} onChange={(_, data) => setDraft({ hanDen: data.value })} />
          </Field>
        </>
      )}
    </FilterBar>
  )
}
