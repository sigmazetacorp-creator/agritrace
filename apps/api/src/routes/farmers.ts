import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { createFarmerSchema, validateInput, type CreateFarmerInput } from '../lib/validation'

const prisma = new PrismaClient()

function countryFromPhone(phone: string): string {
  if (phone.startsWith('+234')) return 'NG'
  if (phone.startsWith('+254')) return 'KE'
  if (phone.startsWith('+255')) return 'TZ'
  if (phone.startsWith('+256')) return 'UG'
  if (phone.startsWith('+233')) return 'GH'
  return 'KE'
}

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
    const validation = validateInput<CreateFarmerInput>(createFarmerSchema, request.body)

    if (!validation.valid) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: validation.errors
      })
    }

    const body = validation.data
    const farmer = await prisma.farmer.create({
      data: { ...body, country: body.country ?? countryFromPhone(body.phone) }
    })
    return reply.status(201).send(farmer)
  })
}
