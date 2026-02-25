import { Field, Input, NativeSelect } from '@chakra-ui/react'
import { SEVERITY_OPTIONS } from '../constants'
import type { RecordFormState, FieldErrors } from '../types'

type Props = {
  form: RecordFormState
  errors: FieldErrors
  updateField: <K extends keyof RecordFormState>(key: K, value: RecordFormState[K]) => void
}

export default function AllergyFields({ form, errors, updateField }: Props) {
  return (
    <>
      <Field.Root mb="4" invalid={!!errors.reactions}>
        <Field.Label>Reactions (comma-separated)</Field.Label>
        <Input
          value={form.reactionsInput}
          onChange={e => updateField('reactionsInput', e.target.value)}
          placeholder="e.g. Hives, Rash, Itching"
        />
        {errors.reactions && <Field.ErrorText>{errors.reactions}</Field.ErrorText>}
      </Field.Root>

      <Field.Root mb="4" invalid={!!errors.severity}>
        <Field.Label>Severity</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            value={form.severity}
            onChange={e => updateField('severity', e.target.value)}
          >
            {SEVERITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
        {errors.severity && <Field.ErrorText>{errors.severity}</Field.ErrorText>}
      </Field.Root>
    </>
  )
}