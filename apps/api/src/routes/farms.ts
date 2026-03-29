import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

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
    const body = request.body as {
      farmerId: string
      name: string
      sizeHectares: number
      cropTypes?: string[]
      latitude?: number
      longitude?: number
    }
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
