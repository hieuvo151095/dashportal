import { PageTitle } from '../../components/PageTitle'
import { SchoolHeader } from '../../components/SchoolHeader'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { ChiTietFilterBar } from './ChiTietFilterBar'
import { ChiTietTable } from './ChiTietTable'
import { useChiTietData } from './useChiTietData'
import { useChiTietFilters, type ChiTietFilters } from './useChiTietFilters'

export function DanhMucPhiChiTietPage() {
  const filters = useChiTietFilters()
  const [draft, setDraft] = useFilterDraft<ChiTietFilters>({
    q: filters.q,
    nguonThu: filters.nguonThu,
    nhomPhi: filters.nhomPhi,
    nienKhoa: filters.nienKhoa,
  })
  const data = useChiTietData(filters)
  const loading = useSkeletonDelay([
    filters.truongId,
    filters.q,
    filters.nguonThu,
    filters.nhomPhi,
    filters.nienKhoa,
  ])

  return (
    <div>
      <PageTitle title="Danh mục Phí — Chi tiết theo trường" />
      <SchoolHeader
        truong={data.truong}
        phuongXa={data.phuongXa}
        truongId={filters.truongId}
        onSelectTruong={filters.setTruongId}
      />

      <ChiTietFilterBar draft={draft} setDraft={setDraft} onApply={() => filters.apply(draft)} onReset={filters.reset} />

      <SectionCard title="Danh sách khoản phí">
        {loading ? <TableSkeleton rows={6} /> : <ChiTietTable rows={data.rows} />}
      </SectionCard>
    </div>
  )
}
