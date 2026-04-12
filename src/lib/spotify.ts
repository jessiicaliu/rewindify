import { Track, SpotifyTrack, Artist, SpotifyArtist, NowPlayingTrack } from "@/types"

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
// Fetches 2 pages (up to 100 tracks) to get a bigger pool
export async function getTopTracks(accessToken: string, range: "short_term" | "medium_term" | "long_term"): Promise<Track[]> {
  const [page1, page2] = await Promise.all([
    spotifyFetch(`/me/top/tracks?time_range=${range}&limit=50&offset=0`, accessToken),
    spotifyFetch(`/me/top/tracks?time_range=${range}&limit=50&offset=50`, accessToken).catch(() => ({ items: [] })),
  ])
  const seen = new Set<string>()
  return [...page1.items, ...page2.items]
    .filter((item: SpotifyTrack) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .map(formatTrack)
}

// Last 50 songs the user played
export async function getRecentlyPlayed(accessToken: string) {
  const data = await spotifyFetch(`/me/player/recently-played?limit=50`, accessToken)
  return data.items
}

export function formatArtist(item: SpotifyArtist): Artist {
  return {
    id: item.id,
    name: item.name,
    image: item.images[0]?.url ?? "",
    genres: item.genres ?? [],
    spotifyUrl: item.external_urls.spotify,
  }
}

// Currently playing track — returns null if nothing is playing
export async function getNowPlaying(accessToken: string): Promise<NowPlayingTrack | null> {
  const res = await fetch(`${SPOTIFY_BASE}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (res.status === 204 || !res.ok) return null
  const data = await res.json()
  if (!data?.item) return null
  return {
    id: data.item.id,
    name: data.item.name,
    artist: data.item.artists[0].name,
    albumArt: data.item.album.images[0]?.url ?? "",
    spotifyUrl: data.item.external_urls.spotify,
    isPlaying: data.is_playing,
    progressMs: data.progress_ms,
    durationMs: data.item.duration_ms,
  }
}

// Top artists
// range: short = last 4 weeks, medium = 6 months, long = all time
// Fetches 2 pages (up to 100 artists) to get a bigger pool
export async function getTopArtists(accessToken: string, range: "short_term" | "medium_term" | "long_term"): Promise<Artist[]> {
  const [page1, page2] = await Promise.all([
    spotifyFetch(`/me/top/artists?time_range=${range}&limit=50&offset=0`, accessToken),
    spotifyFetch(`/me/top/artists?time_range=${range}&limit=50&offset=50`, accessToken).catch(() => ({ items: [] })),
  ])
  const seen = new Set<string>()
  return [...page1.items, ...page2.items]
    .filter((item: SpotifyArtist) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .map(formatArtist)
}