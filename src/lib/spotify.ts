const SPOTIFY_BASE = "https://api.spotify.com/v1"

// Every request to Spotify needs this
async function spotifyFetch(endpoint: string, accessToken: string) {
  const res = await fetch(`${SPOTIFY_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`)
  return res.json()
}

// Top songs
// range: short = last 4 weeks, medium = 6 months, long = all time
export async function getTopTracks(accessToken: string, range: "short_term" | "medium_term" | "long_term") {
  const data = await spotifyFetch(`/me/top/tracks?time_range=${range}&limit=50`, accessToken)
  return data.items
}

// Last 50 songs the user played
export async function getRecentlyPlayed(accessToken: string) {
  const data = await spotifyFetch(`/me/player/recently-played?limit=50`, accessToken)
  return data.items
}