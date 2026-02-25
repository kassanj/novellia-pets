import React, { useEffect } from 'react'
import { Dialog, Field, Input, Button, Text, NativeSelect } from '@chakra-ui/react'
import { createRecord, updateRecord } from '../../../lib/api'
import { RECORD_TYPES } from './constants'
import {
  RECORD_TYPE_FIELDS,
  RECORD_TYPE_NAME_LABELS,
  RECORD_TYPE_NAME_PLACEHOLDERS
} from './fields/index'
import useRecordForm from './useRecordForm'
import type { RecordType } from '../../../types/index'
import type { Record } from '../../../types/index'

export type MedicalRecordModalProps = {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  onSuccess?: () => void
  petId: string
  record?: Record | null
}

export default function MedicalRecordModal({
  open,
  onOpenChange,
  onSuccess,
  petId,
  record = null,
}: MedicalRecordModalProps) {
  const isEditing = !!record

  const {
    recordType, form, fieldErrors, submitError,
    isSubmitting, setSubmitError, setIsSubmitting,
    updateField, changeRecordType, validate, buildPayload, reset, initialize
  } = useRecordForm()

  useEffect(() => {
    if (open && record) initialize(record)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when open or record id changes; avoid resetting form on every re-render in edit mode
  }, [open, record?.id])

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

    const action = isEditing
      ? updateRecord(petId, record!.id, { data: payload.data as Record['data'] })
      : createRecord(petId, {
          id: '',
          petId,
          recordType: payload.recordType,
          data: payload.data as Record['data']
        })

    action
      .then(() => {
        onSuccess?.()
        close()
      })
      .catch(err => {
        setSubmitError(
          err?.response?.data?.error ?? err?.message ?? `Failed to ${isEditing ? 'update' : 'add'} medical record`
        )
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
            <Dialog.Title>{isEditing ? 'Edit Medical Record' : 'Add Medical Record'}</Dialog.Title>
          </Dialog.Header>

          <form onSubmit={handleSubmit}>
            <Dialog.Body>
              {submitError && (
                <Text color="red.500" mb="2">{submitError}</Text>
              )}

              {/* Record type selector — disabled when editing */}
              <Field.Root mb="4">
                <Field.Label>Type</Field.Label>
                <NativeSelect.Root {...(isEditing ? { disabled: true } : {})}>
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
                {isEditing ? 'Update Record' : 'Add Record'}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}