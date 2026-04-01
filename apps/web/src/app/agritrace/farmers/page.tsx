'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchFarmers, Farmer } from '@/lib/api'
import Link from 'next/link'
import { useState, useMemo } from 'react'

export default function FarmersPage() {
  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ['farmers'],
    queryFn: fetchFarmers,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name') // 'name', 'date', 'farms'
  const [sortOrder, setSortOrder] = useState('asc') // 'asc', 'desc'

  const filteredAndSorted = useMemo(() => {
    let result = [...farmers]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((f: Farmer) =>
        f.name.toLowerCase().includes(term) ||
        f.phone.includes(term) ||
        f.village.toLowerCase().includes(term)
      )
    }

    // Sort
    result.sort((a: Farmer, b: Farmer) => {
      let aVal = ''
      let bVal = ''

      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'date':
          aVal = new Date(a.createdAt).getTime().toString()
          bVal = new Date(b.createdAt).getTime().toString()
          break
        case 'farms':
          aVal = (a.farms?.length ?? 0).toString()
          bVal = (b.farms?.length ?? 0).toString()
          break
        default:
          aVal = a.name
          bVal = b.name
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return result
  }, [farmers, searchTerm, sortBy, sortOrder])

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-white mb-1">Farmers</h1>
      <p className="text-gray-500 text-sm mb-6">All registered farmers across the network</p>

      {/* Search and Filter Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search by name, phone, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e2028] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#F9D548]/50 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#1e2028] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-[#F9D548]/50 focus:outline-none transition-colors"
          >
            <option value="name">Sort by: Name</option>
            <option value="date">Sort by: Date Registered</option>
            <option value="farms">Sort by: Number of Farms</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full bg-[#1e2028] border border-white/10 rounded px-4 py-2.5 text-sm text-white hover:border-[#F9D548]/50 transition-colors font-medium"
          >
            Order: {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </div>

      <div className="bg-[#1e2028] rounded-xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-gray-500 text-sm">Loading farmers...</div>
        ) : farmers.length === 0 ? (
          <div className="p-8 text-gray-500 text-sm">No farmers registered yet. Farmers register via USSD.</div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="p-8 text-gray-500 text-sm">No farmers match your search criteria.</div>
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
              {filteredAndSorted.map((f: Farmer) => (
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
