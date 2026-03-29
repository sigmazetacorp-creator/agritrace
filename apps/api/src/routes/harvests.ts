import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { hashHarvest, recordHarvestOnChain } from '../lib/blockchain'

const prisma = new PrismaClient()

export async function harvestRoutes(app: FastifyInstance) {
  // GET /api/harvests — list all harvests
  app.get('/', async () => {
    return prisma.harvest.findMany({
      include: { farm: { include: { farmer: true } } },
      orderBy: { harvestDate: 'desc' }
    })
  })

  // GET /api/harvests/:qrCode — lookup by QR code (used by buyers)
  app.get('/qr/:qrCode', async (request, reply) => {
    const { qrCode } = request.params as { qrCode: string }
    const harvest = await prisma.harvest.findUnique({
      where: { qrCode },
      include: {
        farm: { include: { farmer: true } },
        shipments: true,
        certifications: true
      }
    })
    if (!harvest) return reply.status(404).send({ error: 'Harvest not found' })
    return harvest
  })

  // POST /api/harvests — log a harvest (used by agents via web)
  app.post('/', async (request, reply) => {
    const body = request.body as {
      farmId: string
      cropType: string
      quantityKg: number
      harvestDate: string
      qualityGrade?: string
      notes?: string
    }

    const qrCode = `AGT-${Date.now()}`

    // Create in database first
    const harvest = await prisma.harvest.create({
      data: {
        ...body,
        harvestDate: new Date(body.harvestDate),
        qrCode,
      }
    })

    // Write to blockchain asynchronously (non-blocking — DB record is source of truth)
    const dataHash = hashHarvest({
      qrCode,
      cropType: body.cropType,
      quantityKg: body.quantityKg,
      farmId: body.farmId,
      harvestDate: body.harvestDate,
    })

    recordHarvestOnChain(qrCode, dataHash).then(async txHash => {
      if (txHash) {
        await prisma.harvest.updateMany({
          where: { id: harvest.id },
          data: { blockchainTxHash: txHash }
        })
      }
    }).catch(() => { /* record may have been deleted in tests */ })

    return reply.status(201).send(harvest)
  })
}
