import React, { useEffect } from 'react'
import { Dialog, Field, Input, Button, Text } from '@chakra-ui/react'
import { createPet, updatePet } from '../../../lib/api'
import { usePetForm } from './usePetForm'
import type { PetModalProps } from './types'

export default function PetModal({
  open,
  onOpenChange,
  onSuccess,
  pet,
}: PetModalProps) {

  const isEditing = !!pet
  
  const {
    form,
    fieldErrors,
    submitError,
    isSubmitting,
    setSubmitError,
    setIsSubmitting,
    updateField,
    validate,
    buildPayload,
    reset,
    initialize,
  } = usePetForm()

  useEffect(() => {
    if (open && pet) initialize(pet)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when open or pet id changes; include initialize/pet would re-run every render and reset form in edit mode
  }, [open, pet?.id])

  const close = () => {
    reset()
    onOpenChange({ open: false })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setIsSubmitting(true)

    const action = isEditing
      ? updatePet(pet.id, buildPayload())
      : createPet(buildPayload())

    action
      .then(() => {
        onSuccess?.()
        close()
      })
      .catch(err => {
        setSubmitError(
          err?.response?.data?.error ?? err?.message ?? `Failed to ${isEditing ? 'update' : 'add'} pet`
        )
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <Dialog.Root open={open} onOpenChange={e => { if (!e.open) close() }}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{isEditing ? 'Edit Pet' : 'Add Pet'}</Dialog.Title>
          </Dialog.Header>

          <form onSubmit={handleSubmit}>
            <Dialog.Body>
              {submitError && (
                <Text color="red.500" mb="2">{submitError}</Text>
              )}

              <Field.Root mb="4" invalid={!!fieldErrors.name}>
                <Field.Label>Name</Field.Label>
                <Input
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Pet name"
                />
                {fieldErrors.name && (
                  <Field.ErrorText>{fieldErrors.name}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root mb="4" invalid={!!fieldErrors.animalType}>
                <Field.Label>Animal type</Field.Label>
                <Input
                  value={form.animalType}
                  onChange={e => updateField('animalType', e.target.value)}
                  placeholder="e.g. Dog, Cat"
                />
                {fieldErrors.animalType && (
                  <Field.ErrorText>{fieldErrors.animalType}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root mb="4" invalid={!!fieldErrors.ownerName}>
                <Field.Label>Owner name</Field.Label>
                <Input
                  value={form.ownerName}
                  onChange={e => updateField('ownerName', e.target.value)}
                  placeholder="Owner name"
                />
                {fieldErrors.ownerName && (
                  <Field.ErrorText>{fieldErrors.ownerName}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root mb="4" invalid={!!fieldErrors.dob}>
                <Field.Label>Date of birth</Field.Label>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={e => updateField('dob', e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
                {fieldErrors.dob && (
                  <Field.ErrorText>{fieldErrors.dob}</Field.ErrorText>
                )}
              </Field.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild m={4}>
                <Button type="button" variant="outline">Cancel</Button>
              </Dialog.CloseTrigger>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isEditing ? 'Update Pet' : 'Add Pet'}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}