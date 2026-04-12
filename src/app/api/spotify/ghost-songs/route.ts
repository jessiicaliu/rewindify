import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getTopTracks, getRecentlyPlayed } from "@/lib/spotify"
import { calculateGhostSongs, calculateAmnesiaScore } from "@/lib/ghost-algorithm"
import { saveGhostSongs, getGhostSongs } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken || !session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const userId = session.user.email

  try {
    // Check cache first
    const cached = await getGhostSongs(userId)
    if (cached.length > 0) {
      return NextResponse.json({ ghostSongs: cached, fromCache: true })
    }
  } catch {
    // Cache miss or table doesn't exist yet — fall through to Spotify
  }

  try {
    const [longTerm, mediumTerm, recent] = await Promise.all([
      getTopTracks(session.accessToken, "long_term"),
      getTopTracks(session.accessToken, "medium_term"),
      getRecentlyPlayed(session.accessToken),
    ])

    const ghostSongs = calculateGhostSongs(longTerm, mediumTerm, recent)
    const amnesiaScore = calculateAmnesiaScore(longTerm.length, ghostSongs.length)

    try {
      await saveGhostSongs(userId, ghostSongs)
    } catch {
      // Non-fatal — return results even if caching fails
    }

    return NextResponse.json({ ghostSongs, amnesiaScore, fromCache: false })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}