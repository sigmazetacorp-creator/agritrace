'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchHarvests, Harvest } from '@/lib/api'
import Link from 'next/link'

export default function HarvestsPage() {
  const { data: harvests = [], isLoading } = useQuery({
    queryKey: ['harvests'],
    queryFn: fetchHarvests,
  })

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-white mb-1">Harvests</h1>
      <p className="text-gray-500 text-sm mb-8">All logged harvests across all farms</p>

      {isLoading ? (
        <div className="bg-[#1e2028] rounded-xl border border-white/10 p-8 text-gray-500 text-sm">Loading...</div>
      ) : harvests.length === 0 ? (
        <div className="bg-[#1e2028] rounded-xl border border-white/10 p-8 text-gray-500 text-sm">
          No harvests logged yet. Farmers log harvests via USSD option 2.
        </div>
      ) : (
        <div className="space-y-4">
          {harvests.map((h: Harvest) => (
            <div key={h.id} className="bg-[#1e2028] rounded-xl border border-white/10 p-5 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-white">{h.cropType}</span>
                    {h.qualityGrade && (
                      <span className="bg-blue-400/10 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                        Grade {h.qualityGrade}
                      </span>
                    )}
                    {h.blockchainTxHash && (
                      <span className="bg-green-400/10 text-green-400 text-xs px-2 py-0.5 rounded-full">On-chain</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {h.quantityKg} kg &middot; {new Date(h.harvestDate).toLocaleDateString()}
                    {h.farm?.farmer && (
                      <> &middot; <Link href={`/agritrace/farmers/${h.farm.farmer.id}`} className="text-[#F9D548] hover:underline">{h.farm.farmer.name}</Link></>
                    )}
                  </p>
                </div>
                {h.qrCode && (
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Trace ID</p>
                    <span className="font-mono text-xs bg-white/5 border border-white/10 text-[#F9D548] px-3 py-1.5 rounded">
                      {h.qrCode}
                    </span>
                  </div>
                )}
              </div>

              {h.shipments && h.shipments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Shipments</p>
                  <div className="space-y-2">
                    {h.shipments.map(s => (
                      <div key={s.id} className="flex items-center justify-between text-sm text-gray-400">
                        <span>{s.origin} → {s.destination} &middot; {s.quantityKg} kg</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          s.status === 'DELIVERED' ? 'bg-green-400/10 text-green-400' :
                          s.status === 'IN_TRANSIT' ? 'bg-blue-400/10 text-blue-400' :
                          s.status === 'PENDING' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-red-400/10 text-red-400'
                        }`}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {h.certifications && h.certifications.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {h.certifications.map(c => (
                    <span key={c.id} className="bg-purple-400/10 text-purple-400 text-xs px-2 py-0.5 rounded-full">
                      {c.type} · {c.issuedBy}
                    </span>
                  ))}
                </div>
              )}

              {h.blockchainTxHash && (
                <p className="mt-3 text-xs text-gray-600 font-mono truncate">
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
