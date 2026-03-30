'use client'

import { useState } from 'react'
import { fetchHarvestByQr, Harvest } from '@/lib/api'

export default function VerifyPage() {
  const [qrCode, setQrCode] = useState('')
  const [result, setResult] = useState<Harvest | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!qrCode.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await fetchHarvestByQr(qrCode.trim())
      setResult(data)
    } catch {
      setError('No harvest found for this QR code. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Verify a Harvest</h1>
        <p className="text-gray-400">Enter the QR code from a QLF commodity bag to verify its origin and authenticity.</p>
      </div>

      <form onSubmit={handleVerify} className="flex gap-3 mb-8">
        <input
          type="text"
          value={qrCode}
          onChange={e => setQrCode(e.target.value)}
          placeholder="e.g. AGT-1711234567890"
          className="flex-1 bg-[#1e2028] border border-white/10 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#F9D548]/50 text-sm font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Checking...' : 'Verify'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-[#1e2028] rounded-xl border border-[#F9D548]/30 p-6 space-y-5">
          {/* Verified badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center text-xl">✅</div>
            <div>
              <p className="font-bold text-white">Harvest Verified</p>
              <p className="text-xs text-gray-500">This record is authentic and traceable</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="QR Code" value={result.qrCode ?? '—'} mono />
            <InfoRow label="Crop Type" value={result.cropType} />
            <InfoRow label="Quantity" value={`${result.quantityKg} kg`} />
            <InfoRow label="Harvest Date" value={new Date(result.harvestDate).toLocaleDateString()} />
            {result.qualityGrade && <InfoRow label="Quality Grade" value={`Grade ${result.qualityGrade}`} />}
            {result.farm?.name && <InfoRow label="Farm" value={result.farm.name} />}
            {result.farm?.farmer?.name && <InfoRow label="Farmer" value={result.farm.farmer.name} />}
            {result.farm?.farmer?.village && (
              <InfoRow label="Location" value={`${result.farm.farmer.village}, ${result.farm.farmer.district}`} />
            )}
          </div>

          {result.blockchainTxHash ? (
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Blockchain Record</p>
              <p className="font-mono text-xs text-green-400 break-all">{result.blockchainTxHash}</p>
              <p className="text-xs text-gray-600 mt-1">Recorded on Polygon Amoy — immutable and tamper-proof</p>
            </div>
          ) : (
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-gray-500">Blockchain record pending confirmation</p>
            </div>
          )}
        </div>
      )}

      {/* How it works */}
      {!result && !error && (
        <div className="mt-12 bg-[#1e2028] rounded-xl border border-white/10 p-6">
          <p className="font-bold text-white mb-4">How it works</p>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex gap-3">
              <span className="text-[#F9D548] font-bold shrink-0">1.</span>
              <p>Farmers log their harvest via USSD — a unique QR code is assigned to each batch.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#F9D548] font-bold shrink-0">2.</span>
              <p>The harvest data is hashed and recorded on the Polygon blockchain — making it tamper-proof.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#F9D548] font-bold shrink-0">3.</span>
              <p>Buyers enter the QR code here to verify the origin, farmer, and quantity of their purchase.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-white font-medium ${mono ? 'font-mono text-xs text-[#F9D548]' : ''}`}>{value}</p>
    </div>
  )
}
