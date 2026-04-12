'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchFarmers, Farm, Farmer } from '@/lib/api'
import axios from 'axios'

export default function NewHarvestPage() {
  const router = useRouter()
  const { data: farmers = [] } = useQuery({
    queryKey: ['farmers'],
    queryFn: fetchFarmers,
  })

  const [formData, setFormData] = useState({
    farmId: '',
    cropType: '',
    quantityKg: '',
    harvestDate: new Date().toISOString().split('T')[0],
    qualityGrade: 'A',
    notes: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)

  // Get available farms when farmer is selected
  const availableFarms = farmers
    .flatMap((f: Farmer) => (f.farms || []).map(farm => ({ ...farm, farmerName: f.name })))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const farmId = e.target.value
    setFormData(prev => ({ ...prev, farmId }))
    const farm = availableFarms.find((f: any) => f.id === farmId)
    setSelectedFarm(farm || null)
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.farmId) newErrors.farmId = 'Farm is required'
    if (!formData.cropType.trim()) newErrors.cropType = 'Crop type is required'
    if (!formData.quantityKg) newErrors.quantityKg = 'Quantity is required'
    else if (isNaN(parseFloat(formData.quantityKg)) || parseFloat(formData.quantityKg) <= 0) {
      newErrors.quantityKg = 'Quantity must be a positive number'
    }
    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required'
    else if (new Date(formData.harvestDate) > new Date()) {
      newErrors.harvestDate = 'Harvest date cannot be in the future'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      })

      const response = await api.post('/api/harvests', {
        farmId: formData.farmId,
        cropType: formData.cropType,
        quantityKg: parseFloat(formData.quantityKg),
        harvestDate: new Date(formData.harvestDate).toISOString(),
        qualityGrade: formData.qualityGrade,
        notes: formData.notes || undefined,
      })

      if (response.status === 201) {
        setMessage({
          type: 'success',
          text: `Harvest logged successfully! QR Code: ${response.data.qrCode}`,
        })
        setTimeout(() => {
          router.push('/agritrace/harvests')
        }, 2000)
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to log harvest. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Log Harvest</h1>
        <p className="text-gray-500 text-sm">Record a new harvest and generate QR code for traceability</p>
      </div>

      <div className="bg-[#1e2028] rounded-xl border border-white/10 p-8">
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-900/30 border border-green-600 text-green-100'
                : 'bg-red-900/30 border border-red-600 text-red-100'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farm Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Farm *</label>
            <select
              name="farmId"
              value={formData.farmId}
              onChange={handleFarmChange}
              className={`w-full bg-[#181A20] border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                errors.farmId
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-[#F9D548]/50'
              }`}
            >
              <option value="">Choose a farm...</option>
              {availableFarms.map((farm: any) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name} ({farm.farmerName})
                </option>
              ))}
            </select>
            {errors.farmId && <p className="text-red-400 text-sm mt-1">{errors.farmId}</p>}
          </div>

          {/* Show farm details if selected */}
          {selectedFarm && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400">
                <span className="text-gray-300 font-medium">Size:</span> {selectedFarm.sizeHectares} hectares
              </p>
              {selectedFarm.cropTypes && selectedFarm.cropTypes.length > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  <span className="text-gray-300 font-medium">Crops:</span> {selectedFarm.cropTypes.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Crop Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Crop Type *</label>
            <input
              type="text"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              placeholder="e.g., Sesame Seeds, Ginger, Hibiscus"
              className={`w-full bg-[#181A20] border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${
                errors.cropType
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-[#F9D548]/50'
              }`}
            />
            {errors.cropType && <p className="text-red-400 text-sm mt-1">{errors.cropType}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity (kg) *</label>
            <input
              type="number"
              name="quantityKg"
              value={formData.quantityKg}
              onChange={handleChange}
              placeholder="1000"
              min="0"
              step="0.01"
              className={`w-full bg-[#181A20] border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${
                errors.quantityKg
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-[#F9D548]/50'
              }`}
            />
            {errors.quantityKg && <p className="text-red-400 text-sm mt-1">{errors.quantityKg}</p>}
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Harvest Date *</label>
            <input
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              className={`w-full bg-[#181A20] border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                errors.harvestDate
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-[#F9D548]/50'
              }`}
            />
            {errors.harvestDate && <p className="text-red-400 text-sm mt-1">{errors.harvestDate}</p>}
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quality Grade</label>
            <select
              name="qualityGrade"
              value={formData.qualityGrade}
              onChange={handleChange}
              className="w-full bg-[#181A20] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F9D548]/50 focus:outline-none transition-colors"
            >
              <option value="A">Grade A - Premium</option>
              <option value="B">Grade B - Standard</option>
              <option value="C">Grade C - Lower</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes about the harvest (weather, conditions, etc.)"
              rows={4}
              className="w-full bg-[#181A20] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#F9D548]/50 focus:outline-none resize-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#F9D548] text-[#181A20] rounded-lg font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging Harvest...' : 'Log Harvest'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:border-white/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-3">
            <span className="font-semibold text-gray-400">What happens next:</span>
          </p>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex gap-2">
              <span className="text-[#F9D548]">•</span>
              <span>A unique QR code will be generated for this harvest</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#F9D548]">•</span>
              <span>This harvest will be recorded on the Polygon blockchain for immutability</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#F9D548]">•</span>
              <span>Buyers can scan the QR code to verify authenticity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
