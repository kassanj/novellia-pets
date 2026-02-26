import { BarList, type BarListData, useChart, type UseChartReturn } from "@chakra-ui/charts"

export const AnimalTypeCountGraph = ({ data }: { data: { type: string; count: number; }[] }) => {

    const colors = [
        'teal.400',  'teal.600',
        'blue.400',  'blue.600',
        'green.500', 'green.700',
        'orange.400', 'orange.600',
        'purple.400', 'purple.600',
        'cyan.400',  'cyan.600',
        'teal.400',  'teal.600',
    ]
   
    const formattedData = data.map((item, index) => ({
        name: item.type,
        value: item.count,
        color: colors[index],
    }))

  const chart = useChart({
    sort: { by: "value", direction: "desc" },
    data: formattedData,
    series: [{ name: "name", color: "teal.subtle" }],

  })

  return (
    <BarList.Root chart={chart as unknown as UseChartReturn<BarListData>}>
      <BarList.Content>
        <BarList.Bar />
        <BarList.Value />
      </BarList.Content>
    </BarList.Root>
  )
}