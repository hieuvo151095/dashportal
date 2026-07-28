import { Button, Combobox, Dropdown, Field, Option } from '@fluentui/react-components'
import { ArrowDownloadRegular } from '@fluentui/react-icons'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { CAP_HOC_LIST, HINH_THUC_THANH_TOAN_LIST, mockDataset, type CapHoc } from '../../mock-data'
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
  )
}
