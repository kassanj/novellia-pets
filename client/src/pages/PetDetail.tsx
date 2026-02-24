import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPet, getRecords, deleteRecord } from '../../lib/api'
import { Heading, Text, Box, Spinner, Table, Badge, Button, Dialog } from '@chakra-ui/react'
import type { Record } from '../../types/index'


const PetDetail = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>()
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: petData, isLoading, error } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => getPet(id!),
    enabled: !!id,
  })

  const { data: records, isLoading: recordsLoading, error: recordsError } = useQuery({
    queryKey: ['records', id],
    queryFn: () => getRecords(id!),
    enabled: !!petData,
  })

  if (!id) return <Text color="red.500">No pet ID</Text>
  if (isLoading || recordsLoading) return <Spinner />
  if (error || recordsError) return <Text color="red.500">Error: {error?.message || recordsError?.message}</Text>
  if (!petData) return <Text>Pet not found</Text>

  const dob = typeof petData.dob === 'string' ? new Date(petData.dob) : petData.dob

  const getRecordBadge = (recordType: string) => {
    if (recordType === 'VACCINE') return <Badge outline="1px solid" backgroundColor="purple.400" color="white">Vaccine</Badge>
    if (recordType === 'ALLERGY') return <Badge outline="1px solid" backgroundColor="blue.500" color="white">Allergy</Badge>
    return <Badge colorScheme="gray">Unknown</Badge>
  }

  const handleDelete = (recordId: string) => {
    deleteRecord(recordId)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['records', petData?.id] });
      })
      .catch((err) => {
        console.error(err);
        setDeleteError(err?.message ?? 'Failed to delete record');
      });
  }

  return (
    <>
      <Dialog.Root
        open={!!deleteError}
        onOpenChange={(e) => {
          if (!e.open) setDeleteError(null);
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
        <Heading as="h1" py="4">Pet Name: {petData.name}</Heading>
        <Text>Animal type: {petData.animalType}</Text>
        <Text>Owner name: {petData.ownerName}</Text>
        <Text>Date of birth: {dob.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
      </Box>
      <Box>
        <Heading as="h2" py="4">Medical Records</Heading>
        {records?.length === 0 ? (
          <Text>No medical records found</Text>
        ) : (
          // Table of records
          records && records.length > 0 && (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Record Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Administered By</Table.ColumnHeader>
                  <Table.ColumnHeader>Severity</Table.ColumnHeader>
                  <Table.ColumnHeader>Reactions</Table.ColumnHeader>
                  <Table.ColumnHeader>Notes</Table.ColumnHeader>
                  <Table.ColumnHeader></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {records.map((record: Record) => (
                  <Table.Row 
                    key={record.id} 
                  >
                    <Table.Cell>{getRecordBadge(record.recordType)}</Table.Cell>
                    <Table.Cell>{record.id}</Table.Cell>
                    <Table.Cell>
                      {record.data.date ? new Date(record.data.date).toLocaleDateString() : '-'}
                    </Table.Cell>
                    <Table.Cell>{record.data.administeredBy || '-'}</Table.Cell>
                    <Table.Cell>{record.data.severity || '-'}</Table.Cell>
                    <Table.Cell>{record.data.reactions ? record.data.reactions.join(', ') : '-'}</Table.Cell>
                    <Table.Cell>{record.data.notes || '-'}</Table.Cell>
                    <Table.Cell>
                      <Button 
                        variant="outline" 
                        colorScheme="red" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(record.id);
                        }}>
                          X
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>  
            </Table.Root>
          )
          
        )}
      </Box>
    </>
  )
}

export default PetDetail;