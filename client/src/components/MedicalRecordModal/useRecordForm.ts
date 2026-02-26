import { useState } from 'react'
import type { RecordType, Record } from '../../types/index'
import type { FieldErrors, RecordFormState, CreateRecordPayload } from './types'
import { MIN_STRING_LENGTH } from './constants'

const isOnlyNumbers = (s: string): boolean => /^\d+$/.test(s)

const DEFAULT_STATE: RecordFormState = {
  name: '',
  date: '',
  administeredBy: '',
  notes: '',
  reactionsInput: '',
  severity: 'MILD',
}

const dateToInputValue = (d: Date | string): string => {
  if (typeof d === 'string') return d.slice(0, 10)
  return (d as Date).toISOString().slice(0, 10)
}

const useRecordForm = (initialType: RecordType = 'VACCINE') => {
  const [recordType, setRecordType] = useState<RecordType>(initialType)
  const [form, setForm] = useState<RecordFormState>(DEFAULT_STATE)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialize = (record: Record) => {
    setRecordType(record.recordType)
    const recordData = record.data

    if (record.recordType === 'VACCINE' && recordData && 'date' in recordData) {

      const v = recordData as { date?: Date | string; name?: string; administeredBy?: string; notes?: string }
      
      setForm({
        name: v.name ?? '',
        date: v.date ? dateToInputValue(v.date) : '',
        administeredBy: v.administeredBy ?? '',
        notes: v.notes ?? '',
        reactionsInput: DEFAULT_STATE.reactionsInput,
        severity: DEFAULT_STATE.severity,
      })

    } else if (record.recordType === 'ALLERGY' && recordData && 'reactions' in recordData) {

      const allergyData = recordData as { reactions?: string[]; severity?: string }

      setForm({
        name: recordData.name ?? '',
        date: DEFAULT_STATE.date,
        administeredBy: DEFAULT_STATE.administeredBy,
        notes: recordData.notes ?? '',
        reactionsInput: (allergyData.reactions ?? []).join(', '),
        severity: allergyData.severity ?? DEFAULT_STATE.severity,
      })

    }
    setFieldErrors({})
  }

  const updateField = <K extends keyof RecordFormState>(
    key: K,
    value: RecordFormState[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
    // Clear the error for this field as the user types
    if (fieldErrors[key as keyof FieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  const changeRecordType = (type: RecordType) => {
    setRecordType(type)
    setForm(DEFAULT_STATE)
    setFieldErrors({})
  }

  const reset = () => {
    setRecordType(initialType)
    setForm(DEFAULT_STATE)
    setFieldErrors({})
    setSubmitError(null)
  }

  const validate = (): boolean => {
    const trimmedName = form.name.trim()
    const errors: FieldErrors = {}

    if (trimmedName.length < MIN_STRING_LENGTH) {
      errors.name = 'Name is required'
    } else if (isOnlyNumbers(trimmedName)) {
      errors.name = 'Name must contain letters, not only numbers'
    }

    if (recordType === 'VACCINE') {
      if (!form.date.trim()) {
        errors.date = 'Date is required'
      } else {
        const d = new Date(form.date)
        if (Number.isNaN(d.getTime())) {
          errors.date = 'Please enter a valid date'
        } else if (d < new Date('2000-01-01')) {
          errors.date = 'Date cannot be before 01/01/2000'
        } else if (d > new Date()) {
          errors.date = 'Date cannot be in the future'
        }
      }
    }

    if (recordType === 'ALLERGY') {
      const reactions = form.reactionsInput.split(',').map(s => s.trim()).filter(Boolean)
      if (reactions.length < 1) {
        errors.reactions = 'At least one reaction is required'
      }
      if (!form.severity) {
        errors.severity = 'Severity is required'
      }
    }

    // Adding a new record type? Add its validation block here only.
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Build the payload based on record type
  // Adding a new type? Add a new case here only.
  const buildPayload = (): CreateRecordPayload => {
    if (recordType === 'VACCINE') {
      return {
        recordType: 'VACCINE',
        data: {
          name: form.name.trim(),
          date: form.date.trim(),
          administeredBy: form.administeredBy.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }
      }
    }

    if (recordType === 'ALLERGY') {
      return {
        recordType: 'ALLERGY',
        data: {
          name: form.name.trim(),
          reactions: form.reactionsInput.split(',').map(s => s.trim()).filter(Boolean),
          severity: form.severity,
          notes: form.notes.trim() || undefined,
        }
      }
    }

    throw new Error(`Unknown record type: ${recordType}`)
  }

  return {
    recordType,
    form,
    fieldErrors,
    submitError,
    isSubmitting,
    setSubmitError,
    setIsSubmitting,
    updateField,
    changeRecordType,
    validate,
    buildPayload,
    reset,
    initialize,
  }
}

export default useRecordForm;