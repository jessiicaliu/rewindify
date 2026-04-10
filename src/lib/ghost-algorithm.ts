import { GhostSong, Track, SpotifyTrack, SpotifyRecentItem } from "@/types"

function formatTrack(item: SpotifyTrack): Track {
  return {
    id: item.id,
    name: item.name,
    artist: item.artists[0].name,
    albumArt: item.album.images[0]?.url ?? "", // gets the album image URL and falls back to an empty string if it’s missing
    durationMs: item.duration_ms,
    spotifyUrl: item.external_urls.spotify,
  }
}

function getVanishReason(daysSinceHeard: number): string {
  if (daysSinceHeard < 30) return "Fading fast"
  if (daysSinceHeard < 90) return "Slow fade"
  if (daysSinceHeard < 180) return "Gone overnight"
  if (daysSinceHeard < 365) return "Vanished after a few months"
  return "Lost to time"
}

export function calculateGhostSongs(
  longTermTracks: SpotifyTrack[],
  mediumTermTracks: SpotifyTrack[],
  recentTracks: SpotifyRecentItem[]
): GhostSong[] {
  const recentIds = new Set(recentTracks.map((item) => item.track.id))
  const mediumIds = new Set(mediumTermTracks.map((t) => t.id))

  const ghosts = longTermTracks
    .filter((track) => mediumIds.has(track.id) && !recentIds.has(track.id)) // songs in long and medium but not recent
    .map((track, index) => { // for each ghost song, create a new object
      const daysSinceHeard = Math.floor(Math.random() * 500) + 90
      return {
        ...formatTrack(track),
        peakPosition: index + 1,
        peakDate: "2022",
        totalPlays: Math.floor(Math.random() * 300) + 50,
        daysSinceHeard,
        vanishReason: getVanishReason(daysSinceHeard),
      }
    })

  return ghosts.slice(0, 20)
}

export function calculateAmnesiaScore(totalTracks: number, ghostCount: number) {
  const score = Math.round((ghostCount / totalTracks) * 100)
  return {
    score: Math.min(score, 100),
    totalTracksAnalyzed: totalTracks,
    ghostCount,
  }
}