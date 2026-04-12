import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { createFarmSchema, validateInput, type CreateFarmInput } from '../lib/validation'

const prisma = new PrismaClient()

export async function farmRoutes(app: FastifyInstance) {
  // GET /api/farms — list all farms
  app.get('/', async () => {
    return prisma.farm.findMany({
      include: { farmer: true, harvests: true },
      orderBy: { createdAt: 'desc' }
    })
  })

  // POST /api/farms — create a farm (used by cooperative agents)
  app.post('/', async (request, reply) => {
    const validation = validateInput<CreateFarmInput>(createFarmSchema, request.body)

    if (!validation.valid) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: validation.errors
      })
    }

    const body = validation.data
    const farm = await prisma.farm.create({
      data: {
        farmerId: body.farmerId,
        name: body.name,
        sizeHectares: body.sizeHectares,
        cropTypes: body.cropTypes ?? [],
        latitude: body.latitude,
        longitude: body.longitude,
      }
    })
    return reply.status(201).send(farm)
  })
}
