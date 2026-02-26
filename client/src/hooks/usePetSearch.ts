import { useQuery } from '@tanstack/react-query'
import { getPets } from '../../lib/api'
import { useDebouncedValue } from './useDebouncedValue'
import type { AnimalTypeValue } from '../constants/pets'

export type PetsSearchParams = {
  search?: string
  type?: AnimalTypeValue
}

const DEBOUNCE_MS = 300

export const usePetsSearch = (params: PetsSearchParams = {}) => {
  const { search = '', type = '' } = params
  const debouncedSearch = useDebouncedValue(search.trim(), DEBOUNCE_MS)

  return useQuery({
    queryKey: ['pets', debouncedSearch, type],
    queryFn: () =>
      getPets(
        debouncedSearch || undefined,
        type || undefined,
      ),
  })
}