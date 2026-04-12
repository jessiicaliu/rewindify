export const dynamic = "force-dynamic"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTopTracks, getTopArtists } from "@/lib/spotify"
import EraCard from "@/components/ui/EraCard"
import ArtistEraCard from "@/components/ui/ArtistEraCard"

export default async function PastStationPage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect("/")
  }

  const [shortTerm, mediumTerm, longTerm, shortArtists, mediumArtists, longArtists] = await Promise.all([
    getTopTracks(session.accessToken, "short_term"),
    getTopTracks(session.accessToken, "medium_term"),
    getTopTracks(session.accessToken, "long_term"),
    getTopArtists(session.accessToken, "short_term"),
    getTopArtists(session.accessToken, "medium_term"),
    getTopArtists(session.accessToken, "long_term"),
  ])

  const shortIds = new Set(shortTerm.map((t) => t.id))
  const longIds = new Set(longTerm.map((t) => t.id))

  const rising = shortTerm.filter((t) => !longIds.has(t.id))
  const timeless = mediumTerm.filter((t) => longIds.has(t.id))
  const fading = longTerm.filter((t) => !shortIds.has(t.id))

  const shortArtistIds = new Set(shortArtists.map((a) => a.id))
  const longArtistIds = new Set(longArtists.map((a) => a.id))

  const risingArtists = shortArtists.filter((a) => !longArtistIds.has(a.id))
  const timelessArtists = mediumArtists.filter((a) => longArtistIds.has(a.id))
  const fadingArtists = longArtists.filter((a) => !shortArtistIds.has(a.id))

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Past Station</h1>
        <p className="text-white/50 text-sm">How your taste is shifting.</p>
      </div>

      <h2 className="text-xs uppercase tracking-widest text-white/30 mb-6">Songs</h2>
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

      <h2 className="text-xs uppercase tracking-widest text-white/30 mb-6 mt-4">Artists</h2>
      <ArtistEraCard
        title="Rising"
        description="Artists you've been into lately that weren't part of your long-term listening."
        artists={risingArtists}
        accent="text-green-400"
      />
      <ArtistEraCard
        title="Timeless"
        description="Artists you've consistently loved across all time periods."
        artists={timelessArtists}
        accent="text-violet-400"
      />
      <ArtistEraCard
        title="Fading"
        description="Artists you used to listen to a lot but have drifted from."
        artists={fadingArtists}
        accent="text-amber-400"
      />
    </main>
  )
}
