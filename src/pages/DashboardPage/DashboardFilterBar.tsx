import { Button, Caption1, Dropdown, Field, Option } from '@fluentui/react-components'
import { ArrowDownloadRegular } from '@fluentui/react-icons'
import { useState } from 'react'
import { CAP_HOC_LIST, mockDataset, type CapHoc } from '../../mock-data'
import { FilterBar } from '../../components/FilterBar'
import { SearchableCombobox } from '../../components/SearchableCombobox'
import { getKyOptions } from './useDashboardFilters'
import type { DashboardFilters } from './useDashboardFilters'

const KY_OPTIONS = getKyOptions()
const TOAN_THANH_PHO = 'all'
const gioFormatter = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' })

interface DashboardFilterBarProps {
  draft: DashboardFilters
  setDraft: (patch: Partial<DashboardFilters>) => void
  onApply: () => void
  onReset: () => void
}

export function DashboardFilterBar({ draft, setDraft, onApply, onReset }: DashboardFilterBarProps) {
  // Giờ lúc trang được tải — chỉ tính 1 lần lúc mount, không cập nhật lại khi Áp dụng/Làm mới.
  const [gioCapNhat] = useState(() => gioFormatter.format(new Date()))
  const { phuongXaList } = mockDataset
  const phuongXaOptions = [
    { value: TOAN_THANH_PHO, label: 'Toàn thành phố' },
    ...phuongXaList.map((px) => ({ value: px.id, label: px.ten })),
  ]

  const capHocLabel =
    draft.capHocList.length === CAP_HOC_LIST.length ? 'Tất cả cấp học' : draft.capHocList.join(', ')

  return (
    <FilterBar
      onApply={onApply}
      onReset={onReset}
      action={
        <>
          <Caption1>{`Cập nhật lúc: ${gioCapNhat}`}</Caption1>
          <Button icon={<ArrowDownloadRegular />} onClick={() => {}}>
            Xuất báo cáo
          </Button>
        </>
      }
    >
      <Field label="Kỳ báo cáo">
        <Dropdown
          value={draft.ky}
          selectedOptions={[draft.ky]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ ky: data.optionValue })}
        >
          {KY_OPTIONS.map((ky) => (
            <Option key={ky} value={ky}>
              {ky}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Xã/Phường">
        <SearchableCombobox
          options={phuongXaOptions}
          value={draft.phuongXaId}
          onChange={(value) => setDraft({ phuongXaId: value })}
          placeholder="Tìm Xã/Phường"
        />
      </Field>

      <Field label="Cấp học">
        <Dropdown
          multiselect
          value={capHocLabel}
          selectedOptions={draft.capHocList}
          onOptionSelect={(_, data) => setDraft({ capHocList: data.selectedOptions as CapHoc[] })}
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
