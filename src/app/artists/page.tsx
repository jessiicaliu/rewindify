export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTopArtists } from "@/lib/spotify"
import { calculateGhostArtists } from "@/lib/ghost-algorithm"
import ArtistEraCard from "@/components/ui/ArtistEraCard"

export default async function ArtistsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect("/")
  }

  const [shortArtists, mediumArtists, longArtists] = await Promise.all([
    getTopArtists(session.accessToken, "short_term"),
    getTopArtists(session.accessToken, "medium_term"),
    getTopArtists(session.accessToken, "long_term"),
  ])

  const shortIds = new Set(shortArtists.map((a) => a.id))
  const mediumIds = new Set(mediumArtists.map((a) => a.id))
  const longIds = new Set(longArtists.map((a) => a.id))

  const rising = shortArtists.filter((a) => !longIds.has(a.id))
  const timeless = longArtists.filter((a) => !mediumIds.has(a.id) && !shortIds.has(a.id))
  const fading = longArtists.filter((a) => mediumIds.has(a.id) && !shortIds.has(a.id))
  const ghosts = calculateGhostArtists(longArtists, shortArtists)

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Artists</h1>
        <p className="text-white/50 text-sm">How your artist taste is shifting.</p>
      </div>

      <ArtistEraCard
        title="Rising"
        description="Artists you've been into lately that weren't part of your long-term listening."
        artists={rising}
        accent="text-green-400"
      />
      <ArtistEraCard
        title="Timeless"
        description="Artists so embedded in your history they're in your all-time top without recent listening."
        artists={timeless}
        accent="text-violet-400"
      />
      <ArtistEraCard
        title="Fading"
        description="Artists still in your recent rotation but slipping out of your current listening."
        artists={fading}
        accent="text-amber-400"
      />

      {ghosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xs uppercase tracking-widest text-white/30 mb-6">Ghost Artists</h2>
          <ArtistEraCard
            title="Artists You Forgot"
            description="Artists who were in your all-time top but have vanished from your recent listening."
            artists={ghosts}
            accent="text-rose-400"
          />
        </div>
      )}
    </main>
  )
}
