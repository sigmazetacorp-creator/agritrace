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
      <h1 className="text-3xl font-bold text-green-800 mb-1">Farmers</h1>
      <p className="text-green-600 text-sm mb-8">All registered farmers across the network</p>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-gray-400 text-sm">Loading farmers...</div>
        ) : farmers.length === 0 ? (
          <div className="p-8 text-gray-400 text-sm">
            No farmers registered yet. Farmers register via USSD by dialing the shortcode.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-green-50 text-gray-600">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Phone</th>
                <th className="text-left px-6 py-3">Village</th>
                <th className="text-left px-6 py-3">District</th>
                <th className="text-left px-6 py-3">Farms</th>
                <th className="text-left px-6 py-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((f: Farmer) => (
                <tr key={f.id} className="border-t hover:bg-green-50 transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/farmers/${f.id}`} className="font-medium text-green-700 hover:underline">
                      {f.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{f.phone}</td>
                  <td className="px-6 py-3 text-gray-600">{f.village}</td>
                  <td className="px-6 py-3 text-gray-600">{f.district}</td>
                  <td className="px-6 py-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      {f.farms?.length ?? 0} farm{f.farms?.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(f.createdAt).toLocaleDateString()}
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
