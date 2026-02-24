import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

router.get('/stats', async (req, res) => {
  try {
    const totalPets = await prisma.pet.count()

    const petsByType = await prisma.pet.groupBy({
      by: ['animalType'],
      _count: { animalType: true }
    })

    const totalRecords = await prisma.medicalRecord.count()

    // Upcoming vaccines — administered in the next 30 days
    const now = new Date()
    const in30Days = new Date()
    in30Days.setDate(now.getDate() + 30)

    const upcomingVaccines = await prisma.medicalRecord.findMany({
      where: {
        recordType: 'VACCINE'
      },
      include: { pet: true },
      orderBy: { createdAt: 'desc' }
    })

    const severeAllergies = await prisma.medicalRecord.count({
      where: {
        recordType: 'ALLERGY',
        data: { path: '$.severity', equals: 'SEVERE' }
      }
    })

    res.json({
      totalPets,
      petsByType: petsByType.map((p: { animalType: string; _count: { animalType: number } }) => ({
        type: p.animalType,
        count: p._count.animalType
      })),
      totalRecords,
      upcomingVaccines: upcomingVaccines.slice(0, 5),
      severeAllergies
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router