import { PageTitle } from '../../components/PageTitle'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { TongHopFilterBar } from './TongHopFilterBar'
import { TongHopTable } from './TongHopTable'
import { useTongHopData } from './useTongHopData'
import { useTongHopFilters } from './useTongHopFilters'

export function DanhMucPhiTongHopPage() {
  const filters = useTongHopFilters()
  const { rows } = useTongHopData(filters)
  const loading = useSkeletonDelay([
    filters.phuongXaId,
    filters.truongId,
    filters.nienKhoa,
    filters.nhomPhi,
    filters.nguonThu,
    filters.q,
  ])

  return (
    <div>
      <PageTitle title="Danh mục Phí — Tổng hợp toàn thành phố" />

      <TongHopFilterBar filters={filters} />

      <SectionCard title="Danh sách trường">
        {loading ? <TableSkeleton rows={8} /> : <TongHopTable rows={rows} filters={filters} />}
      </SectionCard>
    </div>
  )
}
