import { Card, Text, Table } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

type PetWithLastVaccine = {
  id: string
  name: string
  animalType: string
  ownerName: string
  dob: string
  lastVaccine: { name?: string; date?: string } | null
}

const PetsWithLastVaccine = ({ petData }: { petData: PetWithLastVaccine[] }) => {
  const navigate = useNavigate()

  return (
    <Card.Root borderColor="gray.200" borderWidth="1px" borderRadius="md" p="4">
    <Text mb="2" fontWeight="medium">Upcoming Vaccine Renewals</Text>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Last vaccine</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {petData.map((row: PetWithLastVaccine) => (
            <Table.Row
              key={row.id}
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              onClick={() => navigate(`/pets/${row.id}`)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  navigate(`/pets/${row.id}`)
                }
              }}
            >
              <Table.Cell fontWeight="medium">{row.name}</Table.Cell>
              <Table.Cell>
                {row.lastVaccine
                  ? `${row.lastVaccine.name ?? '-'}${row.lastVaccine.date ? ` (${new Date(row.lastVaccine.date).toLocaleDateString()})` : ''}`
                  : '-'}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card.Root>
  )
}

export default PetsWithLastVaccine