import { Body1, Button, Caption1, makeStyles, tokens } from '@fluentui/react-components'
import { AddRegular, SubtractRegular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatCurrencyWithUnit } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

// Số cột lưới theo từng mức zoom, giảm dần khi phóng to (ô to hơn) — container cuộn dọc
// khi số hàng vượt chiều cao hiển thị, thay vì scroll-wheel zoom (đơn giản, không xung đột
// với thao tác cuộn trang của người dùng).
const ZOOM_LEVELS = [20, 16, 12, 8]
const DEFAULT_ZOOM_INDEX = 0

type CellDatum = DashboardData['tyLeThuTheoPhuong'][number]

function mauTheoTyLe(tyLe: number, coDuLieu: boolean): string {
  if (!coDuLieu) return tokens.colorNeutralBackground4
  if (tyLe > 0.95) return tokens.colorPaletteGreenForeground1
  if (tyLe >= 0.85) return tokens.colorPaletteGreenForeground2
  if (tyLe >= 0.7) return tokens.colorPaletteMarigoldForeground2
  return tokens.colorPaletteRedForeground1
}

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalM,
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
  swatch: {
    width: '10px',
    height: '10px',
    borderRadius: tokens.borderRadiusSmall,
    flexShrink: 0,
  },
  zoomControls: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXXS,
  },
  gridScroll: {
    maxHeight: '420px',
    overflowY: 'auto',
    paddingRight: tokens.spacingHorizontalXS,
  },
  grid: {
    display: 'grid',
    gap: tokens.spacingHorizontalXS,
  },
  cell: {
    aspectRatio: '1',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase100,
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    outlineOffset: '2px',
  },
  cellSelected: {
    boxShadow: `0 0 0 2px ${tokens.colorNeutralForeground1}`,
  },
  detailBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
  },
  detailInfo: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
  },
  footer: {
    marginTop: tokens.spacingVerticalS,
  },
})

interface GridMapProps {
  data: DashboardData
  loading?: boolean
}

export function GridMap({ data, loading }: GridMapProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Nhóm theo Địa bàn cũ (thứ tự nhóm theo lần xuất hiện đầu tiên, giữ nguyên thứ tự nguồn
  // Excel — vốn đã gần liền kề theo quận/huyện cũ) rồi sắp xếp theo tên trong từng nhóm —
  // vị trí ô ổn định qua mọi lần đổi filter/kỳ, không xáo trộn theo tỷ lệ thu.
  const cells = useMemo(() => {
    const theoDiaBan = new Map<string, CellDatum[]>()
    for (const item of data.tyLeThuTheoPhuong) {
      const list = theoDiaBan.get(item.phuongXa.diaBanCu) ?? []
      list.push(item)
      theoDiaBan.set(item.phuongXa.diaBanCu, list)
    }
    const result: CellDatum[] = []
    for (const list of theoDiaBan.values()) {
      list.sort((a, b) => a.phuongXa.ten.localeCompare(b.phuongXa.ten, 'vi'))
      result.push(...list)
    }
    return result
  }, [data.tyLeThuTheoPhuong])

  const selected = cells.find((item) => item.phuongXa.id === selectedId)
  const columns = ZOOM_LEVELS[zoomIndex]

  const action = (
    <div className={styles.zoomControls}>
      <Button
        appearance="subtle"
        icon={<SubtractRegular />}
        aria-label="Thu nhỏ"
        disabled={zoomIndex === 0}
        onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
      />
      <Button
        appearance="subtle"
        icon={<AddRegular />}
        aria-label="Phóng to"
        disabled={zoomIndex === ZOOM_LEVELS.length - 1}
        onClick={() => setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
      />
    </div>
  )

  if (loading) {
    return (
      <SectionCard title="Bản đồ tỷ lệ thu theo Phường/Xã" action={action}>
        <TableSkeleton rows={4} />
      </SectionCard>
    )
  }

  return (
    <SectionCard title="Bản đồ tỷ lệ thu theo Phường/Xã" action={action}>
      <div className={styles.legend} style={{ marginBottom: tokens.spacingVerticalM }}>
        <div className={styles.legendItem}>
          <span className={styles.swatch} style={{ backgroundColor: tokens.colorPaletteGreenForeground1 }} />
          <Caption1>{'>95%'}</Caption1>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.swatch} style={{ backgroundColor: tokens.colorPaletteGreenForeground2 }} />
          <Caption1>85–95%</Caption1>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.swatch} style={{ backgroundColor: tokens.colorPaletteMarigoldForeground2 }} />
          <Caption1>70–&lt;85%</Caption1>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.swatch} style={{ backgroundColor: tokens.colorPaletteRedForeground1 }} />
          <Caption1>{'<70%'}</Caption1>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.swatch} style={{ backgroundColor: tokens.colorNeutralBackground4 }} />
          <Caption1>Chưa có trường</Caption1>
        </div>
      </div>

      {selected && (
        <div className={styles.detailBar}>
          <div className={styles.detailInfo}>
            <Body1>
              <strong>{selected.phuongXa.ten}</strong>
            </Body1>
            {selected.coDuLieu ? (
              <>
                <Caption1>{`Tỷ lệ thu: ${Math.round(selected.tyLe * 100)}%`}</Caption1>
                <Caption1>{`Đã thu: ${formatCurrencyWithUnit(selected.daThuTien)}`}</Caption1>
                <Caption1>{`Còn thu: ${formatCurrencyWithUnit(selected.conThuTien)}`}</Caption1>
              </>
            ) : (
              <Caption1>Chưa có trường trên địa bàn</Caption1>
            )}
          </div>
          <Button
            appearance="primary"
            disabled={!selected.coDuLieu}
            onClick={() => navigate(`/thu-hoc-phi/tong-hop?xa=${selected.phuongXa.id}`)}
          >
            Xem chi tiết
          </Button>
        </div>
      )}

      <div className={styles.gridScroll}>
        <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {cells.map((item) => (
            <button
              key={item.phuongXa.id}
              type="button"
              title={item.phuongXa.ten}
              className={`${styles.cell} ${item.phuongXa.id === selectedId ? styles.cellSelected : ''}`}
              style={{ backgroundColor: mauTheoTyLe(item.tyLe, item.coDuLieu) }}
              onClick={() => setSelectedId(item.phuongXa.id)}
            >
              {item.coDuLieu ? `${Math.round(item.tyLe * 100)}%` : ''}
            </button>
          ))}
        </div>
      </div>
      <Caption1 as="p" className={styles.footer}>
        {`${data.soPhuongXaCoDuLieu}/${cells.length} Phường/Xã có trường trên địa bàn`}
      </Caption1>
    </SectionCard>
  )
}
