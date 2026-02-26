export type FieldErrors = {
    name?: string
    animalType?: string
    ownerName?: string
    dob?: string
  }
  
  export type PetFormState = {
    name: string
    animalType: string
    ownerName: string
    dob: string
  }
  
  import type { Pet as GlobalPet } from '../../types/index'

  export type PetModalProps = {
    open: boolean
    onOpenChange: (details: { open: boolean }) => void
    onSuccess?: () => void
    pet: GlobalPet | null
  }

  /** Pet shape for form initialization (usePetModalForm accepts dob as Date or string). */
  export type Pet = GlobalPet