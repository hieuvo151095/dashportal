import { Title2, makeStyles, tokens } from '@fluentui/react-components'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { TongHopFilterBar } from './TongHopFilterBar'
import { TongHopTable } from './TongHopTable'
import { useTongHopData } from './useTongHopData'
import { useTongHopFilters } from './useTongHopFilters'

const useStyles = makeStyles({
  title: {
    marginBottom: tokens.spacingVerticalM,
  },
})

export function DanhMucPhiTongHopPage() {
  const styles = useStyles()
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
      <Title2 as="h1" className={styles.title}>
        Danh mục Phí — Tổng hợp toàn thành phố
      </Title2>

      <TongHopFilterBar filters={filters} />

      <SectionCard title="Danh sách trường">
        {loading ? <TableSkeleton rows={8} /> : <TongHopTable rows={rows} filters={filters} />}
      </SectionCard>
    </div>
  )
}
