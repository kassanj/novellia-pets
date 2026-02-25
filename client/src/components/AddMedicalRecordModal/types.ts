import type { RecordType } from '../../../types/index'

export type FieldErrors = {
  name?: string
  date?: string
  administeredBy?: string
  notes?: string
  reactions?: string
  severity?: string
}

export type RecordFormState = {
  name: string
  date: string
  administeredBy: string
  notes: string
  reactionsInput: string
  severity: string
}

export type CreateRecordPayload = {
  recordType: RecordType
  data: Record<string, unknown>
}