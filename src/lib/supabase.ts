import { createClient } from "@supabase/supabase-js"
import { GhostSong } from "@/types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Save ghost songs to database so we don't call Spotify every time
export async function saveGhostSongs(userId: string, songs: GhostSong[]) {
  const rows = songs.map((song) => ({
    user_id: userId,
    track_id: song.id,
    name: song.name,
    artist: song.artist,
    album_art: song.albumArt,
    peak_position: song.peakPosition,
    days_since_heard: song.daysSinceHeard,
    vanish_reason: song.vanishReason,
    spotify_url: song.spotifyUrl,
  }))

  const { error } = await supabase
    .from("ghost_songs")
    .upsert(rows, { onConflict: "user_id,track_id" })

  if (error) throw new Error(error.message)
}

// Fetch cached ghost songs for a user
export async function getGhostSongs(userId: string): Promise<GhostSong[]> {
  const { data, error } = await supabase
    .from("ghost_songs")
    .select("*")
    .eq("user_id", userId)
    .order("peak_position", { ascending: true })

  if (error) throw new Error(error.message)

  return data.map((row) => ({
    id: row.track_id,
    name: row.name,
    artist: row.artist,
    albumArt: row.album_art,
    durationMs: 0,
    spotifyUrl: row.spotify_url,
    peakPosition: row.peak_position,
    daysSinceHeard: row.days_since_heard,
    vanishReason: row.vanish_reason,
  }))
}