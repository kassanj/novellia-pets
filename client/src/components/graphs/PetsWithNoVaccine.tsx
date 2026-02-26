import { Table, Text } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type PetWithNoVaccine = {
  id: string
  name: string
  animalType: string
  ownerName: string
  dob: string
}

const PetsWithNoVaccine = ({ petData }: { petData: PetWithNoVaccine[] }) => {
  const navigate = useNavigate()

  return (
    <Card.Root borderColor="gray.200" borderWidth="1px" borderRadius="md" p="4">
      <Text mb="2" fontWeight="medium">Unvaccinated Pets</Text>
      <Table.Root>
        <Table.Header>
            <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Animal Type</Table.ColumnHeader>
            <Table.ColumnHeader>Owner Name</Table.ColumnHeader>
            <Table.ColumnHeader>Age (years)</Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {petData.map((row: PetWithNoVaccine) => (
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
                <Table.Cell>{row.animalType}</Table.Cell>
                <Table.Cell>{row.ownerName}</Table.Cell>
                <Table.Cell>{Math.floor((new Date().getTime() - new Date(row.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))}</Table.Cell>
            </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Card.Root>
  )
}

export default PetsWithNoVaccine