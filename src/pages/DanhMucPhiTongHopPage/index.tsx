import { PageTitle } from '../../components/PageTitle'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { TongHopFilterBar } from './TongHopFilterBar'
import { TongHopTable } from './TongHopTable'
import { useTongHopData } from './useTongHopData'
import { useTongHopFilters, type TongHopFilters } from './useTongHopFilters'

export function DanhMucPhiTongHopPage() {
  const filters = useTongHopFilters()
  const [draft, setDraft] = useFilterDraft<TongHopFilters>({
    phuongXaIds: filters.phuongXaIds,
    truongIds: filters.truongIds,
    nienKhoa: filters.nienKhoa,
    nhomPhi: filters.nhomPhi,
    nguonThu: filters.nguonThu,
    q: filters.q,
  })
  const { rows } = useTongHopData(filters)
  const loading = useSkeletonDelay([
    filters.phuongXaIds,
    filters.truongIds,
    filters.nienKhoa,
    filters.nhomPhi,
    filters.nguonThu,
    filters.q,
  ])

  return (
    <div>
      <PageTitle title="Danh mục Phí — Tổng hợp toàn thành phố" showUnit={false} />

      <TongHopFilterBar draft={draft} setDraft={setDraft} onApply={() => filters.apply(draft)} onReset={filters.reset} />

      <SectionCard title="Danh sách trường">
        {loading ? <TableSkeleton rows={8} /> : <TongHopTable rows={rows} filters={filters} />}
      </SectionCard>
    </div>
  )
}
