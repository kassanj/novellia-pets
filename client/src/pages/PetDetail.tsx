import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPet, getRecords, deleteRecord } from '../../lib/api'
import { Heading, Text, Box, Spinner, Table, Button, Badge, Dialog, Flex, Icon } from '@chakra-ui/react'
import { PiPencilLineLight, PiXCircleLight } from "react-icons/pi";
import { toaster } from '../lib/toaster'
import type { Record } from '../types/index'
import MedicalRecordModal from '../components/MedicalRecordModal'

type GroupedRecords = {
  VACCINE?: Record[]
  ALLERGY?: Record[]
}

const PetDetail = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>()
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)

  const queryClient = useQueryClient()

  const { data: petData, isLoading, error } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => getPet(id!),
    enabled: !!id,
  })

  const { data: records, isLoading: recordsLoading, error: recordsError } = useQuery({
    queryKey: ['records', id],
    queryFn: () => getRecords(id!) as Promise<GroupedRecords>,
    enabled: !!petData,
  })

  const handleEditRecord = (record: Record, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingRecord(record)
    setShowRecordModal(true)
  }

  const handleDeleteRecord = (recordId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteRecord(id!, recordId)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['records', id] })
        toaster.success({ title: 'Record deleted' })
      })
      .catch((err) => {
        console.error(err)
        setDeleteError(err?.message ?? 'Failed to delete record')
      })
  }

  const handleRecordModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['records', id] })
    toaster.success({ title: editingRecord ? 'Record updated' : 'Record added' })
  }

  const setSeverityBadge = (severity: 'MILD' | 'SEVERE') => {
    if (severity === 'MILD') return <Badge outline="1px solid" backgroundColor="green.400" color="white">Mild</Badge>
    if (severity === 'SEVERE') return <Badge outline="1px solid" backgroundColor="red.400" color="white">Severe</Badge>
    return <Badge colorScheme="gray">Unknown</Badge>
  }

  if (!id) return <Text color="red.500">No pet ID</Text>
  if (isLoading || recordsLoading) return <Spinner />
  if (error || recordsError) return <Text color="red.500">Error: {error?.message || recordsError?.message}</Text>
  if (!petData) return <Text>Pet not found</Text>

  const dob = typeof petData.dob === 'string' ? new Date(petData.dob) : petData.dob
  const vaccines = records?.VACCINE ?? []
  const allergies = records?.ALLERGY ?? []
  const hasAnyRecords = vaccines.length > 0 || allergies.length > 0

  return (
    <>
      <MedicalRecordModal
        key={editingRecord?.id ?? 'new'}
        open={showRecordModal}
        petId={id}
        record={editingRecord}
        onOpenChange={(e) => {
          setShowRecordModal(e.open)
          if (!e.open) setEditingRecord(null)
        }}
        onSuccess={handleRecordModalSuccess}
      />
      
      {/* TODO: Move this to a separate global component */}
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
        <Heading as="h1" py="4">Pet Name: {petData.name}</Heading>
        <Text>Animal type: {petData.animalType}</Text>
        <Text>Owner name: {petData.ownerName}</Text>
        <Text>Date of birth: {dob.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
      </Box>

      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h2" py="4">Medical Records</Heading>
          <Button 
            variant="outline" 
            colorScheme="blue" 
            size="sm" 
            onClick={() => {
              setEditingRecord(null)
              setShowRecordModal(true)
            }}
          >
            Add Record
          </Button>
        </Flex>
        {!hasAnyRecords ? (
          <Text>No medical records found</Text>
        ) : (
          <>
            {/* Vaccines Table */}
            {/* Requirements - name of the vaccine, date it was administered, administered by, and notes */}
            {vaccines.length > 0 && (
              <Box mb="6">
                <Heading as="h3" size="md" mb="3">Vaccines</Heading>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader width="10%">Name</Table.ColumnHeader>
                      <Table.ColumnHeader width="20%">Date</Table.ColumnHeader>
                      <Table.ColumnHeader width="20%">Administered By</Table.ColumnHeader>
                      <Table.ColumnHeader width="40%">Notes</Table.ColumnHeader>
                      <Table.ColumnHeader width="10%"></Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {vaccines.map((record) => {
                      const d = record.data && 'date' in record.data ? record.data.date : undefined
                      const dateStr = d ? (typeof d === 'string' ? new Date(d) : d) : '-'
                      const administeredBy = record.data && 'administeredBy' in record.data ? record.data.administeredBy : '-'
                      const notes = record.data?.notes ?? '-'
                      const name = record.data?.name ?? '-'
                      return (
                        <Table.Row key={record.id}>
                          <Table.Cell width="10%">{name}</Table.Cell>
                          <Table.Cell width="20%">{dateStr.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Table.Cell>
                          <Table.Cell width="20%">{administeredBy}</Table.Cell>
                          <Table.Cell width="40%">{notes}</Table.Cell>
                          <Table.Cell width="10%">
                            <Box display="flex" gap="2" justifyContent="end">
                              <Button variant="outline" size="sm" onClick={(e) => handleEditRecord(record, e)}>
                                <Icon as={PiPencilLineLight} />
                              </Button>
                              <Button variant="outline" size="sm" onClick={(e) => handleDeleteRecord(record.id, e)}>
                                <Icon as={PiXCircleLight} />
                              </Button>
                            </Box>
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}

            {/* Allergies Table */}
            {/* Requirements - name of the allergy, pet's reactions (e.g., hives, rash), severity (mild or severe), and notes */}
            {allergies.length > 0 && (
              <Box mb="6">
                <Heading as="h3" size="md" mb="3">Allergies</Heading>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader width="10%">Name</Table.ColumnHeader>
                      <Table.ColumnHeader width="20%">Reactions</Table.ColumnHeader>
                      <Table.ColumnHeader width="20%">Severity</Table.ColumnHeader>
                      <Table.ColumnHeader width="40%">Notes</Table.ColumnHeader>
                      <Table.ColumnHeader width="10%"></Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {allergies.map((record) => {
                      const reactions = record.data && 'reactions' in record.data ? record.data.reactions?.join(', ') ?? '-' : '-'
                      const severity = record.data && 'severity' in record.data ? record.data.severity : '-'
                      const notes = record.data?.notes ?? '-'
                      const name = record.data?.name ?? '-'
                      return (
                        <Table.Row key={record.id}>
                          <Table.Cell width="10%">{name}</Table.Cell>
                          <Table.Cell width="20%">{reactions}</Table.Cell>
                          <Table.Cell width="20%">{setSeverityBadge(severity as 'MILD' | 'SEVERE')}</Table.Cell>
                          <Table.Cell width="40%">{notes}</Table.Cell>
                          <Table.Cell width="10%">
                            <Box display="flex" gap="2" justifyContent="end">
                              <Button variant="outline" size="sm" onClick={(e) => handleEditRecord(record, e)}>
                                <Icon as={PiPencilLineLight} />
                              </Button>
                              <Button variant="outline" size="sm" onClick={(e) => handleDeleteRecord(record.id, e)}>
                                <Icon as={PiXCircleLight} />
                              </Button>
                            </Box>
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  )
}

export default PetDetail;