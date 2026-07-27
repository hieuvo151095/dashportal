import { Body1, Caption1, makeStyles, tokens } from '@fluentui/react-components'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalL,
  },
  chartBox: {
    width: '160px',
    height: '160px',
    flexShrink: 0,
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    flexGrow: 1,
    minWidth: 0,
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalSNudge,
  },
  swatch: {
    width: '10px',
    height: '10px',
    borderRadius: tokens.borderRadiusCircular,
    flexShrink: 0,
  },
  legendLabel: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

export interface DonutChartDatum {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutChartDatum[]
  valueFormatter: (value: number) => string
}

export function DonutChart({ data, valueFormatter }: DonutChartProps) {
  const styles = useStyles()
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className={styles.root}>
      <div className={styles.chartBox}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius="60%" outerRadius="100%" paddingAngle={2}>
              {data.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => valueFormatter(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.legend}>
        {data.map((item) => (
          <div className={styles.legendRow} key={item.label}>
            <span className={styles.swatch} style={{ backgroundColor: item.color }} />
            <Body1 className={styles.legendLabel}>{item.label}</Body1>
            <Caption1>
              {total === 0 ? '0%' : `${Math.round((item.value / total) * 100)}%`} · {valueFormatter(item.value)}
            </Caption1>
          </div>
        ))}
      </div>
    </div>
  )
}
