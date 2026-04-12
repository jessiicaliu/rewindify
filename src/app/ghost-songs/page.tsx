import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTopTracks, getTopArtists, getRecentlyPlayed } from "@/lib/spotify"
import { calculateGhostSongs, calculateGhostArtists, calculateAmnesiaScore } from "@/lib/ghost-algorithm"
import GhostSongsList from "@/components/GhostSongsList"
import AmnesiaScore from "@/components/AmnesiaScore"
import StatCard from "@/components/ui/StatCard"
import ArtistEraCard from "@/components/ui/ArtistEraCard"

export default async function GhostSongsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect("/")
  }

  const [longTerm, mediumTerm, recent, longArtists, shortArtists] = await Promise.all([
    getTopTracks(session.accessToken, "long_term"),
    getTopTracks(session.accessToken, "medium_term"),
    getRecentlyPlayed(session.accessToken),
    getTopArtists(session.accessToken, "long_term"),
    getTopArtists(session.accessToken, "short_term"),
  ])

  const ghostSongs = calculateGhostSongs(longTerm, mediumTerm, recent)
  const ghostArtists = calculateGhostArtists(longArtists, shortArtists)
  const amnesiaScore = calculateAmnesiaScore(longTerm.length, ghostSongs.length)

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Ghost Songs</h1>
        <p className="text-white/50 text-sm">Songs and artists you loved and forgot.</p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard label="Analyzed" value={amnesiaScore.totalTracksAnalyzed} sub="all-time tracks" />
        <StatCard label="Forgotten" value={amnesiaScore.ghostCount} sub="ghost songs" />
        <StatCard label="Score" value={`${amnesiaScore.score}%`} sub="amnesia rate" />
      </div>
      <AmnesiaScore score={amnesiaScore} />
      <GhostSongsList songs={ghostSongs} />
      {ghostSongs.length === 0 && (
        <p className="text-white/30 text-sm text-center py-16">
          No ghost songs found. Your memory is intact.
        </p>
      )}
      {ghostArtists.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xs uppercase tracking-widest text-white/30 mb-6">Ghost Artists</h2>
          <ArtistEraCard
            title="Artists You Forgot"
            description="Artists who were in your all-time top but have vanished from your recent listening."
            artists={ghostArtists}
            accent="text-rose-400"
          />
        </div>
      )}
    </main>
  )
}
