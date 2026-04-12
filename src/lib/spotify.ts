import { Track, SpotifyTrack } from "@/types"

const SPOTIFY_BASE = "https://api.spotify.com/v1"

async function spotifyFetch(endpoint: string, accessToken: string) {
  const res = await fetch(`${SPOTIFY_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`)
  return res.json()
}

export function formatTrack(item: SpotifyTrack): Track {
  return {
    id: item.id,
    name: item.name,
    artist: item.artists[0].name,
    albumArt: item.album.images[0]?.url ?? "",
    durationMs: item.duration_ms,
    spotifyUrl: item.external_urls.spotify,
  }
}

// Top songs
// range: short = last 4 weeks, medium = 6 months, long = all time
export async function getTopTracks(accessToken: string, range: "short_term" | "medium_term" | "long_term"): Promise<Track[]> {
  const data = await spotifyFetch(`/me/top/tracks?time_range=${range}&limit=50`, accessToken)
  return data.items.map(formatTrack)
}

// Last 50 songs the user played
export async function getRecentlyPlayed(accessToken: string) {
  const data = await spotifyFetch(`/me/player/recently-played?limit=50`, accessToken)
  return data.items
}