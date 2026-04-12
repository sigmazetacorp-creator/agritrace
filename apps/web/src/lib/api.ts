import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
})

export interface Farmer {
  id: string
  phone: string
  name: string
  nationalId: string | null
  village: string
  district: string
  country: string
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
  farms: Farm[]
}

export interface Farm {
  id: string
  farmerId: string
  name: string
  sizeHectares: number
  cropTypes: string[]
  latitude: number | null
  longitude: number | null
  createdAt: string
  harvests?: Harvest[]
}

export interface Harvest {
  id: string
  farmId: string
  cropType: string
  quantityKg: number
  harvestDate: string
  qualityGrade: string | null
  notes: string | null
  qrCode: string | null
  blockchainTxHash: string | null
  createdAt: string
  farm?: Farm & { farmer: Farmer }
  shipments?: Shipment[]
  certifications?: Certification[]
}

export interface Shipment {
  id: string
  harvestId: string
  origin: string
  destination: string
  carrier: string | null
  quantityKg: number
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  departedAt: string | null
  arrivedAt: string | null
  blockchainTxHash: string | null
  createdAt: string
}

export interface Certification {
  id: string
  type: string
  issuedBy: string
  issuedAt: string
  expiresAt: string | null
  documentUrl: string | null
}

export const fetchFarmers = async (): Promise<Farmer[]> => {
  const { data } = await api.get('/api/farmers')
  return data
}

export const fetchFarmer = async (id: string): Promise<Farmer> => {
  const { data } = await api.get(`/api/farmers/${id}`)
  return data
}

export const fetchHarvests = async (): Promise<Harvest[]> => {
  const { data } = await api.get('/api/harvests')
  return data
}

export const fetchHarvestByQr = async (qrCode: string): Promise<Harvest> => {
  const { data } = await api.get(`/api/harvests/qr/${qrCode}`)
  return data
}

export const createHarvest = async (harvestData: {
  farmId: string
  cropType: string
  quantityKg: number
  harvestDate: string
  qualityGrade?: string
  notes?: string
}): Promise<Harvest> => {
  const { data } = await api.post('/api/harvests', harvestData)
  return data
}
