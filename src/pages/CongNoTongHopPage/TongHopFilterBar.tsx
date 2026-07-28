import { Combobox, Dropdown, Field, Option } from '@fluentui/react-components'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { mockDataset } from '../../mock-data'
import { NHOM_TUOI_NO_LIST } from '../../utils/congNo'
import { getKyOptions } from '../../utils/ky'
import type { TongHopFiltersApi } from './useTongHopFilters'

const KY_OPTIONS = getKyOptions()
const TOAN_THANH_PHO = 'all'
const TAT_CA = 'all'

interface TongHopFilterBarProps {
  filters: TongHopFiltersApi
}

export function TongHopFilterBar({ filters }: TongHopFilterBarProps) {
  const { phuongXaList, truongList } = mockDataset

  const truongOptions = useMemo(
    () =>
      truongList.filter((t) => filters.phuongXaId === TOAN_THANH_PHO || t.phuongXaId === filters.phuongXaId),
    [truongList, filters.phuongXaId],
  )

  const phuongXaLabel =
    filters.phuongXaId === TOAN_THANH_PHO
      ? 'Toàn thành phố'
      : (phuongXaList.find((p) => p.id === filters.phuongXaId)?.ten ?? 'Toàn thành phố')

  const truongLabel =
    filters.truongId === TAT_CA
      ? 'Tất cả trường'
      : (truongList.find((t) => t.id === filters.truongId)?.tenTruong ?? 'Tất cả trường')

  return (
    <FilterBar>
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

      <Field label="Trường">
        <Combobox
          value={truongLabel}
          selectedOptions={[filters.truongId]}
          onOptionSelect={(_, data) => data.optionValue && filters.setTruongId(data.optionValue)}
        >
          <Option value={TAT_CA}>Tất cả trường</Option>
          {truongOptions.map((t) => (
            <Option key={t.id} value={t.id}>
              {t.tenTruong}
            </Option>
          ))}
        </Combobox>
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
