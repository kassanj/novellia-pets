import type { RecordType } from '../../../types/index'
import type { ComponentType } from 'react'
import type { RecordFormState, FieldErrors } from '../types'
import VaccineFields from './VaccineFields'
import AllergyFields from './AllergyFields'

type FieldProps = {
  form: RecordFormState
  errors: FieldErrors
  updateField: <K extends keyof RecordFormState>(key: K, value: RecordFormState[K]) => void
}

// For new record: Import its fields component and add one line here.
export const RECORD_TYPE_FIELDS: Partial<Record<RecordType, ComponentType<FieldProps>>> = {
  VACCINE: VaccineFields,
  ALLERGY: AllergyFields,
}

export const RECORD_TYPE_NAME_LABELS: Partial<Record<RecordType, string>> = {
  VACCINE: 'Vaccine name',
  ALLERGY: 'Allergy name',
}

export const RECORD_TYPE_NAME_PLACEHOLDERS: Partial<Record<RecordType, string>> = {
  VACCINE: 'e.g. Rabies',
  ALLERGY: 'e.g. Peanuts',
}