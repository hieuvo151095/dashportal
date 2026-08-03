import { PageTitle } from '../../components/PageTitle'
import { SchoolHeader } from '../../components/SchoolHeader'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { exportToExcel } from '../../utils/exportExcel'
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

  function handleExport() {
    const rows = data.rows.map((k, index) => ({
      STT: index + 1,
      'Mã Phí': k.maPhi,
      'Tên phí': k.tenPhi,
      'Số tiền': k.soTien,
      'Đơn vị tính': k.donViTinh,
      'Nguồn thu': k.nguonThu,
      'Nhóm phí': k.nhomPhi,
      'Niên khoá': k.nienKhoa,
      'Tham chiếu pháp lý': k.thamChieuPhapLy,
      'Ghi chú': k.ghiChu || '—',
    }))
    exportToExcel(`danh-muc-phi-${data.truong?.maTruong ?? 'truong'}.xlsx`, [
      { name: 'Danh sách khoản phí', rows },
    ])
  }

  return (
    <div>
      <PageTitle title="Danh mục Phí — Chi tiết theo trường" showUnit={false} />
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
        onExport={handleExport}
      />

      <SectionCard title="Danh sách khoản phí">
        {loading ? <TableSkeleton rows={6} /> : <ChiTietTable rows={data.rows} />}
      </SectionCard>
    </div>
  )
}
