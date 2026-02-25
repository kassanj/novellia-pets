import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Heading, Text, Box, Spinner, Table, Button, Link as ChakraLink, Flex, Input } from '@chakra-ui/react'
import { deletePet } from '../../lib/api'
import type { Pet } from '../../types/index'
import { toaster } from '../lib/toaster'
import PetModal from '../components/PetModal';
import { usePetsSearch } from '../hooks/usePetSearch'


const PetList = (): React.ReactElement => {
  const [petModalOpen, setPetModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [search, setSearch] = useState('')

  const queryClient = useQueryClient()

  const { data: pets, isLoading, error } = usePetsSearch({ search })

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
    setPetModalOpen(true)
  }

  const handlePetModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['pets'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    toaster.success({ title: editingPet ? 'Pet updated' : 'Pet added' })
  }

  if (error) return <Text color="red.500">Error: {(error as Error)?.message}</Text>

  return (
    <>
      <PetModal
        key={editingPet?.id ?? 'new'}  // key change forces re-mount when switching pets
        open={petModalOpen}
        pet={editingPet}
        onOpenChange={(e) => {
          setPetModalOpen(e.open)
          if (!e.open) setEditingPet(null)
        }}
        onSuccess={handlePetModalSuccess}
      />

      <Box mb="4">
        
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
      `    <Heading as="h1" py="4">Pets</Heading>
            <Button
              variant="outline"
              mb="4"
              onClick={() => {
                setEditingPet(null)
                setPetModalOpen(true)
              }}
            >
              Add Pet
            </Button>`
          </Box>
          <Box>
       
              <Input
                type="text"
                placeholder="Search pets"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
      
          </Box>
        </Flex>

        {isLoading ? (
          <Flex justifyContent="center" alignItems="center">
            <Spinner size="xl" />
          </Flex>
        ) : !pets?.length ? (
          <Flex justifyContent="center" alignItems="center">
            <Text>No pets found.</Text>
          </Flex>
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
                      <Box display="flex" gap="2" justifyContent="end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleEditPet(pet, e)}
                          >
                            edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleDeletePet(pet.id, e)}
                        >
                          x
                        </Button>
                      </Box>
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
