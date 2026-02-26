import { Card, Text, Table, Link as ChakraLink } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

type PetWithLastVaccine = {
  id: string
  name: string
  animalType: string
  ownerName: string
  dob: string
  lastVaccine: { name?: string; date?: string } | null
}

const PetsWithLastVaccine = ({ petData }: { petData: PetWithLastVaccine[] }) => {
  
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
          {petData.map((row: { id: string; name: string; lastVaccine: { name?: string; date?: string } | null }) => (
            <Table.Row key={row.id}>
              <Table.Cell>
                <ChakraLink asChild>
                  <Link to={`/pets/${row.id}`}>
                    <Text fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
                      {row.name}
                    </Text>
                  </Link>
                </ChakraLink>
                </Table.Cell>
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