'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchHarvests, Harvest } from '@/lib/api'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function HarvestsPage() {
  const { data: harvests = [], isLoading } = useQuery({
    queryKey: ['harvests'],
    queryFn: fetchHarvests,
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-1">Harvests</h1>
      <p className="text-green-600 text-sm mb-8">All logged harvests across all farms</p>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow p-8 text-gray-400 text-sm">Loading harvests...</div>
      ) : harvests.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-gray-400 text-sm">
          No harvests logged yet. Farmers log harvests via USSD option 2.
        </div>
      ) : (
        <div className="space-y-4">
          {harvests.map((h: Harvest) => (
            <div key={h.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-green-800">{h.cropType}</span>
                    {h.qualityGrade && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        Grade {h.qualityGrade}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {h.quantityKg} kg &middot; {new Date(h.harvestDate).toLocaleDateString()}
                    {h.farm?.farmer && (
                      <> &middot; <Link href={`/farmers/${h.farm.farmer.id}`} className="text-green-600 hover:underline">{h.farm.farmer.name}</Link></>
                    )}
                  </p>
                </div>

                {/* QR Code Badge */}
                {h.qrCode && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Trace ID</p>
                    <span className="font-mono text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border">
                      {h.qrCode}
                    </span>
                  </div>
                )}
              </div>

              {/* Shipments */}
              {h.shipments && h.shipments.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Shipments</p>
                  <div className="space-y-2">
                    {h.shipments.map(s => (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{s.origin} &rarr; {s.destination}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{s.quantityKg} kg</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[s.status]}`}>
                            {s.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {h.certifications && h.certifications.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {h.certifications.map(c => (
                    <span key={c.id} className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                      {c.type} &middot; {c.issuedBy}
                    </span>
                  ))}
                </div>
              )}

              {h.blockchainTxHash && (
                <p className="mt-3 text-xs text-gray-400 font-mono">
                  Tx: {h.blockchainTxHash}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
