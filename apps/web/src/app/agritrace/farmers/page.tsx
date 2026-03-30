'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchFarmers, Farmer } from '@/lib/api'
import Link from 'next/link'

export default function FarmersPage() {
  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ['farmers'],
    queryFn: fetchFarmers,
  })

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-white mb-1">Farmers</h1>
      <p className="text-gray-500 text-sm mb-8">All registered farmers across the network</p>

      <div className="bg-[#1e2028] rounded-xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-gray-500 text-sm">Loading farmers...</div>
        ) : farmers.length === 0 ? (
          <div className="p-8 text-gray-500 text-sm">No farmers registered yet. Farmers register via USSD.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Village</th>
                <th className="px-6 py-4">District</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Farms</th>
                <th className="px-6 py-4">Registered</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((f: Farmer) => (
                <tr key={f.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/agritrace/farmers/${f.id}`} className="font-medium text-white hover:text-[#F9D548] transition-colors">
                      {f.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-gray-400">{f.phone}</td>
                  <td className="px-6 py-3 text-gray-400">{f.village}</td>
                  <td className="px-6 py-3 text-gray-400">{f.district}</td>
                  <td className="px-6 py-3">
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300">{f.country}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs bg-[#F9D548]/10 text-[#F9D548] px-2 py-0.5 rounded-full">
                      {f.farms?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
