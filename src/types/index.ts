import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken: string
    user: DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
  }
}

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
  peakPosition: number // rank in long-term top tracks
  daysSinceHeard: number // days since last seen in recently-played (50-play window)
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

// A single artist from Spotify
export type Artist = {
  id: string
  name: string
  image: string
  genres: string[]
  spotifyUrl: string
}

// A ghost artist — an Artist you used to love but drifted from
export type GhostArtist = Artist & {
  vanishReason: string
}

// Raw track object as Spotify returns it
export type SpotifyTrack = {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
  duration_ms: number
  external_urls: { spotify: string }
}

// Raw recently played object as Spotify returns it
export type SpotifyRecentItem = {
  track: SpotifyTrack
  played_at: string
}

// Currently playing track
export type NowPlayingTrack = {
  id: string
  name: string
  artist: string
  albumArt: string
  spotifyUrl: string
  isPlaying: boolean
  progressMs: number
  durationMs: number
}

// Raw artist object as Spotify returns it
export type SpotifyArtist = {
  id: string
  name: string
  images: { url: string }[]
  genres: string[]
  external_urls: { spotify: string }
}