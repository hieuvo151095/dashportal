import {
  Caption1,
  Tab,
  TabList,
  makeStyles,
  tokens,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import { PageTitle } from '../../components/PageTitle'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatDate } from '../../utils/date'
import { ngayDongBoGanNhat } from '../../utils/dongBo'
import { exportToExcel } from '../../utils/exportExcel'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { useSkeletonDelay } from '../../utils/useSkeletonDelay'
import { InvoiceTable } from './InvoiceTable'
import { KpiRow } from './KpiRow'
import { OverviewTable } from './OverviewTable'
import { TongHopFilterBar } from './TongHopFilterBar'
import { useTongHopData } from './useTongHopData'
import { useTongHopFilters, type TabId, type TongHopFilters } from './useTongHopFilters'

const useStyles = makeStyles({
  tabList: {
    marginBottom: tokens.spacingVerticalM,
  },
})

const TAB_LABELS: Record<TabId, string> = {
  'tong-quan': 'Tổng quan',
  'da-thanh-toan': 'Hoá đơn đã thanh toán',
  'mot-phan': 'Hoá đơn thanh toán một phần',
  'chua-thanh-toan': 'Hoá đơn chưa thanh toán',
}

export function ThuHocPhiTongHopPage() {
  const styles = useStyles()
  const filters = useTongHopFilters()
  const [draft, setDraft] = useFilterDraft<TongHopFilters>({
    ky: filters.ky,
    phuongXaIds: filters.phuongXaIds,
    truongIds: filters.truongIds,
    capHocList: filters.capHocList,
    hinhThucThanhToanList: filters.hinhThucThanhToanList,
    heThongList: filters.heThongList,
    trangThaiList: filters.trangThaiList,
    q: filters.q,
  })
  const data = useTongHopData(filters)
  const loading = useSkeletonDelay([
    filters.ky,
    filters.phuongXaIds,
    filters.truongIds,
    filters.capHocList,
    filters.hinhThucThanhToanList,
    filters.heThongList,
    filters.trangThaiList,
    filters.q,
    filters.tab,
  ])

  // Xuất đúng bảng của TAB đang xem, theo đúng bộ lọc đang áp dụng — không xuất toàn bộ dữ liệu gốc.
  function handleExport() {
    const kyLabel = filters.ky.replace('/', '-')
    if (filters.tab === 'tong-quan') {
      const rows = data.overviewRows.map((item, index) => ({
        STT: index + 1,
        'Mã trường': item.truong.maTruong,
        'Tên trường': item.truong.tenTruong,
        'Xã/Phường': item.phuongXa.ten,
        'Hệ thống': item.truong.heThongDoiTac,
        'Cấp học': item.truong.capHoc,
        'Tiền mặt': item.tienMat,
        'CK/Thu hộ': item.chuyenKhoan,
        'Tổng thu': item.tongThu,
        'HĐ còn lại': item.conLaiSoLuong,
        'Phí còn lại': item.conLaiTien,
        'Trạng thái': item.trangThaiTongHop,
        'Tỉ lệ thu (%)': Math.round(item.tyLeThu * 100),
        'Ngày cập nhật': formatDate(ngayDongBoGanNhat(item.truong)),
      }))
      exportToExcel(`thu-hoc-phi-tong-quan-${kyLabel}.xlsx`, [{ name: TAB_LABELS[filters.tab], rows }])
      return
    }

    const rows = data.invoiceRowsByTab[filters.tab].map((item, index) => ({
      STT: index + 1,
      'Mã trường': item.truong.maTruong,
      'Tên trường': item.truong.tenTruong,
      'Học sinh': `${item.hocSinh.hoTen} (${item.hocSinh.maHocSinh})`,
      'Số HĐ': item.hoaDon.soHoaDon,
      Kỳ: item.hoaDon.ky,
      'Hạn thanh toán': formatDate(item.hoaDon.hanThanhToan),
      'Hình thức TT': item.hoaDon.hinhThucThanhToan ?? '—',
      'Đã trả': item.hoaDon.daTra,
      'Còn lại': item.hoaDon.conLai,
      'Số tiền': item.hoaDon.soTien,
    }))
    exportToExcel(`thu-hoc-phi-${filters.tab}-${kyLabel}.xlsx`, [{ name: TAB_LABELS[filters.tab], rows }])
  }

  return (
    <div>
      <PageTitle title="Thu Học phí — Tổng hợp toàn thành phố" showUnit={false} />

      <TongHopFilterBar
        draft={draft}
        setDraft={setDraft}
        onApply={() => filters.apply(draft)}
        onReset={filters.reset}
        onExport={handleExport}
      />

      <KpiRow data={data} />

      <TabList
        className={styles.tabList}
        selectedValue={filters.tab}
        onTabSelect={(_: SelectTabEvent, tabData: SelectTabData) => filters.setTab(tabData.value as TabId)}
      >
        {(Object.keys(TAB_LABELS) as TabId[]).map((tab) => (
          <Tab key={tab} value={tab}>
            {TAB_LABELS[tab]}
          </Tab>
        ))}
      </TabList>

      <SectionCard
        title={TAB_LABELS[filters.tab]}
        action={<Caption1 style={{ color: tokens.colorNeutralForeground3 }}>Đơn vị: Đồng</Caption1>}
      >
        {loading ? (
          <TableSkeleton rows={8} />
        ) : filters.tab === 'tong-quan' ? (
          <OverviewTable rows={data.overviewRows} filters={filters} />
        ) : (
          <InvoiceTable rows={data.invoiceRowsByTab[filters.tab]} filters={filters} />
        )}
      </SectionCard>
    </div>
  )
}
