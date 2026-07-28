import { Combobox, Dropdown, Field, Option } from '@fluentui/react-components'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { SearchInput } from '../../components/SearchInput'
import { NGUON_THU_LIST, NHOM_PHI_LIST, NIEN_KHOA_LIST, mockDataset } from '../../mock-data'
import type { TongHopFiltersApi } from './useTongHopFilters'

const TOAN_THANH_PHO = 'all'
const TAT_CA = 'all'

interface TongHopFilterBarProps {
  filters: TongHopFiltersApi
}

export function TongHopFilterBar({ filters }: TongHopFilterBarProps) {
  const { phuongXaList, truongList } = mockDataset

  const truongOptions = useMemo(
    () =>
      truongList.filter(
        (t) => filters.phuongXaId === TOAN_THANH_PHO || t.phuongXaId === filters.phuongXaId,
      ),
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

      <Field label="Tìm kiếm">
        <SearchInput value={filters.q} onChange={filters.setQ} placeholder="Tên hoặc mã trường" />
      </Field>
    </FilterBar>
  )
}
