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

export function CongNoChiTietPage() {
  const filters = useChiTietFilters()
  const [draft, setDraft] = useFilterDraft<ChiTietFilters>({
    q: filters.q,
    khoiList: filters.khoiList,
    lopList: filters.lopList,
    kyTu: filters.kyTu,
    kyDen: filters.kyDen,
    hanTu: filters.hanTu,
    hanDen: filters.hanDen,
    nhomTuoiNo: filters.nhomTuoiNo,
  })
  const data = useChiTietData(filters)
  const loading = useSkeletonDelay([
    filters.truongId,
    filters.q,
    filters.khoiList,
    filters.lopList,
    filters.kyTu,
    filters.kyDen,
    filters.hanTu,
    filters.hanDen,
    filters.nhomTuoiNo,
  ])

  return (
    <div>
      <PageTitle title="Công nợ Học phí — Chi tiết theo trường" />
      <SchoolHeader
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
        lopOptionsTheoKhoi={data.lopOptionsTheoKhoi}
      />

      <SectionCard title="Danh sách công nợ">
        {loading ? <TableSkeleton rows={8} /> : <ChiTietTable rows={data.rows} filters={filters} />}
      </SectionCard>
    </div>
  )
}
