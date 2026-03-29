'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchFarmers, fetchHarvests, Farmer, Harvest } from '@/lib/api'
import Link from 'next/link'

export default function HomePage() {
  const { data: farmers = [], isLoading: loadingFarmers } = useQuery({
    queryKey: ['farmers'],
    queryFn: fetchFarmers,
  })

  const { data: harvests = [], isLoading: loadingHarvests } = useQuery({
    queryKey: ['harvests'],
    queryFn: fetchHarvests,
  })

  const inTransit = harvests.flatMap(h => h.shipments ?? [])
    .filter(s => s.status === 'IN_TRANSIT').length

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-1">Dashboard</h1>
      <p className="text-green-600 mb-8 text-sm">Farm-to-fork traceability</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Registered Farmers"
          value={loadingFarmers ? '...' : farmers.length.toString()}
          sub="via USSD registration"
        />
        <StatCard
          title="Total Harvests"
          value={loadingHarvests ? '...' : harvests.length.toString()}
          sub="logged this season"
        />
        <StatCard
          title="Shipments In Transit"
          value={loadingHarvests ? '...' : inTransit.toString()}
          sub="currently active"
        />
      </div>

      {/* Recent Farmers */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-800">Recent Farmers</h2>
          <Link href="/farmers" className="text-sm text-green-600 hover:underline">View all</Link>
        </div>
        {loadingFarmers ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : farmers.length === 0 ? (
          <p className="text-gray-400 text-sm">No farmers registered yet. Farmers register via USSD.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Name</th>
                <th className="pb-2">Phone</th>
                <th className="pb-2">Village</th>
                <th className="pb-2">District</th>
                <th className="pb-2">Farms</th>
              </tr>
            </thead>
            <tbody>
              {farmers.slice(0, 5).map((f: Farmer) => (
                <tr key={f.id} className="border-b last:border-0 hover:bg-green-50">
                  <td className="py-2">
                    <Link href={`/farmers/${f.id}`} className="font-medium text-green-700 hover:underline">
                      {f.name}
                    </Link>
                  </td>
                  <td className="py-2 text-gray-600">{f.phone}</td>
                  <td className="py-2 text-gray-600">{f.village}</td>
                  <td className="py-2 text-gray-600">{f.district}</td>
                  <td className="py-2 text-gray-600">{f.farms?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Harvests */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-800">Recent Harvests</h2>
          <Link href="/harvests" className="text-sm text-green-600 hover:underline">View all</Link>
        </div>
        {loadingHarvests ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : harvests.length === 0 ? (
          <p className="text-gray-400 text-sm">No harvests logged yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">QR Code</th>
                <th className="pb-2">Crop</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Farmer</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {harvests.slice(0, 5).map((h: Harvest) => (
                <tr key={h.id} className="border-b last:border-0 hover:bg-green-50">
                  <td className="py-2 font-mono text-xs text-green-700">{h.qrCode ?? '—'}</td>
                  <td className="py-2">{h.cropType}</td>
                  <td className="py-2">{h.quantityKg} kg</td>
                  <td className="py-2 text-gray-600">{h.farm?.farmer?.name ?? '—'}</td>
                  <td className="py-2 text-gray-600">{new Date(h.harvestDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-green-700 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}
