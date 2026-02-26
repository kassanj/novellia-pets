import { Table, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Link } from "react-router-dom";

type PetWithNoVaccine = {
  id: string
  name: string
  animalType: string
  ownerName: string
  dob: string
}

const PetsWithNoVaccine = ({ petData }: { petData: PetWithNoVaccine[] }) => {
  return (
    <Card.Root borderColor="gray.200" borderWidth="1px" borderRadius="md" p="4">
      <Text mb="2" fontWeight="medium">Pets with no vaccine</Text>
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
            {petData.map((row: { id: string; name: string, animalType: string, ownerName: string, dob: string }) => (
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