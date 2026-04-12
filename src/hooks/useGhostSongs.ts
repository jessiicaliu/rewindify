import { useState, useEffect } from "react"
import { GhostSong, AmnesiaScore } from "@/types"

export function useGhostSongs() {
  const [ghostSongs, setGhostSongs] = useState<GhostSong[]>([])
  const [amnesiaScore, setAmnesiaScore] = useState<AmnesiaScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGhostSongs() {
      try {
        const res = await fetch("/api/spotify/ghost-songs")
        if (!res.ok) throw new Error("Failed to fetch ghost songs")
        const data = await res.json()
        setGhostSongs(data.ghostSongs)
        setAmnesiaScore(data.amnesiaScore)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchGhostSongs()
  }, [])

  return { ghostSongs, amnesiaScore, loading, error }
}