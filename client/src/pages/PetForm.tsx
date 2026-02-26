import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Heading, Text, Box, Spinner, Button, Field } from '@chakra-ui/react'
import { getPet, createPet, updatePet } from '../../lib/api'
import type { Pet } from '../types/index'

const PetForm = (): React.ReactElement => {
  return <></>
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const queryClient = useQueryClient()
//   const isEdit = Boolean(id)

//   const [name, setName] = useState('')
//   const [animalType, setAnimalType] = useState('')
//   const [ownerName, setOwnerName] = useState('')
//   const [dob, setDob] = useState('')
//   const [submitError, setSubmitError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const { data: pet, isLoading, error } = useQuery({
//     queryKey: ['pet', id],
//     queryFn: () => getPet(id!),
//     enabled: isEdit,
//   })

//   useEffect(() => {
//     if (pet) {
//       setName(pet.name)
//       setAnimalType(pet.animalType)
//       setOwnerName(pet.ownerName)
//       const d = typeof pet.dob === 'string' ? new Date(pet.dob) : pet.dob
//       setDob(d.toISOString().slice(0, 10))
//     }
//   }, [pet])

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     setSubmitError(null)
//     setIsSubmitting(true)
//     const payload: Omit<Pet, 'id'> = {
//       name,
//       animalType,
//       ownerName,
//       dob: new Date(dob),
//     }
//     const promise = isEdit
//       ? updatePet(id!, { ...payload, id: id! })
//       : createPet({ ...payload, id: '' })
//     promise
//       .then((createdOrUpdated) => {
//         queryClient.invalidateQueries({ queryKey: ['pets'] })
//         queryClient.invalidateQueries({ queryKey: ['dashboard'] })
//         if (isEdit) {
//           queryClient.invalidateQueries({ queryKey: ['pet', id] })
//         }
//         navigate(isEdit ? `/pets/${id}` : `/pets/${(createdOrUpdated as Pet).id}`)
//       })
//       .catch((err) => {
//         console.error(err)
//         setSubmitError(err?.response?.data?.error ?? err?.message ?? 'Failed to save pet')
//       })
//       .finally(() => setIsSubmitting(false))
//   }

//   if (isEdit && isLoading) return <Spinner />
//   if (isEdit && error) return <Text color="red.500">Error: {(error as Error)?.message}</Text>
//   if (isEdit && !pet) return <Text>Pet not found</Text>

//   return (
//     <Box maxW="md">
//       <Heading as="h1" py="4">
//         {isEdit ? 'Edit Pet' : 'New Pet'}
//       </Heading>
//       <form onSubmit={handleSubmit}>
//         {submitError && (
//           <Text color="red.500" mb="2">
//             {submitError}
//           </Text>
//         )}
//         <Field.Root mb="4">
//           <Field.Label>Name</Field.Label>
//           <Field.Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             placeholder="Pet name"
//           />
//         </Field.Root>
//         <Field.Root mb="4">
//           <Field.Label>Animal type</Field.Label>
//           <Field.Input
//             value={animalType}
//             onChange={(e) => setAnimalType(e.target.value)}
//             required
//             placeholder="e.g. Dog, Cat"
//           />
//         </Field.Root>
//         <Field.Root mb="4">
//           <Field.Label>Owner name</Field.Label>
//           <Field.Input
//             value={ownerName}
//             onChange={(e) => setOwnerName(e.target.value)}
//             required
//             placeholder="Owner name"
//           />
//         </Field.Root>
//         <Field.Root mb="4">
//           <Field.Label>Date of birth</Field.Label>
//           <Field.Input
//             type="date"
//             value={dob}
//             onChange={(e) => setDob(e.target.value)}
//             required
//           />
//         </Field.Root>
//         <Box mt="4" display="flex" gap="2">
//           <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
//             {isEdit ? 'Update' : 'Create'}
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => navigate(-1)}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   )
}

export default PetForm
