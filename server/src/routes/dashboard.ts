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

    // Upcoming vaccines — those administered more than 30 days ago (due for renewal)
    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const allVaccines = await prisma.medicalRecord.findMany({
      where: {
        recordType: 'VACCINE'
      },
      include: { pet: true },
      orderBy: { createdAt: 'desc' }
    })

    const upcomingVaccines = allVaccines.filter((record: (typeof allVaccines)[number]) => {
      const data = record.data as { date?: string } | null
      if (!data?.date) return false
      const administeredDate = new Date(data.date)
      return administeredDate < thirtyDaysAgo
    })

    const severeAllergies = await prisma.medicalRecord.count({
      where: {
        recordType: 'ALLERGY',
        data: { path: '$.severity', equals: 'SEVERE' }
      }
    })

    // Pets with their last vaccine administered
    const petsWithRecords = await prisma.pet.findMany({
      include: {
        records: {
          where: { recordType: 'VACCINE' },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    type VaccineData = { date?: string; name?: string; administeredBy?: string }
    
    const petsWithLastVaccine = petsWithRecords.map((pet: (typeof petsWithRecords)[number]) => {
      const vaccines = pet.records as Array<{ id: string; data: VaccineData; createdAt: Date }>
      const lastVaccineRecord = vaccines.length > 0 ? vaccines.reduce((latest, r) => {
        const d = r.data?.date ? new Date(r.data.date).getTime() : new Date(r.createdAt).getTime()
        const latestTime = latest.data?.date ? new Date(latest.data.date).getTime() : new Date(latest.createdAt).getTime()
        return d > latestTime ? r : latest
      }, vaccines[0]) : null
      const lastVaccine = lastVaccineRecord?.data
        ? {
            name: (lastVaccineRecord.data as VaccineData).name,
            date: (lastVaccineRecord.data as VaccineData).date,
            administeredBy: (lastVaccineRecord.data as VaccineData).administeredBy
          }
        : null
      return {
        id: pet.id,
        name: pet.name,
        animalType: pet.animalType,
        ownerName: pet.ownerName,
        dob: pet.dob,
        lastVaccine
      }
    }).filter((p: { lastVaccine: { name?: string; date?: string } | null }) => p.lastVaccine != null)

    res.json({
      totalPets,
      petsByType: petsByType.map((p: { animalType: string; _count: { animalType: number } }) => ({
        type: p.animalType,
        count: p._count.animalType
      })),
      totalRecords,
      upcomingVaccines: upcomingVaccines,
      severeAllergies,
      petsWithLastVaccine,
      petsWithNoVaccine: petsWithRecords.filter((p: (typeof petsWithRecords)[number]) => p.records.length === 0)
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router