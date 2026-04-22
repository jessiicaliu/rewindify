import { GhostSong, GhostArtist, Track, Artist, SpotifyRecentItem } from "@/types"

function getVanishReason(daysSinceHeard: number): string {
  if (daysSinceHeard < 30) return "Fading fast"
  if (daysSinceHeard < 90) return "Slow fade"
  if (daysSinceHeard < 180) return "Gone overnight"
  if (daysSinceHeard < 365) return "Vanished after a few months"
  return "Lost to time"
}

export function calculateGhostSongs(
  longTermTracks: Track[],
  mediumTermTracks: Track[],
  recentTracks: SpotifyRecentItem[]
): GhostSong[] {
  const recentIds = new Set(recentTracks.map((item) => item.track.id))
  const mediumIds = new Set(mediumTermTracks.map((t) => t.id))

  const lastPlayedAt = new Map<string, string>()
  for (const item of recentTracks) {
    const id = item.track.id
    if (!lastPlayedAt.has(id)) lastPlayedAt.set(id, item.played_at)
  }

  const now = Date.now()

  const ghosts = longTermTracks
    .filter((track) => mediumIds.has(track.id) && !recentIds.has(track.id))
    .map((track, index) => {
      const playedAt = lastPlayedAt.get(track.id)
      const daysSinceHeard = playedAt
        ? Math.floor((now - new Date(playedAt).getTime()) / 86_400_000)
        : 50 // outside the 50-play window, so at least ~50 days
      return {
        ...track,
        peakPosition: index + 1,
        daysSinceHeard,
        vanishReason: getVanishReason(daysSinceHeard),
      }
    })

  return ghosts.slice(0, 20)
}

export function calculateGhostArtists(
  longTermArtists: Artist[],
  shortTermArtists: Artist[]
): GhostArtist[] {
  const shortIds = new Set(shortTermArtists.map((a) => a.id))

  return longTermArtists
    .filter((artist) => !shortIds.has(artist.id))
    .map((artist) => ({
      ...artist,
      vanishReason: "Not in your recent rotation",
    }))
    .slice(0, 12)
}

export function calculateAmnesiaScore(totalTracks: number, ghostCount: number) {
  const score = Math.round((ghostCount / totalTracks) * 100)
  return {
    score: Math.min(score, 100),
    totalTracksAnalyzed: totalTracks,
    ghostCount,
  }
}
