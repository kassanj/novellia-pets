import { useState } from 'react'
import type { FieldErrors, Pet, PetFormState } from './types'
import { MIN_STRING_LENGTH, MIN_DOB } from './constants'

const isOnlyNumbers = (s: string): boolean => /^\d+$/.test(s)

const DEFAULT_STATE: PetFormState = {
  name: '',
  animalType: '',
  ownerName: '',
  dob: '',
}

export function usePetForm() {
  const [form, setForm] = useState<PetFormState>(DEFAULT_STATE)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialize = (pet: Pet) => {
    setForm({
      name: pet.name,
      animalType: pet.animalType,
      ownerName: pet.ownerName,
      dob: typeof pet.dob === 'string'
        ? (pet.dob as string).slice(0, 10)
        : (pet.dob as Date).toISOString().slice(0, 10),
    })
  }

  const updateField = <K extends keyof PetFormState>(
    key: K,
    value: PetFormState[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  const reset = () => {
    setForm(DEFAULT_STATE)
    setFieldErrors({})
    setSubmitError(null)
  }

  const validateTextField = (
    value: string,
    fieldName: string
  ): string | undefined => {
    const trimmed = value.trim()
    if (trimmed.length < MIN_STRING_LENGTH) return `${fieldName} is required`
    if (isOnlyNumbers(trimmed)) return `${fieldName} must contain letters, not numbers`
    return undefined
  }

  const validate = (): boolean => {
    const errors: FieldErrors = {}

    const nameError = validateTextField(form.name, 'Name')
    if (nameError) errors.name = nameError

    const animalTypeError = validateTextField(form.animalType, 'Animal type')
    if (animalTypeError) errors.animalType = animalTypeError

    const ownerNameError = validateTextField(form.ownerName, 'Owner name')
    if (ownerNameError) errors.ownerName = ownerNameError

    if (!form.dob.trim()) {
      errors.dob = 'Date of birth is required'
    } else {
      const date = new Date(form.dob)
      if (Number.isNaN(date.getTime())) {
        errors.dob = 'Please enter a valid date'
      } else if (date < new Date(MIN_DOB)) {
        errors.dob = `Date of birth cannot be before ${MIN_DOB}`
      } else if (date > new Date()) {
        errors.dob = 'Date of birth cannot be in the future'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const buildPayload = () => ({
    name: form.name.trim(),
    animalType: form.animalType.trim(),
    ownerName: form.ownerName.trim(),
    dob: new Date(form.dob),
    id: ''
  })

  return {
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
  }
}