import { Button, Dropdown, Field, Input, Option } from '@fluentui/react-components'
import { ArrowDownloadRegular, AddRegular, SearchRegular } from '@fluentui/react-icons'
import { FilterBar } from '../../components/FilterBar'
import { NGUON_THU_LIST, NHOM_PHI_LIST, NIEN_KHOA_LIST } from '../../mock-data'
import type { ChiTietFiltersApi } from './useChiTietFilters'

const TAT_CA = 'all'

interface ChiTietFilterBarProps {
  filters: ChiTietFiltersApi
}

export function ChiTietFilterBar({ filters }: ChiTietFilterBarProps) {
  return (
    <FilterBar
      action={
        <>
          <Button icon={<AddRegular />} onClick={() => {}}>
            Thêm khoản phí
          </Button>
          <Button icon={<ArrowDownloadRegular />} onClick={() => {}}>
            Xuất Excel
          </Button>
        </>
      }
    >
      <Field label="Tên phí">
        <Input
          contentBefore={<SearchRegular />}
          value={filters.tenPhi}
          placeholder="Tìm theo tên phí"
          onChange={(_, data) => filters.setTenPhi(data.value)}
        />
      </Field>

      <Field label="Mã phí">
        <Input
          contentBefore={<SearchRegular />}
          value={filters.maPhi}
          placeholder="Tìm theo mã phí"
          onChange={(_, data) => filters.setMaPhi(data.value)}
        />
      </Field>

      <Field label="Nguồn thu">
        <Dropdown
          value={filters.nguonThu === TAT_CA ? 'Tất cả nguồn thu' : filters.nguonThu}
          selectedOptions={[filters.nguonThu]}
          onOptionSelect={(_, data) => data.optionValue && filters.setNguonThu(data.optionValue)}
        >
          <Option value={TAT_CA}>Tất cả nguồn thu</Option>
          {NGUON_THU_LIST.map((nguon) => (
            <Option key={nguon} value={nguon}>
              {nguon}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Nhóm phí">
        <Dropdown
          value={filters.nhomPhi === TAT_CA ? 'Tất cả nhóm phí' : filters.nhomPhi}
          selectedOptions={[filters.nhomPhi]}
          onOptionSelect={(_, data) => data.optionValue && filters.setNhomPhi(data.optionValue)}
        >
          <Option value={TAT_CA}>Tất cả nhóm phí</Option>
          {NHOM_PHI_LIST.map((nhom) => (
            <Option key={nhom} value={nhom}>
              {nhom}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Niên khoá">
        <Dropdown
          value={filters.nienKhoa}
          selectedOptions={[filters.nienKhoa]}
          onOptionSelect={(_, data) => data.optionValue && filters.setNienKhoa(data.optionValue)}
        >
          {NIEN_KHOA_LIST.map((nk) => (
            <Option key={nk} value={nk}>
              {nk}
            </Option>
          ))}
        </Dropdown>
      </Field>
    </FilterBar>
  )
}
