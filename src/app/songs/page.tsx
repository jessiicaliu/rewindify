export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTopTracks, getRecentlyPlayed } from "@/lib/spotify"
import { calculateGhostSongs, calculateAmnesiaScore } from "@/lib/ghost-algorithm"
import { saveGhostSongs, getGhostSongs } from "@/lib/supabase"
import EraCard from "@/components/ui/EraCard"
import GhostSongsList from "@/components/GhostSongsList"
import StatCard from "@/components/ui/StatCard"

export default async function SongsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect("/")
  }

  const [shortTerm, mediumTerm, longTerm, recent] = await Promise.all([
    getTopTracks(session.accessToken, "short_term"),
    getTopTracks(session.accessToken, "medium_term"),
    getTopTracks(session.accessToken, "long_term"),
    getRecentlyPlayed(session.accessToken),
  ])

  const shortIds = new Set(shortTerm.map((t) => t.id))
  const mediumIds = new Set(mediumTerm.map((t) => t.id))
  const longIds = new Set(longTerm.map((t) => t.id))

  const rising = shortTerm.filter((t) => !longIds.has(t.id))
  const timeless = longTerm.filter((t) => !mediumIds.has(t.id) && !shortIds.has(t.id))
  const fading = longTerm.filter((t) => mediumIds.has(t.id) && !shortIds.has(t.id))

  const userId = session.user?.email ?? ""
  let ghostSongs = await getGhostSongs(userId).catch(() => [])
  if (ghostSongs.length === 0) {
    ghostSongs = calculateGhostSongs(longTerm, mediumTerm, recent)
    await saveGhostSongs(userId, ghostSongs).catch(() => {})
  }
  const amnesiaScore = calculateAmnesiaScore(longTerm.length, ghostSongs.length)

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Songs</h1>
        <p className="text-white/50 text-sm">How your song taste is shifting.</p>
      </div>

      <EraCard
        title="Rising"
        description="Songs you've been playing lately that weren't in your long-term rotation."
        tracks={rising}
        accent="text-green-400"
      />
      <EraCard
        title="Timeless"
        description="Songs so embedded in your history they're in your all-time top without recent plays."
        tracks={timeless}
        accent="text-violet-400"
      />
      <EraCard
        title="Fading"
        description="Songs still in your recent rotation but slipping out of your current listening."
        tracks={fading}
        accent="text-amber-400"
      />

      <div className="mt-12">
        <h2 className="text-xs uppercase tracking-widest text-white/30 mb-6">Ghost Songs</h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Analyzed" value={amnesiaScore.totalTracksAnalyzed} sub="all-time tracks" />
          <StatCard label="Forgotten" value={amnesiaScore.ghostCount} sub="ghost songs" />
          <StatCard label="Score" value={`${amnesiaScore.score}%`} sub="amnesia rate" />
        </div>
        <GhostSongsList songs={ghostSongs} />
        {ghostSongs.length === 0 && (
          <p className="text-white/30 text-sm text-center py-10">No ghost songs found. Your memory is intact.</p>
        )}
      </div>
    </main>
  )
}
