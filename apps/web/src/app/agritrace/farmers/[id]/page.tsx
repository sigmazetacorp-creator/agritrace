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
  if (isError || !farmer) return <div className="text-red-400 text-sm p-4">Farmer not found.</div>

  const allHarvests = farmer.farms.flatMap(f => f.harvests ?? [])

  return (
    <div>
      <Link href="/agritrace/farmers" className="text-sm text-[#F9D548] hover:underline mb-6 block">
        &larr; Back to Farmers
      </Link>

      {/* Header */}
      <div className="bg-[#1e2028] rounded-xl border border-white/10 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{farmer.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{farmer.phone}</p>
          </div>
          <span className="text-xs bg-[#F9D548]/10 text-[#F9D548] px-3 py-1 rounded-full font-semibold">
            {farmer.country}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Village', value: farmer.village },
            { label: 'District', value: farmer.district },
            { label: 'National ID', value: farmer.nationalId ?? '—' },
            { label: 'Registered', value: new Date(farmer.createdAt).toLocaleDateString() },
          ].map(i => (
            <div key={i.label}>
              <p className="text-xs text-gray-500 mb-1">{i.label}</p>
              <p className="text-sm font-medium text-white">{i.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Farms */}
      <div className="bg-[#1e2028] rounded-xl border border-white/10 p-6 mb-6">
        <h2 className="font-bold text-white mb-4">Farms ({farmer.farms.length})</h2>
        {farmer.farms.length === 0 ? (
          <p className="text-gray-500 text-sm">No farms registered. Contact a cooperative agent.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmer.farms.map(farm => (
              <div key={farm.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                <p className="font-medium text-white">{farm.name}</p>
                <p className="text-sm text-gray-500 mt-1">{farm.sizeHectares} hectares</p>
                {farm.cropTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {farm.cropTypes.map(crop => (
                      <span key={crop} className="bg-[#F9D548]/10 text-[#F9D548] text-xs px-2 py-0.5 rounded-full">
                        {crop}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {(farm.harvests ?? []).length} harvest{(farm.harvests ?? []).length !== 1 ? 's' : ''} logged
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Harvest History */}
      <div className="bg-[#1e2028] rounded-xl border border-white/10 p-6">
        <h2 className="font-bold text-white mb-4">Harvest History ({allHarvests.length})</h2>
        {allHarvests.length === 0 ? (
          <p className="text-gray-500 text-sm">No harvests logged yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="pb-3">QR Code</th>
                <th className="pb-3">Crop</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Grade</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Chain</th>
              </tr>
            </thead>
            <tbody>
              {allHarvests.map((h: Harvest) => (
                <tr key={h.id} className="border-t border-white/5">
                  <td className="py-2 font-mono text-xs text-[#F9D548]">{h.qrCode ?? '—'}</td>
                  <td className="py-2 text-white">{h.cropType}</td>
                  <td className="py-2 text-gray-400">{h.quantityKg} kg</td>
                  <td className="py-2">
                    {h.qualityGrade
                      ? <span className="bg-blue-400/10 text-blue-400 text-xs px-2 py-0.5 rounded-full">Grade {h.qualityGrade}</span>
                      : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="py-2 text-gray-500 text-xs">{new Date(h.harvestDate).toLocaleDateString()}</td>
                  <td className="py-2">
                    {h.blockchainTxHash
                      ? <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Verified</span>
                      : <span className="text-xs text-gray-600">Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
