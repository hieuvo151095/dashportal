import { SchoolHeader } from '../../components/SchoolHeader'
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
    tenPhi: filters.tenPhi,
    maPhi: filters.maPhi,
    nguonThu: filters.nguonThu,
    nhomPhi: filters.nhomPhi,
    nienKhoa: filters.nienKhoa,
  })
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
      <SchoolHeader
        title="Danh mục Phí — Chi tiết theo trường"
        truong={data.truong}
        phuongXa={data.phuongXa}
        truongId={filters.truongId}
        onSelectTruong={filters.setTruongId}
      />

      <ChiTietFilterBar draft={draft} setDraft={setDraft} onApply={() => filters.apply(draft)} onReset={filters.reset} />

      {loading ? <TableSkeleton rows={6} /> : <ChiTietTable rows={data.rows} />}
    </div>
  )
}
