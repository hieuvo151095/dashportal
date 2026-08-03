import { Button, Dropdown, Field, Option } from '@fluentui/react-components'
import { ArrowDownloadRegular } from '@fluentui/react-icons'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { SearchInput } from '../../components/SearchInput'
import { SearchableMultiCombobox } from '../../components/SearchableMultiCombobox'
import { CAP_HOC_LIST, HE_THONG_DOI_TAC_LIST, HINH_THUC_THANH_TOAN_LIST, mockDataset, type CapHoc } from '../../mock-data'
import { getKyOptions } from '../../utils/ky'
import { ALL_OPTION_VALUE, resolveMultiSelectChange, withAllOptionSelected } from '../../utils/multiSelectAll'
import { TRANG_THAI_TONG_HOP_LIST, type TongHopFilters } from './useTongHopFilters'

const KY_OPTIONS = getKyOptions()

interface TongHopFilterBarProps {
  draft: TongHopFilters
  setDraft: (patch: Partial<TongHopFilters>) => void
  onApply: () => void
  onReset: () => void
}

export function TongHopFilterBar({ draft, setDraft, onApply, onReset }: TongHopFilterBarProps) {
  const { phuongXaList, truongList } = mockDataset

  const truongOptions = useMemo(
    () => truongList.filter((t) => draft.phuongXaIds.length === 0 || draft.phuongXaIds.includes(t.phuongXaId)),
    [truongList, draft.phuongXaIds],
  )

  const capHocLabel =
    draft.capHocList.length === CAP_HOC_LIST.length ? 'Tất cả cấp học' : draft.capHocList.join(', ')
  const hinhThucLabel =
    draft.hinhThucThanhToanList.length === HINH_THUC_THANH_TOAN_LIST.length
      ? 'Tất cả hình thức'
      : draft.hinhThucThanhToanList.join(', ')
  const heThongLabel =
    draft.heThongList.length === HE_THONG_DOI_TAC_LIST.length ? 'Tất cả hệ thống' : draft.heThongList.join(', ')
  const trangThaiLabel =
    draft.trangThaiList.length === TRANG_THAI_TONG_HOP_LIST.length
      ? 'Tất cả trạng thái'
      : draft.trangThaiList.join(', ')

  // Đổi Xã/Phường (multi) → bỏ khỏi Trường đã chọn những trường không còn thuộc phạm vi mới —
  // atomic trong 1 lần setDraft.
  function handlePhuongXaChange(values: string[]) {
    const scopedTruongIds = new Set(
      truongList.filter((t) => values.length === 0 || values.includes(t.phuongXaId)).map((t) => t.id),
    )
    setDraft({
      phuongXaIds: values,
      truongIds: draft.truongIds.filter((id) => scopedTruongIds.has(id)),
    })
  }

  return (
    <FilterBar
      onApply={onApply}
      onReset={onReset}
      action={
        <Button icon={<ArrowDownloadRegular />} onClick={() => {}}>
          Xuất báo cáo
        </Button>
      }
    >
      <Field label="Tìm kiếm">
        <SearchInput value={draft.q} onChange={(value) => setDraft({ q: value })} placeholder="Tìm theo mã và tên trường" />
      </Field>

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
        <SearchableMultiCombobox
          options={phuongXaList.map((px) => ({ value: px.id, label: px.ten }))}
          selected={draft.phuongXaIds}
          onChange={handlePhuongXaChange}
          placeholder="Tìm Xã/Phường"
          allLabel="Toàn thành phố"
        />
      </Field>

      <Field label="Trường">
        <SearchableMultiCombobox
          options={truongOptions.map((t) => ({ value: t.id, label: t.tenTruong }))}
          selected={draft.truongIds}
          onChange={(values) => setDraft({ truongIds: values })}
          placeholder="Tìm trường"
          allLabel="Tất cả trường"
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

      <Field label="Hình thức thanh toán">
        <Dropdown
          multiselect
          value={hinhThucLabel}
          selectedOptions={withAllOptionSelected(HINH_THUC_THANH_TOAN_LIST, draft.hinhThucThanhToanList)}
          onOptionSelect={(_, data) =>
            setDraft({
              hinhThucThanhToanList: resolveMultiSelectChange(HINH_THUC_THANH_TOAN_LIST, data),
            })
          }
        >
          <Option value={ALL_OPTION_VALUE}>Tất cả</Option>
          {HINH_THUC_THANH_TOAN_LIST.map((ht) => (
            <Option key={ht} value={ht}>
              {ht}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Hệ thống">
        <Dropdown
          multiselect
          value={heThongLabel}
          selectedOptions={withAllOptionSelected(HE_THONG_DOI_TAC_LIST, draft.heThongList)}
          onOptionSelect={(_, data) => setDraft({ heThongList: resolveMultiSelectChange(HE_THONG_DOI_TAC_LIST, data) })}
        >
          <Option value={ALL_OPTION_VALUE}>Tất cả</Option>
          {HE_THONG_DOI_TAC_LIST.map((ht) => (
            <Option key={ht} value={ht}>
              {ht}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Trạng thái">
        <Dropdown
          multiselect
          value={trangThaiLabel}
          selectedOptions={withAllOptionSelected(TRANG_THAI_TONG_HOP_LIST, draft.trangThaiList)}
          onOptionSelect={(_, data) =>
            setDraft({ trangThaiList: resolveMultiSelectChange(TRANG_THAI_TONG_HOP_LIST, data) })
          }
        >
          <Option value={ALL_OPTION_VALUE}>Tất cả</Option>
          {TRANG_THAI_TONG_HOP_LIST.map((tt) => (
            <Option key={tt} value={tt}>
              {tt}
            </Option>
          ))}
        </Dropdown>
      </Field>
    </FilterBar>
  )
}
