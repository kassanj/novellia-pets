import { useQuery } from '@tanstack/react-query'
import { getPets } from '../../lib/api'
import { useDebouncedValue } from './useDebouncedValue'

export type PetsSearchParams = {
  search?: string
}

const DEBOUNCE_MS = 300

export function usePetsSearch(params: PetsSearchParams = {}) {
  const { search = '' } = params
  const debouncedSearch = useDebouncedValue(search.trim(), DEBOUNCE_MS)

  return useQuery({
    queryKey: ['pets', debouncedSearch],
    queryFn: () =>
      getPets(
        debouncedSearch || undefined,
      ),
  })
}