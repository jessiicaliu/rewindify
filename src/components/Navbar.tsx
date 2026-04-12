"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const pathname = usePathname()
  const { status } = useSession()
  const isAuth = status === "authenticated"

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black">
      <Link href="/" className="text-white font-bold tracking-tight">
        Rewindify
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/ghost-songs"
          className={`text-sm transition-colors ${
            pathname === "/ghost-songs" ? "text-white" : "text-white/40 hover:text-white"
          }`}
        >
          Ghost Songs
        </Link>
        <Link
          href="/past-station"
          className={`text-sm transition-colors ${
            pathname === "/past-station" ? "text-white" : "text-white/40 hover:text-white"
          }`}
        >
          Past Station
        </Link>
        {isAuth && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Sign out
          </button>
        )}
      </div>
    </nav>
  )
}
