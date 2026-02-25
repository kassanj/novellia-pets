import { Field, Input } from '@chakra-ui/react'
import type { RecordFormState, FieldErrors } from '../types'

type Props = {
  form: RecordFormState
  errors: FieldErrors
  updateField: <K extends keyof RecordFormState>(key: K, value: RecordFormState[K]) => void
}

export default function VaccineFields({ form, errors, updateField }: Props) {
  return (
    <>
      <Field.Root mb="4" invalid={!!errors.date}>
        <Field.Label>Date</Field.Label>
        <Input
          type="date"
          value={form.date}
          onChange={e => updateField('date', e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
        {errors.date && <Field.ErrorText>{errors.date}</Field.ErrorText>}
      </Field.Root>

      <Field.Root mb="4">
        <Field.Label>Administered by (optional)</Field.Label>
        <Input
          value={form.administeredBy}
          onChange={e => updateField('administeredBy', e.target.value)}
          placeholder="Vet or clinic name"
        />
      </Field.Root>
    </>
  )
}