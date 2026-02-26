import { Card, Stat } from "@chakra-ui/react"

export const NumberGraph = ({ total, title }: { total: number, title: string }) => {
  return (
    <Card.Root maxW="lg" size="lg" overflow="hidden" borderColor="gray.200" borderWidth="1px" borderRadius="md" mb="4">
      <Card.Body>
        <Stat.Root>
          <Stat.Label fontSize="md">
            {title}
          </Stat.Label>
          <Stat.ValueText fontSize="4xl" mt="2">{total}</Stat.ValueText>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  )
}
