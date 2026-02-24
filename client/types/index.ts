export type Pet = {
  id: string
  name: string
  animalType: string
  ownerName: string
  dob: Date
}

export type Record = {
  id: string
  petId: string
  recordType: RecordType
  data: AllergyData | VaccineData
}   

export type RecordType = 'VACCINE' | 'ALLERGY'

// export type RecordData = {
//   name: string
//   date: Date
//   administeredBy: string
//   notes: string
// }

export type AllergyData = {
  name: string
  date?: Date
  administeredBy?: string
  reactions: string[]
  severity: 'MILD' | 'MODERATE' | 'SEVERE'
  notes: string
}

export type VaccineData = {
  name: string
  date: Date
  administeredBy: string
  reactions?: string[]
  severity?: 'MILD' | 'MODERATE' | 'SEVERE'
  notes: string
}
