import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black">
      <Link href="/" className="text-white font-bold tracking-tight">
        Rewindify
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/songs" className="text-sm text-white/40 hover:text-white transition-colors">
          Songs
        </Link>
        <Link href="/artists" className="text-sm text-white/40 hover:text-white transition-colors">
          Artists
        </Link>
        <a href="/api/auth/signout" className="text-sm text-white/40 hover:text-white transition-colors">
          Sign out
        </a>
      </div>
    </nav>
  )
}
