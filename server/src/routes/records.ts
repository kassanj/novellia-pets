import { Router, Request } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { validate } from '../middleware/validate'

const router = Router({ mergeParams: true })

type RecordsParams = { petId?: string; id?: string }

type Record = {
  recordType: string
  data: AllergyData | VaccineData
}

type AllergyData = {
  name: string
  reactions: string[]
  severity: 'MILD' | 'MODERATE' | 'SEVERE'
  notes: string
}

type VaccineData = {
  name: string
  date: Date
  administeredBy: string
  notes: string
}

const VaccineSchema = z.object({
  recordType: z.literal('VACCINE'),
  data: z.object({
    name: z.string().min(1, 'Vaccine name is required'),
    date: z.string().min(1, 'Date is required'),
    administeredBy: z.string().optional(),
    notes: z.string().optional()
  })
})

const AllergySchema = z.object({
  recordType: z.literal('ALLERGY'),
  data: z.object({
    name: z.string().min(1, 'Allergy name is required'),
    reactions: z.array(z.string()).min(1, 'At least one reaction is required'),
    severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']),
    notes: z.string().optional()
  })
})

const RecordSchema = z.discriminatedUnion('recordType', [
  VaccineSchema,
  AllergySchema
])

// GET /api/pets/:petId/records
router.get('/', async (req: Request<RecordsParams>, res) => {
  try {
    const petId = (req.params as RecordsParams).petId
    if (!petId) {
      res.status(400).json({ error: 'petId is required' })
      return
    }

    const records = await prisma.medicalRecord.findMany({
      where: { petId },
      orderBy: { createdAt: 'desc' }
    })

    type RecordItem = (typeof records)[number]
    type GroupedByType = { [k: string]: RecordItem[] }
    
    const grouped = records.reduce(
      (acc: GroupedByType, record: RecordItem) => {
        const type = record.recordType
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push(record)
        return acc
      },
      {} as GroupedByType
    )

    res.json(grouped)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' })
  }
})

// POST /api/pets/:petId/records
router.post('/', validate(RecordSchema), async (req: Request<RecordsParams>, res) => {
  try {
    const petId = (req.params as RecordsParams).petId
    if (!petId) {
      res.status(400).json({ error: 'petId is required' })
      return
    }
    const record = await prisma.medicalRecord.create({
      data: {
        petId,
        recordType: req.body.recordType,
        data: req.body.data
      }
    })
    res.status(201).json(record)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create record', details: error instanceof Error ? error.message : 'Unknown error' })
    console.error('CREATE RECORD ERROR:', error)
  }
})


// PUT /api/records/:id  — note: this is mounted separately on the root router
router.put('/:id', async (req: Request<RecordsParams>, res) => {
  try {
    const id = (req.params as RecordsParams).id
    if (!id) {
      res.status(400).json({ error: 'ID is required' })
      return
    }
    const record = await prisma.medicalRecord.update({
      where: { id },
      data: { data: req.body.data }
    })
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record' })
  }
})

// DELETE /api/records/:id
router.delete('/:id', async (req: Request<RecordsParams>, res) => {
  try {
    const id = (req.params as RecordsParams).id
    const petId = (req.params as RecordsParams).petId
    if (!petId) {
      res.status(400).json({ error: 'Pet ID is required' })
      return
    }
    if (!id) {
      res.status(400).json({ error: 'ID is required' })
      return
    }
    await prisma.medicalRecord.delete({ where: { petId, id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record' })
  }
})

export default router