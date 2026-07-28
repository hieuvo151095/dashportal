import { SchoolHeader } from '../../components/SchoolHeader'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { ChiTietFilterBar } from './ChiTietFilterBar'
import { ChiTietTable } from './ChiTietTable'
import { useChiTietData } from './useChiTietData'
import { useChiTietFilters, type ChiTietFilters } from './useChiTietFilters'

export function CongNoChiTietPage() {
  const filters = useChiTietFilters()
  const [draft, setDraft] = useFilterDraft<ChiTietFilters>({
    maHocSinh: filters.maHocSinh,
    khoi: filters.khoi,
    lop: filters.lop,
    kyTu: filters.kyTu,
    kyDen: filters.kyDen,
    nhomTuoiNo: filters.nhomTuoiNo,
  })
  const data = useChiTietData(filters)
  const loading = useSkeletonDelay([
    filters.truongId,
    filters.maHocSinh,
    filters.khoi,
    filters.lop,
    filters.kyTu,
    filters.kyDen,
    filters.nhomTuoiNo,
  ])

  return (
    <div>
      <SchoolHeader
        title="Công nợ Học phí — Chi tiết theo trường"
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
        khoiOptions={data.khoiOptions}
        lopOptions={data.lopOptions}
      />

      {loading ? <TableSkeleton rows={8} /> : <ChiTietTable rows={data.rows} />}
    </div>
  )
}
