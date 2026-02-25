import React from 'react'
import { Dialog, Field, Input, Button, Text, NativeSelect } from '@chakra-ui/react'
import { createRecord } from '../../../lib/api'
import { RECORD_TYPES } from './constants'
import {
  RECORD_TYPE_FIELDS,
  RECORD_TYPE_NAME_LABELS,
  RECORD_TYPE_NAME_PLACEHOLDERS
} from './fields/index'
import { useRecordForm } from './useRecordForm'
import type { RecordType } from '../../../types/index'

export type AddMedicalRecordModalProps = {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  onSuccess?: () => void
  petId: string
}

export default function AddMedicalRecordModal({
  open,
  onOpenChange,
  onSuccess,
  petId,
}: AddMedicalRecordModalProps) {
  const {
    recordType, form, fieldErrors, submitError,
    isSubmitting, setSubmitError, setIsSubmitting,
    updateField, changeRecordType, validate, buildPayload, reset
  } = useRecordForm()

  const close = () => {
    reset()
    onOpenChange({ open: false })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setIsSubmitting(true)

    const payload = buildPayload()

    createRecord(petId, {
      id: '',
      petId,
      recordType: payload.recordType,
      data: payload.data
    } as Parameters<typeof createRecord>[1])
      .then(() => {
        onSuccess?.()
        close()
      })
      .catch(err => {
        setSubmitError(err?.response?.data?.error ?? err?.message ?? 'Failed to add record')
      })
      .finally(() => setIsSubmitting(false))
  }

  // Look up the fields component for the current record type
  const TypeFields = RECORD_TYPE_FIELDS[recordType]

  return (
    <Dialog.Root open={open} onOpenChange={e => { if (!e.open) close() }}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Add Medical Record</Dialog.Title>
          </Dialog.Header>

          <form onSubmit={handleSubmit}>
            <Dialog.Body>
              {submitError && (
                <Text color="red.500" mb="2">{submitError}</Text>
              )}

              {/* Record type selector */}
              <Field.Root mb="4">
                <Field.Label>Type</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={recordType}
                    onChange={e => changeRecordType(e.target.value as RecordType)}
                  >
                    {RECORD_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

              {/* Name field — label and placeholder driven by record type */}
              <Field.Root mb="4" invalid={!!fieldErrors.name}>
                <Field.Label>
                  {RECORD_TYPE_NAME_LABELS[recordType] ?? 'Name'}
                </Field.Label>
                <Input
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder={RECORD_TYPE_NAME_PLACEHOLDERS[recordType] ?? ''}
                />
                {fieldErrors.name && <Field.ErrorText>{fieldErrors.name}</Field.ErrorText>}
              </Field.Root>

              {/* Type-specific fields */}
              {TypeFields && (
                <TypeFields
                  form={form}
                  errors={fieldErrors}
                  updateField={updateField}
                />
              )}

              {/* Notes is universal across all types */}
              <Field.Root mb="4">
                <Field.Label>Notes (optional)</Field.Label>
                <Input
                  value={form.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  placeholder="Additional notes"
                />
              </Field.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild m={4}>
                <Button type="button" variant="outline">Cancel</Button>
              </Dialog.CloseTrigger>
              <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                Add Record
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}