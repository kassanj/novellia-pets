import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Heading, Text, Box, Spinner, Table, Button, Link as ChakraLink } from '@chakra-ui/react'
import { getPets, deletePet } from '../../lib/api'
import type { Pet } from '../../types/index'
import { toaster } from '../lib/toaster'
import AddPetModal from '../components/AddPetModal';

const PetList = (): React.ReactElement => {
  const [addPetOpen, setAddPetOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)

  const queryClient = useQueryClient()

  const { data: pets, isLoading, error } = useQuery({
    queryKey: ['pets'],
    queryFn: () => getPets(),
  })

  const handleDeletePet = (petId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    deletePet(petId)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['pets'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        toaster.success({ title: 'Pet deleted' })
      })
      .catch((err) => {
        console.error(err)
        toaster.error({ title: 'Failed to delete pet' })
      })
  }

  const handleEditPet = (pet: Pet, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingPet(pet)
    setAddPetOpen(true)
  }

  const handleAddPetSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['pets'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    toaster.success({ title: 'Pet added' })
  }

  if (isLoading) return <Spinner />
  if (error) return <Text color="red.500">Error: {(error as Error)?.message}</Text>

  return (
    <>
      <AddPetModal
        key={editingPet?.id ?? 'new'}  // key change forces re-mount when switching pets
        open={addPetOpen}
        pet={editingPet}
        onOpenChange={(e) => {
          setAddPetOpen(e.open)
          if (!e.open) setEditingPet(null)
        }}
        onSuccess={handleAddPetSuccess}
      />

      <Box mb="4">
        <Heading as="h1" py="4">Pets</Heading>

        <Button
          variant="outline"
          mb="4"
          onClick={() => {
            setEditingPet(null)
            setAddPetOpen(true)
          }}
        >
          Add Pet
        </Button>

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
                        onClick={(e) => handleEditPet(pet, e)}
                      >
                        edit
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={(e) => handleDeletePet(pet.id, e)}
                      >
                        x
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
