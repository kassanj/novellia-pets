import type { RecordType } from '../../../types/index'

export const RECORD_TYPES: { value: RecordType; label: string }[] = [
  { value: 'VACCINE', label: 'Vaccine' },
  { value: 'ALLERGY', label: 'Allergy' },
]

export const SEVERITY_OPTIONS = [
  { value: 'MILD', label: 'Mild' },
  { value: 'SEVERE', label: 'Severe' },
] as const

export const MIN_STRING_LENGTH = 1