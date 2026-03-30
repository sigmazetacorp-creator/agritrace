'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchFarmers, fetchHarvests, Farmer, Harvest } from '@/lib/api'
import Link from 'next/link'

export default function AgriTraceDashboard() {
  const { data: farmers = [], isLoading: loadingFarmers } = useQuery({
    queryKey: ['farmers'],
    queryFn: fetchFarmers,
  })
  const { data: harvests = [], isLoading: loadingHarvests } = useQuery({
    queryKey: ['harvests'],
    queryFn: fetchHarvests,
  })

  const inTransit = harvests.flatMap(h => h.shipments ?? []).filter(s => s.status === 'IN_TRANSIT').length
  const blockchainVerified = harvests.filter(h => h.blockchainTxHash).length

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-white mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Farm-to-fork traceability — powered by QLF Group</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Registered Farmers', value: loadingFarmers ? '...' : farmers.length, sub: 'via USSD' },
          { label: 'Total Harvests', value: loadingHarvests ? '...' : harvests.length, sub: 'logged this season' },
          { label: 'Shipments In Transit', value: loadingHarvests ? '...' : inTransit, sub: 'currently active' },
          { label: 'On-Chain Records', value: loadingHarvests ? '...' : blockchainVerified, sub: 'Polygon Amoy' },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e2028] rounded-xl border border-white/10 p-5">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-extrabold text-[#F9D548]">{s.value}</p>
            <p className="text-xs text-gray-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Farmers */}
        <div className="bg-[#1e2028] rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Recent Farmers</h2>
            <Link href="/agritrace/farmers" className="text-xs text-[#F9D548] hover:underline">View all</Link>
          </div>
          {loadingFarmers ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : farmers.length === 0 ? (
            <p className="text-gray-500 text-sm">No farmers registered yet.</p>
          ) : (
            <div className="space-y-3">
              {farmers.slice(0, 5).map((f: Farmer) => (
                <div key={f.id} className="flex items-center justify-between text-sm">
                  <div>
                    <Link href={`/agritrace/farmers/${f.id}`} className="font-medium text-white hover:text-[#F9D548]">
                      {f.name}
                    </Link>
                    <p className="text-gray-500 text-xs">{f.village}, {f.district}</p>
                  </div>
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                    {f.farms?.length ?? 0} farm{f.farms?.length !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Harvests */}
        <div className="bg-[#1e2028] rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Recent Harvests</h2>
            <Link href="/agritrace/harvests" className="text-xs text-[#F9D548] hover:underline">View all</Link>
          </div>
          {loadingHarvests ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : harvests.length === 0 ? (
            <p className="text-gray-500 text-sm">No harvests logged yet.</p>
          ) : (
            <div className="space-y-3">
              {harvests.slice(0, 5).map((h: Harvest) => (
                <div key={h.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-white">{h.cropType} — {h.quantityKg} kg</p>
                    <p className="text-gray-500 text-xs">{h.farm?.farmer?.name ?? '—'} · {new Date(h.harvestDate).toLocaleDateString()}</p>
                  </div>
                  {h.blockchainTxHash ? (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">On-chain</span>
                  ) : (
                    <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">Pending</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
