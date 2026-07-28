import { SchoolHeader } from '../../components/SchoolHeader'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { ChiTietFilterBar } from './ChiTietFilterBar'
import { ChiTietTable } from './ChiTietTable'
import { useChiTietData } from './useChiTietData'
import { useChiTietFilters, type ChiTietFilters } from './useChiTietFilters'

export function ThuHocPhiChiTietPage() {
  const filters = useChiTietFilters()
  const [draft, setDraft] = useFilterDraft<ChiTietFilters>({
    q: filters.q,
    lop: filters.lop,
    ky: filters.ky,
    trangThai: filters.trangThai,
    hinhThucThanhToan: filters.hinhThucThanhToan,
    hanTu: filters.hanTu,
    hanDen: filters.hanDen,
  })
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

      <ChiTietFilterBar
        draft={draft}
        setDraft={setDraft}
        onApply={() => filters.apply(draft)}
        onReset={filters.reset}
        lopOptions={data.lopOptions}
      />

      {loading ? <TableSkeleton rows={8} /> : <ChiTietTable rows={data.rows} />}
    </div>
  )
}
