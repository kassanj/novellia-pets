import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Heading, Text, Box, Spinner, Table, Button, Dialog, Link as ChakraLink } from '@chakra-ui/react'
import { getPets, deletePet } from '../../lib/api'
import type { Pet } from '../../types/index'

const PetList = (): React.ReactElement => {
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: pets, isLoading, error } = useQuery({
    queryKey: ['pets'],
    queryFn: () => getPets(),
  })

  const handleDelete = (petId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deletePet(petId)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['pets'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      })
      .catch((err) => {
        console.error(err)
        setDeleteError(err?.message ?? 'Failed to delete pet')
      })
  }

  if (isLoading) return <Spinner />
  if (error) return <Text color="red.500">Error: {(error as Error)?.message}</Text>

  return (
    <>
      <Dialog.Root
        open={!!deleteError}
        onOpenChange={(e) => {
          if (!e.open) setDeleteError(null)
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title color="red.500" fontWeight="bold">Delete failed</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>{deleteError}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <Button variant="outline" p={4} m={2} width="40px" height="40px">X</Button>
              </Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <Box mb="4">
        <Heading as="h1" py="4">All Pets</Heading>
        {!pets?.length ? (
          <Text>No pets yet.</Text>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Animal Type</Table.ColumnHeader>
                <Table.ColumnHeader>Owner</Table.ColumnHeader>
                <Table.ColumnHeader>Date of Birth</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {pets.map((pet: Pet) => {
                const dob = typeof pet.dob === 'string' ? new Date(pet.dob) : pet.dob
                return (
                  <Table.Row key={pet.id}>
                    <Table.Cell>
                      <ChakraLink asChild>
                        <Link to={`/pets/${pet.id}`}>
                          <Text fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
                            {pet.name}
                          </Text>
                        </Link>
                      </ChakraLink>
                    </Table.Cell>
                    <Table.Cell>{pet.animalType}</Table.Cell>
                    <Table.Cell>{pet.ownerName}</Table.Cell>
                    <Table.Cell>
                      {dob.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={(e) => handleDelete(pet.id, e)}
                      >
                        X
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </>
  )
}

export default PetList
