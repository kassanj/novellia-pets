/**
 * Seed script: purges existing data and creates pets + medical records from the list below.
 * Run from server dir: npm run seed
 */
/// <reference types="node" />
require('dotenv').config()

const path = require('node:path')
const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) throw new Error('DATABASE_URL is not set')
const dbPath = dbUrl.startsWith('file:') ? dbUrl.slice(5) : dbUrl
const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath)
const adapter = new PrismaBetterSqlite3({ url: `file:${resolvedPath}` })
const prisma = new PrismaClient({ adapter })

// --- Data list: add or edit entries here ---

type VaccineEntry = {
  recordType: 'VACCINE'
  data: {
    name: string
    date: string // ISO date YYYY-MM-DD
    administeredBy?: string
    notes?: string
  }
}

type AllergyEntry = {
  recordType: 'ALLERGY'
  data: {
    name: string
    reactions: string[]
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
    notes?: string
  }
}

type RecordEntry = VaccineEntry | AllergyEntry

type PetEntry = {
  name: string
  animalType: string
  ownerName: string
  dob: string // ISO date YYYY-MM-DD
  records?: RecordEntry[]
}

const seedData: PetEntry[] = [
  {
    name: 'Buddy',
    animalType: 'Dog',
    ownerName: 'Jane Smith',
    dob: '2019-03-10',
    records: [
      { recordType: 'VACCINE', data: { name: 'Rabies', date: '2024-01-15', administeredBy: 'Dr. Lee', notes: 'Annual booster' } },
      { recordType: 'VACCINE', data: { name: 'DHPP', date: '2023-08-20', administeredBy: 'Dr. Lee', notes: '' } },
      { recordType: 'ALLERGY', data: { name: 'Chicken', reactions: ['Itching', 'Upset stomach'], severity: 'MILD', notes: 'Avoid chicken-based food' } }
    ]
  },
  {
    name: 'Whiskers',
    animalType: 'Cat',
    ownerName: 'Bob Chen',
    dob: '2020-07-22',
    records: [
      { recordType: 'VACCINE', data: { name: 'FVRCP', date: '2024-06-01', administeredBy: 'Dr. Park', notes: '' } },
      { recordType: 'VACCINE', data: { name: 'Rabies', date: '2024-05-10', administeredBy: 'Dr. Park', notes: '' } },
      { recordType: 'ALLERGY', data: { name: 'Pollen', reactions: ['Sneezing'], severity: 'MILD', notes: '' } }
    ]
  },
  {
    name: 'Nibbles',
    animalType: 'Rabbit',
    ownerName: 'Alex Rivera',
    dob: '2022-01-05',
    records: [
      { recordType: 'VACCINE', data: { name: 'RHDV', date: '2024-09-12', administeredBy: 'Dr. Lee', notes: 'Rabbit hemorrhagic disease' } },
      { recordType: 'ALLERGY', data: { name: 'Alfalfa', reactions: ['Digestive upset'], severity: 'MODERATE', notes: 'Limit alfalfa hay' } }
    ]
  },
  {
    name: 'Sunny',
    animalType: 'Bird',
    ownerName: 'Jordan Taylor',
    dob: '2021-11-18',
    records: [
      { recordType: 'ALLERGY', data: { name: 'Dust', reactions: ['Respiratory'], severity: 'MODERATE', notes: 'Keep cage clean' } }
    ]
  },
  {
    name: 'Shadow',
    animalType: 'Dog',
    ownerName: 'Sam Wilson',
    dob: '2018-05-30',
    records: [
      { recordType: 'VACCINE', data: { name: 'Rabies', date: '2023-12-01', administeredBy: 'Dr. Park', notes: 'Due for renewal' } },
      { recordType: 'VACCINE', data: { name: 'DHPP', date: '2023-12-01', administeredBy: 'Dr. Park', notes: '' } },
      { recordType: 'ALLERGY', data: { name: 'Bee sting', reactions: ['Swelling', 'Hives'], severity: 'SEVERE', notes: 'Epi on file' } }
    ]
  },
  {
    name: 'Mochi',
    animalType: 'Cat',
    ownerName: 'Casey Kim',
    dob: '2023-02-14',
    records: [
      { recordType: 'VACCINE', data: { name: 'FVRCP', date: '2024-03-01', administeredBy: 'Dr. Lee', notes: 'Kitten series' } },
      { recordType: 'VACCINE', data: { name: 'Rabies', date: '2024-03-15', administeredBy: 'Dr. Lee', notes: '' } }
    ]
  },
  {
    name: 'Goldie',
    animalType: 'Fish',
    ownerName: 'Riley Green',
    dob: '2022-06-01',
    records: []
  },
  {
    name: 'Spike',
    animalType: 'Lizard',
    ownerName: 'Morgan Davis',
    dob: '2020-09-09',
    records: [
      { recordType: 'ALLERGY', data: { name: 'Mite treatment', reactions: ['Skin irritation'], severity: 'MILD', notes: '' } }
    ]
  },
  {
    name: 'Oreo',
    animalType: 'Guinea Pig',
    ownerName: 'Taylor Brown',
    dob: '2023-04-20',
    records: [
      { recordType: 'VACCINE', data: { name: 'Vitamin C supplement', date: '2024-10-01', administeredBy: 'Owner', notes: 'Routine' } }
    ]
  },
  {
    name: 'Luna',
    animalType: 'Dog',
    ownerName: 'Jamie Fox',
    dob: '2021-08-12',
    records: [
      { recordType: 'VACCINE', data: { name: 'Rabies', date: '2024-08-01', administeredBy: 'Dr. Park', notes: '' } },
      { recordType: 'ALLERGY', data: { name: 'Grass', reactions: ['Paw licking'], severity: 'MILD', notes: '' } }
    ]
  }
]

// --- Purge and seed ---

async function main() {
  console.log('Purging existing data...')
  await prisma.medicalRecord.deleteMany({})
  await prisma.pet.deleteMany({})

  console.log('Creating pets and records...')
  for (const entry of seedData) {
    const pet = await prisma.pet.create({
      data: {
        name: entry.name,
        animalType: entry.animalType,
        ownerName: entry.ownerName,
        dob: new Date(entry.dob)
      }
    })
    const records = entry.records ?? []
    for (const rec of records) {
      await prisma.medicalRecord.create({
        data: {
          petId: pet.id,
          recordType: rec.recordType,
          data: rec.data as object
        }
      })
    }
    console.log(`  ${pet.name} (${pet.animalType}) + ${records.length} record(s)`)
  }

  console.log('Done.')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
