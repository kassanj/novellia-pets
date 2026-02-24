import { Router } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { validate } from '../middleware/validate'

const router = Router()

const PetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  animalType: z.string().min(1, 'Animal type is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  dob: z.coerce.date(),
//   dob: z.string().min(1, 'Date of birth is required')
})

// GET /api/pets — list all pets, supports ?search= and ?type=
router.get('/', async (req, res) => {
  try {
    const { search, type } = req.query

    const pets = await prisma.pet.findMany({
      where: {
        AND: [
          search ? { name: { contains: search as string } } : {},
          type ? { animalType: { equals: type as string } } : {}
        ]
      },
      include: { records: true },
      orderBy: { createdAt: 'desc' }
    })

    res.json(pets)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pets' })
  }
})

// GET /api/pets/:id — get a single pet with its records
router.get('/:id', async (req, res) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: req.params.id },
      include: { records: true }
    })

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' })
      return
    }

    res.json(pet)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pet' })
  }
})

// POST /api/pets — create a pet
router.post('/', validate(PetSchema), async (req, res) => {
    try {
      const pet = await prisma.pet.create({ data: req.body })
      res.status(201).json(pet)
    } catch (error) {
      console.error('CREATE PET ERROR:', error)
      res.status(500).json({ error: 'Failed to create pet' })
    }
  })

// PUT /api/pets/:id — update a pet
router.put('/:id', validate(PetSchema.partial()), async (req, res) => {
  try {
    const pet = await prisma.pet.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(pet)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pet' })
  }
})

// DELETE /api/pets/:id — delete a pet
router.delete('/:id', async (req, res) => {
  try {
    await prisma.pet.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pet' })
  }
})

export default router