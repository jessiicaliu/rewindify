// A single song/track from Spotify
export type Track = {
  id: string
  name: string
  artist: string
  albumArt: string
  durationMs: number
  spotifyUrl: string
}

// A ghost song — a Track but with extra memory data
export type GhostSong = Track & {
  peakPosition: number // highest rank it ever hit
  peakDate: string
  totalPlays: number
  daysSinceHeard: number
  vanishReason: string
}

// One month era for Past Station
export type Era = {
  month: string
  year: number
  label: string
  trackCount: number
  moodColor: string
  tracks: Track[]
}

// The amnesia score shown at the bottom
export type AmnesiaScore = {
  score: number // 0-100
  totalTracksAnalyzed: number
  ghostCount: number
}