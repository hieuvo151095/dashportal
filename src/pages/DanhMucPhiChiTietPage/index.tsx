import { TableSkeleton } from '../../components/TableSkeleton'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { ChiTietFilterBar } from './ChiTietFilterBar'
import { ChiTietHeader } from './ChiTietHeader'
import { ChiTietTable } from './ChiTietTable'
import { useChiTietData } from './useChiTietData'
import { useChiTietFilters } from './useChiTietFilters'

export function DanhMucPhiChiTietPage() {
  const filters = useChiTietFilters()
  const data = useChiTietData(filters)
  const loading = useSkeletonDelay([
    filters.truongId,
    filters.tenPhi,
    filters.maPhi,
    filters.nguonThu,
    filters.nhomPhi,
    filters.nienKhoa,
  ])

  return (
    <div>
      <ChiTietHeader data={data} filters={filters} />

      <ChiTietFilterBar filters={filters} />

      {loading ? <TableSkeleton rows={6} /> : <ChiTietTable rows={data.rows} />}
    </div>
  )
}
