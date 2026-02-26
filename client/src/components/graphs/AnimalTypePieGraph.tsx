
import { Chart, useChart } from "@chakra-ui/charts"
import { Cell, Pie, PieChart } from "recharts"

export const AnimalTypePieGraph = ({ data }: { data: { type: string; count: number; }[] }) => {

  const colors = [
    'teal.400',  'teal.600',
    'blue.400',  'blue.600',
    'green.500', 'green.700',
    'orange.400', 'orange.600',
    'purple.400', 'purple.600',
    'cyan.400',  'cyan.600',
    'teal.400',  'teal.600'
  ]

  const formattedData = data.map((item, index) => ({
    name: item.type,
    value: item.count,
    color: colors[index],
  }))

  const chart = useChart({
    data: formattedData,
  })

  return (
    <Chart.Root boxSize="200px" mx="auto" chart={chart}>
      <PieChart>
        <Pie
            isAnimationActive={false}
            data={chart.data}
            dataKey={chart.key("value")}
            outerRadius={100}
            innerRadius={0}
            labelLine={false}
            label={({ name, index }) => {
                const { value } = chart.data[index ?? -1]
                const percent = value / chart.getTotal("value")
                return `${name}: ${(percent * 100).toFixed(1)}%`
            }}
        >
            {chart.data.map((item) => {
                return <Cell key={item.name} fill={chart.color(item.color)} />
            })}
        </Pie>
      </PieChart>
    </Chart.Root>
  )
}
