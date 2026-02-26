export const ANIMAL_TYPES = [
    { value: '', label: 'Select type' },
    { value: 'Dog', label: 'Dog' },
    { value: 'Cat', label: 'Cat' },
    { value: 'Bird', label: 'Bird' },
    { value: 'Rabbit', label: 'Rabbit' },
    { value: 'Fish', label: 'Fish' },
    { value: 'Lizard', label: 'Lizard' },
    { value: 'Snake', label: 'Snake' },
    { value: 'Turtle', label: 'Turtle' },
    { value: 'Hamster', label: 'Hamster' },
    { value: 'Guinea Pig', label: 'Guinea Pig' },
    { value: 'Rat', label: 'Rat' },
    { value: 'Mouse', label: 'Mouse' },
    { value: 'Ferret', label: 'Ferret' },
    { value: 'Other', label: 'Other' },
  ] as const
  
  export type AnimalTypeValue = (typeof ANIMAL_TYPES)[number]['value']

