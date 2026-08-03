import { Caption1, tokens } from '@fluentui/react-components'
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
    ngayTtTu: filters.ngayTtTu,
    ngayTtDen: filters.ngayTtDen,
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
    filters.ngayTtTu,
    filters.ngayTtDen,
  ])

  return (
    <div>
      <PageTitle title="Thu Học phí — Chi tiết theo trường" showUnit={false} />
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
        lopOptions={data.lopOptions}
      />

      <SectionCard
        title="Danh sách hoá đơn"
        action={<Caption1 style={{ color: tokens.colorNeutralForeground3 }}>Đơn vị: Đồng</Caption1>}
      >
        {loading ? <TableSkeleton rows={8} /> : <ChiTietTable rows={data.rows} filters={filters} />}
      </SectionCard>
    </div>
  )
}
