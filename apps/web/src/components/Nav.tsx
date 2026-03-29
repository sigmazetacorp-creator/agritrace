import Link from 'next/link'

export function Nav() {
  return (
    <nav className="bg-green-800 text-white px-6 py-3 flex items-center gap-8">
      <span className="font-bold text-lg tracking-tight">AgriTrace</span>
      <Link href="/" className="text-green-200 hover:text-white text-sm">Dashboard</Link>
      <Link href="/farmers" className="text-green-200 hover:text-white text-sm">Farmers</Link>
      <Link href="/harvests" className="text-green-200 hover:text-white text-sm">Harvests</Link>
      <Link href="/advisory" className="text-green-200 hover:text-white text-sm">AI Advisory</Link>
    </nav>
  )
}
