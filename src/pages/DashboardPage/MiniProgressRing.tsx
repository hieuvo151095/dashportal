import { tokens } from '@fluentui/react-components'
import { Cell, Pie, PieChart } from 'recharts'

interface MiniProgressRingProps {
  ratio: number
  size?: number
}

export function MiniProgressRing({ ratio, size = 40 }: MiniProgressRingProps) {
  const data = [
    { name: 'done', value: Math.max(ratio, 0.001) },
    { name: 'remaining', value: Math.max(1 - ratio, 0.001) },
  ]

  return (
    <PieChart width={size} height={size}>
      <Pie data={data} dataKey="value" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270}>
        <Cell fill={tokens.colorBrandBackground} />
        <Cell fill={tokens.colorNeutralStroke2} />
      </Pie>
    </PieChart>
  )
}
