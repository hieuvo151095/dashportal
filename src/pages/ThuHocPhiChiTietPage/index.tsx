import { SchoolHeader } from '../../components/SchoolHeader'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { ChiTietFilterBar } from './ChiTietFilterBar'
import { ChiTietTable } from './ChiTietTable'
import { useChiTietData } from './useChiTietData'
import { useChiTietFilters } from './useChiTietFilters'

export function ThuHocPhiChiTietPage() {
  const filters = useChiTietFilters()
  const data = useChiTietData(filters)
  const loading = useSkeletonDelay([
    filters.truongId,
    filters.q,
    filters.lop,
    filters.ky,
    filters.trangThai,
    filters.hinhThucThanhToan,
    filters.hanTu,
    filters.hanDen,
  ])

  return (
    <div>
      <SchoolHeader
        title="Thu Học phí — Chi tiết theo trường"
        truong={data.truong}
        phuongXa={data.phuongXa}
        truongId={filters.truongId}
        onSelectTruong={filters.setTruongId}
      />

      <ChiTietFilterBar filters={filters} lopOptions={data.lopOptions} />

      {loading ? <TableSkeleton rows={8} /> : <ChiTietTable rows={data.rows} />}
    </div>
  )
}
