import { z } from 'zod'

// Farmer validation schemas
export const createFarmerSchema = z.object({
  phone: z.string().min(1, 'Phone is required').regex(/^\+?\d{7,15}$/, 'Invalid phone format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  village: z.string().min(1, 'Village is required').max(100),
  district: z.string().min(1, 'District is required').max(100),
  country: z.string().max(3).optional(),
  nationalId: z.string().max(50).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

export type CreateFarmerInput = z.infer<typeof createFarmerSchema>

// Farm validation schemas
export const createFarmSchema = z.object({
  farmerId: z.string().min(1, 'Farmer ID is required'),
  name: z.string().min(2, 'Farm name must be at least 2 characters').max(100),
  sizeHectares: z.number().positive('Farm size must be positive'),
  cropTypes: z.array(z.string()).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

export type CreateFarmInput = z.infer<typeof createFarmSchema>

// Harvest validation schemas
export const createHarvestSchema = z.object({
  farmId: z.string().min(1, 'Farm ID is required'),
  cropType: z.string().min(1, 'Crop type is required').max(100),
  quantityKg: z.number().positive('Quantity must be positive'),
  harvestDate: z.string().datetime('Invalid harvest date format'),
  qualityGrade: z.enum(['A', 'B', 'C']).optional(),
  notes: z.string().max(1000).optional().nullable(),
})

export type CreateHarvestInput = z.infer<typeof createHarvestSchema>

// Utility function for validation with error response
export function validateInput<T>(schema: z.ZodSchema, data: unknown): { valid: true; data: T } | { valid: false; errors: { field: string; message: string }[] } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { valid: true, data: result.data as T }
  }
  return {
    valid: false,
    errors: result.error.issues.map((issue: z.ZodIssue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }))
  }
}

