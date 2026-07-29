import { Button, Combobox, Dropdown, Field, Option } from '@fluentui/react-components'
import { ArrowDownloadRegular } from '@fluentui/react-icons'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { CAP_HOC_LIST, HE_THONG_DOI_TAC_LIST, HINH_THUC_THANH_TOAN_LIST, mockDataset, type CapHoc } from '../../mock-data'
import { getKyOptions } from '../../utils/ky'
import type { TongHopFilters, TrangThaiTongHop } from './useTongHopFilters'

const KY_OPTIONS = getKyOptions()
const TOAN_THANH_PHO = 'all'
const TAT_CA = 'all'
const TRANG_THAI_LIST: TrangThaiTongHop[] = ['Đã thanh toán', 'Thanh toán một phần', 'Chưa thanh toán']

interface TongHopFilterBarProps {
  draft: TongHopFilters
  setDraft: (patch: Partial<TongHopFilters>) => void
  onApply: () => void
  onReset: () => void
}

export function TongHopFilterBar({ draft, setDraft, onApply, onReset }: TongHopFilterBarProps) {
  const { phuongXaList, truongList } = mockDataset

  const truongOptions = useMemo(
    () => truongList.filter((t) => draft.phuongXaId === TOAN_THANH_PHO || t.phuongXaId === draft.phuongXaId),
    [truongList, draft.phuongXaId],
  )

  const phuongXaLabel =
    draft.phuongXaId === TOAN_THANH_PHO
      ? 'Toàn thành phố'
      : (phuongXaList.find((p) => p.id === draft.phuongXaId)?.ten ?? 'Toàn thành phố')

  const truongLabel =
    draft.truongId === TAT_CA
      ? 'Tất cả trường'
      : (truongList.find((t) => t.id === draft.truongId)?.tenTruong ?? 'Tất cả trường')

  const capHocLabel =
    draft.capHocList.length === CAP_HOC_LIST.length ? 'Tất cả cấp học' : draft.capHocList.join(', ')

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
        <Combobox
          value={phuongXaLabel}
          selectedOptions={[draft.phuongXaId]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ phuongXaId: data.optionValue, truongId: TAT_CA })}
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
          selectedOptions={[draft.truongId]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ truongId: data.optionValue })}
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
          value={draft.hinhThucThanhToan === TAT_CA ? 'Tất cả hình thức' : draft.hinhThucThanhToan}
          selectedOptions={[draft.hinhThucThanhToan]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ hinhThucThanhToan: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả hình thức</Option>
          {HINH_THUC_THANH_TOAN_LIST.map((ht) => (
            <Option key={ht} value={ht}>
              {ht}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Hệ thống">
        <Dropdown
          value={draft.heThong === TAT_CA ? 'Tất cả hệ thống' : draft.heThong}
          selectedOptions={[draft.heThong]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ heThong: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả hệ thống</Option>
          {HE_THONG_DOI_TAC_LIST.map((ht) => (
            <Option key={ht} value={ht}>
              {ht}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Trạng thái">
        <Dropdown
          value={draft.trangThai === TAT_CA ? 'Tất cả trạng thái' : draft.trangThai}
          selectedOptions={[draft.trangThai]}
          onOptionSelect={(_, data) => data.optionValue && setDraft({ trangThai: data.optionValue })}
        >
          <Option value={TAT_CA}>Tất cả trạng thái</Option>
          {TRANG_THAI_LIST.map((tt) => (
            <Option key={tt} value={tt}>
              {tt}
            </Option>
          ))}
        </Dropdown>
      </Field>
    </FilterBar>
  )
}
