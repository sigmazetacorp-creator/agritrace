import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function farmerRoutes(app: FastifyInstance) {
  // GET /api/farmers — list all farmers
  app.get('/', async () => {
    return prisma.farmer.findMany({
      include: { farms: true },
      orderBy: { createdAt: 'desc' }
    })
  })

  // GET /api/farmers/:id — single farmer with full history
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const farmer = await prisma.farmer.findUnique({
      where: { id },
      include: {
        farms: {
          include: {
            harvests: {
              include: { shipments: true, certifications: true }
            }
          }
        }
      }
    })
    if (!farmer) return reply.status(404).send({ error: 'Farmer not found' })
    return farmer
  })

  // POST /api/farmers — create farmer (used by cooperative agents via web)
  app.post('/', async (request, reply) => {
    const body = request.body as {
      phone: string
      name: string
      village: string
      district: string
      nationalId?: string
      latitude?: number
      longitude?: number
    }
    const farmer = await prisma.farmer.create({ data: body })
    return reply.status(201).send(farmer)
  })
}
