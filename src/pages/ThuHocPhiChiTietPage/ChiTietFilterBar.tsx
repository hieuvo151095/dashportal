import { Button, Dropdown, Field, Input, Option } from '@fluentui/react-components'
import { FilterRegular } from '@fluentui/react-icons'
import { useState } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { SearchInput } from '../../components/SearchInput'
import { HINH_THUC_THANH_TOAN_LIST, NIEN_KHOA, type TrangThaiHoaDon } from '../../mock-data'
import { getKyOptions } from '../../utils/ky'
import type { ChiTietFiltersApi } from './useChiTietFilters'

const KY_OPTIONS = [...getKyOptions(), NIEN_KHOA]
const TRANG_THAI_LIST: TrangThaiHoaDon[] = ['Đã gửi', 'Thanh toán một phần', 'Đã thanh toán']
const TAT_CA = 'all'

interface ChiTietFilterBarProps {
  filters: ChiTietFiltersApi
  lopOptions: string[]
}

export function ChiTietFilterBar({ filters, lopOptions }: ChiTietFilterBarProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  return (
    <>
      <FilterBar
        action={
          <Button icon={<FilterRegular />} appearance="subtle" onClick={() => setAdvancedOpen((v) => !v)}>
            Lọc mở rộng
          </Button>
        }
      >
        <Field label="Tìm học sinh">
          <SearchInput value={filters.q} onChange={filters.setQ} placeholder="Tên hoặc mã học sinh" />
        </Field>

        <Field label="Lớp">
          <Dropdown
            value={filters.lop === TAT_CA ? 'Tất cả lớp' : filters.lop}
            selectedOptions={[filters.lop]}
            onOptionSelect={(_, data) => data.optionValue && filters.setLop(data.optionValue)}
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
            value={filters.ky === TAT_CA ? 'Tất cả các kỳ' : filters.ky}
            selectedOptions={[filters.ky]}
            onOptionSelect={(_, data) => data.optionValue && filters.setKy(data.optionValue)}
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
            value={filters.trangThai === TAT_CA ? 'Tất cả trạng thái' : filters.trangThai}
            selectedOptions={[filters.trangThai]}
            onOptionSelect={(_, data) => data.optionValue && filters.setTrangThai(data.optionValue)}
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
            value={filters.hinhThucThanhToan === TAT_CA ? 'Tất cả hình thức' : filters.hinhThucThanhToan}
            selectedOptions={[filters.hinhThucThanhToan]}
            onOptionSelect={(_, data) => data.optionValue && filters.setHinhThucThanhToan(data.optionValue)}
          >
            <Option value={TAT_CA}>Tất cả hình thức</Option>
            {HINH_THUC_THANH_TOAN_LIST.map((ht) => (
              <Option key={ht} value={ht}>
                {ht}
              </Option>
            ))}
          </Dropdown>
        </Field>
      </FilterBar>

      {advancedOpen && (
        <FilterBar>
          <Field label="Hạn thanh toán từ ngày">
            <Input type="date" value={filters.hanTu} onChange={(_, data) => filters.setHanTu(data.value)} />
          </Field>
          <Field label="đến ngày">
            <Input type="date" value={filters.hanDen} onChange={(_, data) => filters.setHanDen(data.value)} />
          </Field>
        </FilterBar>
      )}
    </>
  )
}
