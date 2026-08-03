import { Caption1, makeStyles, tokens } from '@fluentui/react-components'
import { PageTitle } from '../../components/PageTitle'
import { exportToExcel } from '../../utils/exportExcel'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { CapHocAnalysisTable } from './CapHocAnalysisTable'
import { DashboardFilterBar } from './DashboardFilterBar'
import { DebtAgingChart } from './DebtAgingChart'
import { GridMap } from './GridMap'
import { KpiRow } from './KpiRow'
import { MonthlyTrendChart } from './MonthlyTrendChart'
import { PaymentMethodSection } from './PaymentMethodSection'
import { RevenueCompositionSection } from './RevenueCompositionSection'
import { SyncComplianceSection } from './SyncComplianceSection'
import { TopDebtSchoolsTable } from './TopDebtSchoolsTable'
import { TopRegionsRanking } from './TopRegionsRanking'
import { useDashboardData } from './useDashboardData'
import { useDashboardFilters, type DashboardFilters } from './useDashboardFilters'

const useStyles = makeStyles({
  description: {
    display: 'block',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalM,
  },
  twoColRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  fullRow: {
    marginBottom: tokens.spacingVerticalL,
  },
})

export function DashboardPage() {
  const styles = useStyles()
  const filters = useDashboardFilters()
  const [draft, setDraft] = useFilterDraft<DashboardFilters>({
    ky: filters.ky,
    phuongXaId: filters.phuongXaId,
    capHocList: filters.capHocList,
  })
  const data = useDashboardData(filters)
  const loading = useSkeletonDelay([filters.ky, filters.phuongXaId, filters.capHocList])

  // Phạm vi xuất Dashboard (đã chốt với người dùng): chỉ KPI + 2 bảng thật (Phân tích theo cấp
  // học, Top 20 công nợ) — không xuất dữ liệu nền của chart, không xuất Tình trạng đồng bộ dữ
  // liệu (widget đó có tab/tìm kiếm riêng, không thuộc bộ lọc chính của trang).
  function handleExport() {
    const { kpi, phanTichCapHoc, top20CongNo } = data
    const kpiRows = [
      { 'Chỉ số': 'Tổng hoá đơn', 'Số lượng': kpi.tongSoHoaDon, 'Số tiền': kpi.tongTien },
      { 'Chỉ số': 'Đã thu', 'Số lượng': kpi.soDaThanhToan, 'Số tiền': kpi.daThuTien },
      { 'Chỉ số': 'Cần thu (còn lại)', 'Số lượng': kpi.soCanThu, 'Số tiền': kpi.canThuTien },
      { 'Chỉ số': 'Tỉ lệ hoàn thành', 'Số lượng': `${Math.round(kpi.tiLeHoanThanh * 100)}%`, 'Số tiền': '' },
      {
        'Chỉ số': 'Cơ sở giáo dục',
        'Số lượng': `${kpi.soTruong} trường`,
        'Số tiền': `${Math.round(kpi.tyLeKetNoi * 100)}% đã kết nối`,
      },
    ]

    const tongCapHoc = {
      soTruong: phanTichCapHoc.reduce((s, r) => s + r.soTruong, 0),
      soHocSinh: phanTichCapHoc.reduce((s, r) => s + r.soHocSinh, 0),
      tongPhaiThu: phanTichCapHoc.reduce((s, r) => s + r.tongPhaiThu, 0),
      daThu: phanTichCapHoc.reduce((s, r) => s + r.daThu, 0),
    }
    const capHocRows = [
      ...phanTichCapHoc.map((item) => ({
        'Cấp học': item.capHoc,
        'Số trường': item.soTruong,
        'Số học sinh': item.soHocSinh,
        'Tổng phải thu': item.tongPhaiThu,
        'Đã thu': item.daThu,
        'Tỷ lệ (%)': Math.round(item.tyLe * 100),
      })),
      {
        'Cấp học': 'TỔNG CỘNG',
        'Số trường': tongCapHoc.soTruong,
        'Số học sinh': tongCapHoc.soHocSinh,
        'Tổng phải thu': tongCapHoc.tongPhaiThu,
        'Đã thu': tongCapHoc.daThu,
        'Tỷ lệ (%)': tongCapHoc.tongPhaiThu === 0 ? 0 : Math.round((tongCapHoc.daThu / tongCapHoc.tongPhaiThu) * 100),
      },
    ]

    const congNoRows = top20CongNo.map((item, index) => ({
      STT: index + 1,
      'Tên trường': item.truong.tenTruong,
      'Xã/Phường': item.phuongXa.ten,
      'Số tiền công nợ': item.tongNo,
      'Số học sinh chưa đóng': item.soHocSinh,
    }))

    exportToExcel(`dashboard-tong-quan-${filters.ky.replace('/', '-')}.xlsx`, [
      { name: 'Tổng quan (KPI)', rows: kpiRows },
      { name: 'Phân tích theo cấp học', rows: capHocRows },
      { name: 'Top 20 công nợ', rows: congNoRows },
    ])
  }

  return (
    <div>
      <PageTitle title="Tổng quan Thu học phí" showUnit={false} />
      <Caption1 as="p" className={styles.description}>
        Theo dõi tình hình thu học phí toàn thành phố theo thời gian thực
      </Caption1>

      <DashboardFilterBar
        draft={draft}
        setDraft={setDraft}
        onApply={() => filters.apply(draft)}
        onReset={filters.reset}
        onExport={handleExport}
      />

      <KpiRow data={data} />

      <div className={styles.twoColRow}>
        <GridMap data={data} loading={loading} ky={filters.ky} />
        <TopRegionsRanking data={data} loading={loading} ky={filters.ky} />
      </div>

      <div className={styles.twoColRow}>
        <RevenueCompositionSection data={data} loading={loading} />
        <PaymentMethodSection data={data} loading={loading} />
      </div>

      <div className={styles.twoColRow}>
        <MonthlyTrendChart data={data} loading={loading} ky={filters.ky} />
        <DebtAgingChart data={data} loading={loading} ky={filters.ky} />
      </div>

      <div className={styles.fullRow}>
        <CapHocAnalysisTable data={data} loading={loading} />
      </div>

      <div className={styles.fullRow}>
        <SyncComplianceSection data={data} loading={loading} />
      </div>

      <div className={styles.fullRow}>
        <TopDebtSchoolsTable data={data} loading={loading} />
      </div>
    </div>
  )
}
