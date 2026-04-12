export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTopTracks } from "@/lib/spotify"
import EraCard from "@/components/ui/EraCard"

export default async function PastStationPage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect("/")
  }

  const [shortTerm, mediumTerm, longTerm] = await Promise.all([
    getTopTracks(session.accessToken, "short_term"),
    getTopTracks(session.accessToken, "medium_term"),
    getTopTracks(session.accessToken, "long_term"),
  ])

  const shortIds = new Set(shortTerm.map((t) => t.id))
  const mediumIds = new Set(mediumTerm.map((t) => t.id))
  const longIds = new Set(longTerm.map((t) => t.id))

  const rising = shortTerm.filter((t) => !longIds.has(t.id))
  const timeless = shortTerm.filter((t) => mediumIds.has(t.id) && longIds.has(t.id))
  const fading = longTerm.filter((t) => !shortIds.has(t.id))

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Past Station</h1>
        <p className="text-white/50 text-sm">How your taste is shifting.</p>
      </div>

      <EraCard
        title="Rising"
        description="Songs you've been playing lately that weren't in your long-term rotation."
        tracks={rising}
        accent="text-green-400"
      />
      <EraCard
        title="Timeless"
        description="Songs that have been in your top tracks across all time periods."
        tracks={timeless}
        accent="text-violet-400"
      />
      <EraCard
        title="Fading"
        description="Songs you used to play constantly but have drifted away from."
        tracks={fading}
        accent="text-amber-400"
      />
    </main>
  )
}
