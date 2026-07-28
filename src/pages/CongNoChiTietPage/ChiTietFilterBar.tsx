import { Dropdown, Field, Input, Option } from '@fluentui/react-components'
import { SearchRegular } from '@fluentui/react-icons'
import { FilterBar } from '../../components/FilterBar'
import { NHOM_TUOI_NO_LIST } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import type { ChiTietFiltersApi } from './useChiTietFilters'

const KY_OPTIONS = getKyOptions()
const TAT_CA = 'all'

interface ChiTietFilterBarProps {
  filters: ChiTietFiltersApi
  khoiOptions: string[]
  lopOptions: string[]
}

export function ChiTietFilterBar({ filters, khoiOptions, lopOptions }: ChiTietFilterBarProps) {
  return (
    <FilterBar>
      <Field label="Mã học sinh">
        <Input
          contentBefore={<SearchRegular />}
          value={filters.maHocSinh}
          placeholder="Tìm theo mã học sinh"
          onChange={(_, data) => filters.setMaHocSinh(data.value)}
        />
      </Field>

      <Field label="Khối">
        <Dropdown
          value={filters.khoi === TAT_CA ? 'Tất cả khối' : filters.khoi}
          selectedOptions={[filters.khoi]}
          onOptionSelect={(_, data) => data.optionValue && filters.setKhoi(data.optionValue)}
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

      <Field label="Kỳ phí từ">
        <Dropdown
          value={filters.kyTu}
          selectedOptions={[filters.kyTu]}
          onOptionSelect={(_, data) => data.optionValue && filters.setKyTu(data.optionValue)}
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
          value={filters.kyDen}
          selectedOptions={[filters.kyDen]}
          onOptionSelect={(_, data) => data.optionValue && filters.setKyDen(data.optionValue)}
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
          value={filters.nhomTuoiNo === TAT_CA ? 'Tất cả nhóm' : filters.nhomTuoiNo}
          selectedOptions={[filters.nhomTuoiNo]}
          onOptionSelect={(_, data) => data.optionValue && filters.setNhomTuoiNo(data.optionValue)}
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
