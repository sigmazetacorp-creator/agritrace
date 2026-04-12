import { z } from 'zod'

// USSD input validation schemas
export const farmerNameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

export const villageSchema = z.string()
  .min(2, 'Village name must be at least 2 characters')
  .max(50, 'Village name must be less than 50 characters')

export const districtSchema = z.string()
  .min(2, 'District name must be at least 2 characters')
  .max(50, 'District name must be less than 50 characters')

export const cropTypeSchema = z.string()
  .min(2, 'Crop type must be at least 2 characters')
  .max(50, 'Crop type must be less than 50 characters')

export const quantitySchema = z.string()
  .refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Quantity must be a positive number'
  )
  .refine(
    (val) => parseFloat(val) <= 100000,
    'Quantity must be less than 100000 kg'
  )

export const farmIndexSchema = z.string()
  .refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
    'Please select a valid farm number'
  )

/**
 * Validates USSD input safely
 */
export function validateUSSDInput(
  schema: z.ZodSchema,
  value: string
): { valid: true; data: string } | { valid: false; error: string } {
  if (!value || !value.trim()) {
    return { valid: false, error: 'Input cannot be empty' }
  }

  const result = schema.safeParse(value.trim())
  if (result.success) {
    return { valid: true, data: result.data as string }
  }

  // Return first error
  const issue = result.error.issues[0] as z.ZodIssue
  return { valid: false, error: issue.message }
}
