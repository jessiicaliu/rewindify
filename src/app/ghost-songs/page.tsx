import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTopTracks, getRecentlyPlayed } from "@/lib/spotify"
import { calculateGhostSongs, calculateAmnesiaScore } from "@/lib/ghost-algorithm"
import GhostSongsList from "@/components/GhostSongsList"
import AmnesiaScore from "@/components/AmnesiaScore"

export default async function GhostSongsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect("/")
  }

  const [longTerm, mediumTerm, recent] = await Promise.all([
    getTopTracks(session.accessToken, "long_term"),
    getTopTracks(session.accessToken, "medium_term"),
    getRecentlyPlayed(session.accessToken),
  ])

  const ghostSongs = calculateGhostSongs(longTerm, mediumTerm, recent)
  const amnesiaScore = calculateAmnesiaScore(longTerm.length, ghostSongs.length)

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Ghost Songs</h1>
        <p className="text-white/50 text-sm">Songs you loved and forgot.</p>
      </div>
      <AmnesiaScore score={amnesiaScore} />
      <GhostSongsList songs={ghostSongs} />
      {ghostSongs.length === 0 && (
        <p className="text-white/30 text-sm text-center py-16">
          No ghost songs found. Your memory is intact.
        </p>
      )}
    </main>
  )
}
