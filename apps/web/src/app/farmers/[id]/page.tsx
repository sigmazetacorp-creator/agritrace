'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchFarmer, Harvest } from '@/lib/api'
import Link from 'next/link'
import { use } from 'react'

export default function FarmerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data: farmer, isLoading, isError } = useQuery({
    queryKey: ['farmer', id],
    queryFn: () => fetchFarmer(id),
  })

  if (isLoading) return <div className="text-gray-400 text-sm p-4">Loading farmer...</div>
  if (isError || !farmer) return <div className="text-red-500 text-sm p-4">Farmer not found.</div>

  const allHarvests = farmer.farms.flatMap(f => f.harvests ?? [])

  return (
    <div>
      <Link href="/farmers" className="text-sm text-green-600 hover:underline mb-4 block">
        &larr; Back to Farmers
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-800">{farmer.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{farmer.phone}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
            {farmer.country}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Info label="Village" value={farmer.village} />
          <Info label="District" value={farmer.district} />
          <Info label="National ID" value={farmer.nationalId ?? '—'} />
          <Info label="Registered" value={new Date(farmer.createdAt).toLocaleDateString()} />
        </div>
      </div>

      {/* Farms */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Farms ({farmer.farms.length})
        </h2>
        {farmer.farms.length === 0 ? (
          <p className="text-gray-400 text-sm">No farms registered. Contact a cooperative agent to add farms.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmer.farms.map(farm => (
              <div key={farm.id} className="border rounded-lg p-4">
                <p className="font-medium text-green-800">{farm.name}</p>
                <p className="text-sm text-gray-500 mt-1">{farm.sizeHectares} hectares</p>
                {farm.cropTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {farm.cropTypes.map(crop => (
                      <span key={crop} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                        {crop}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {(farm.harvests ?? []).length} harvest{(farm.harvests ?? []).length !== 1 ? 's' : ''} logged
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Harvest History */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Harvest History ({allHarvests.length})
        </h2>
        {allHarvests.length === 0 ? (
          <p className="text-gray-400 text-sm">No harvests logged yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left pb-2">QR Code</th>
                <th className="text-left pb-2">Crop</th>
                <th className="text-left pb-2">Quantity</th>
                <th className="text-left pb-2">Grade</th>
                <th className="text-left pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {allHarvests.map((h: Harvest) => (
                <tr key={h.id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs text-green-700">{h.qrCode ?? '—'}</td>
                  <td className="py-2">{h.cropType}</td>
                  <td className="py-2">{h.quantityKg} kg</td>
                  <td className="py-2">
                    {h.qualityGrade ? (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        Grade {h.qualityGrade}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-2 text-gray-500">{new Date(h.harvestDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  )
}
