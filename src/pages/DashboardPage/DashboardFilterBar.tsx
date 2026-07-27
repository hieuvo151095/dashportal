import { Button, Combobox, Dropdown, Field, Option } from '@fluentui/react-components'
import { ArrowDownloadRegular } from '@fluentui/react-icons'
import { CAP_HOC_LIST, mockDataset, type CapHoc } from '../../mock-data'
import { FilterBar } from '../../components/FilterBar'
import { getKyOptions, type DashboardFiltersApi } from './useDashboardFilters'

const KY_OPTIONS = getKyOptions()
const TOAN_THANH_PHO = 'all'

interface DashboardFilterBarProps {
  filters: DashboardFiltersApi
}

export function DashboardFilterBar({ filters }: DashboardFilterBarProps) {
  const { phuongXaList } = mockDataset
  const phuongXaLabel =
    filters.phuongXaId === TOAN_THANH_PHO
      ? 'Toàn thành phố'
      : (phuongXaList.find((p) => p.id === filters.phuongXaId)?.ten ?? 'Toàn thành phố')

  const capHocLabel =
    filters.capHocList.length === CAP_HOC_LIST.length ? 'Tất cả cấp học' : filters.capHocList.join(', ')

  return (
    <FilterBar
      action={
        <Button icon={<ArrowDownloadRegular />} onClick={() => {}}>
          Xuất báo cáo
        </Button>
      }
    >
      <Field label="Kỳ báo cáo">
        <Dropdown
          value={filters.ky}
          selectedOptions={[filters.ky]}
          onOptionSelect={(_, data) => data.optionValue && filters.setKy(data.optionValue)}
        >
          {KY_OPTIONS.map((ky) => (
            <Option key={ky} value={ky}>
              {ky}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Xã/Phường">
        <Combobox
          value={phuongXaLabel}
          selectedOptions={[filters.phuongXaId]}
          onOptionSelect={(_, data) => data.optionValue && filters.setPhuongXaId(data.optionValue)}
        >
          <Option value={TOAN_THANH_PHO}>Toàn thành phố</Option>
          {phuongXaList.map((px) => (
            <Option key={px.id} value={px.id}>
              {px.ten}
            </Option>
          ))}
        </Combobox>
      </Field>

      <Field label="Cấp học">
        <Dropdown
          multiselect
          value={capHocLabel}
          selectedOptions={filters.capHocList}
          onOptionSelect={(_, data) => filters.setCapHocList(data.selectedOptions as CapHoc[])}
        >
          {CAP_HOC_LIST.map((capHoc) => (
            <Option key={capHoc} value={capHoc}>
              {capHoc}
            </Option>
          ))}
        </Dropdown>
      </Field>
    </FilterBar>
  )
}
