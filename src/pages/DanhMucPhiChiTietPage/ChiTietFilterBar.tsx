import { Button, Dropdown, Field, Option } from '@fluentui/react-components'
import { ArrowDownloadRegular } from '@fluentui/react-icons'
import { FilterBar } from '../../components/FilterBar'
import { SearchInput } from '../../components/SearchInput'
import { NGUON_THU_LIST, NHOM_PHI_LIST, NIEN_KHOA_LIST } from '../../mock-data'
import type { ChiTietFilters } from './useChiTietFilters'

const TAT_CA = 'all'

interface ChiTietFilterBarProps {
  draft: ChiTietFilters
  setDraft: (patch: Partial<ChiTietFilters>) => void
  onApply: () => void
  onReset: () => void
}

export function ChiTietFilterBar({ draft, setDraft, onApply, onReset }: ChiTietFilterBarProps) {
  return (
    <FilterBar
      onApply={onApply}
      onReset={onReset}
      action={
        <Button icon={<ArrowDownloadRegular />} onClick={() => {}}>
          Xuất Excel
        </Button>
      }
    >
      <Field label="Tìm kiếm">
        <SearchInput value={draft.q} onChange={(value) => setDraft({ q: value })} placeholder="Tìm theo mã và tên phí" />
      </Field>

      <Field label="Nguồn thu">
        <Dropdown
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          value={draft.nguonThu === TAT_CA ? 'Tất cả nguồn thu' : draft.nguonThu}
          selectedOptions={[draft.nguonThu]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ nguonThu: data.optionValue })}
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
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          value={draft.nhomPhi === TAT_CA ? 'Tất cả nhóm phí' : draft.nhomPhi}
          selectedOptions={[draft.nhomPhi]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ nhomPhi: data.optionValue })}
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
          positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
          value={draft.nienKhoa}
          selectedOptions={[draft.nienKhoa]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ nienKhoa: data.optionValue })}
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
