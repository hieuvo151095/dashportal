import { Body1, Button, Caption1, makeStyles, tokens } from '@fluentui/react-components'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip as LeafletTooltip } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { TOA_DO_PHUONG_XA } from '../../mock-data'
import { SectionCard } from '../../components/SectionCard'
import { TableSkeleton } from '../../components/TableSkeleton'
import { formatCurrencyWithUnit } from '../../utils/currency'
import type { DashboardData } from './useDashboardData'

type CellDatum = DashboardData['tyLeThuTheoPhuong'][number]

function mauTheoTyLe(tyLe: number, coDuLieu: boolean): string {
  if (!coDuLieu) return tokens.colorNeutralBackground4
  if (tyLe > 0.95) return tokens.colorPaletteGreenForeground1
  if (tyLe >= 0.85) return tokens.colorPaletteGreenForeground2
  if (tyLe >= 0.7) return tokens.colorPaletteMarigoldForeground2
  return tokens.colorPaletteRedForeground1
}

const useStyles = makeStyles({
  legend: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    marginBottom: tokens.spacingVerticalM,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
  swatch: {
    width: '10px',
    height: '10px',
    borderRadius: tokens.borderRadiusCircular,
    flexShrink: 0,
  },
  mapBox: {
    height: '420px',
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
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
    color: tokens.colorNeutralForeground3,
  },
})

interface GridMapProps {
  data: DashboardData
  loading?: boolean
  ky: string
}

export function GridMap({ data, loading, ky }: GridMapProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Ghép toạ độ GPS thật (tra theo tên đầy đủ, vd "Phường Bến Thành") vào từng dòng dữ liệu
  // tỷ lệ thu — bỏ qua khu vực không tra được toạ độ (không nên xảy ra vì đã geocode đủ 168,
  // nhưng phòng hờ dữ liệu Phường/Xã đổi trong tương lai mà quên geocode bổ sung).
  const cells = useMemo(
    () =>
      data.tyLeThuTheoPhuong
        .map((item) => ({ ...item, toaDo: TOA_DO_PHUONG_XA[item.phuongXa.ten] }))
        .filter((item): item is CellDatum & { toaDo: { lat: number; lon: number } } => Boolean(item.toaDo)),
    [data.tyLeThuTheoPhuong],
  )

  const bounds = useMemo(() => L.latLngBounds(cells.map((c) => [c.toaDo.lat, c.toaDo.lon])), [cells])
  const selected = cells.find((item) => item.phuongXa.id === selectedId)

  if (loading) {
    return (
      <SectionCard title="Bản đồ tỷ lệ thu theo Phường/Xã">
        <TableSkeleton rows={4} />
      </SectionCard>
    )
  }

  return (
    <SectionCard title="Bản đồ tỷ lệ thu theo Phường/Xã">
      <div className={styles.legend}>
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
            onClick={() =>
              navigate(`/thu-hoc-phi/tong-hop?ky=${encodeURIComponent(ky)}&xa=${selected.phuongXa.id}`)
            }
          >
            Xem chi tiết
          </Button>
        </div>
      )}

      <div className={styles.mapBox}>
        <MapContainer bounds={bounds} boundsOptions={{ padding: [16, 16] }} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {cells.map((item) => (
            <CircleMarker
              key={item.phuongXa.id}
              center={[item.toaDo.lat, item.toaDo.lon]}
              radius={item.phuongXa.id === selectedId ? 9 : 6}
              pathOptions={{
                className: item.phuongXa.id,
                color: '#fff',
                weight: item.phuongXa.id === selectedId ? 2 : 1,
                fillColor: mauTheoTyLe(item.tyLe, item.coDuLieu),
                fillOpacity: 0.9,
              }}
              eventHandlers={{ click: () => setSelectedId(item.phuongXa.id) }}
            >
              <LeafletTooltip direction="top" offset={[0, -6]}>
                {`${item.phuongXa.ten}${item.coDuLieu ? ` — ${Math.round(item.tyLe * 100)}%` : ''}`}
              </LeafletTooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <Caption1 as="p" className={styles.footer}>
        {`${data.soPhuongXaCoDuLieu}/${cells.length} Phường/Xã có trường trên địa bàn. Toạ độ: geocode qua OpenStreetMap Nominatim. Bản đồ nền: © OpenStreetMap contributors.`}
      </Caption1>
    </SectionCard>
  )
}
