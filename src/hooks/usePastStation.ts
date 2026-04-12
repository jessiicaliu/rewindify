import { useState, useEffect } from "react"
import { Track } from "@/types"

export function usePastStation(year: number | null, month: number | null) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!year || !month) return

    async function fetchStation() {
      try {
        setLoading(true)
        const res = await fetch(`/api/spotify/past-station?year=${year}&month=${month}`)
        if (!res.ok) throw new Error("Failed to fetch past station")
        const data = await res.json()
        setTracks(data.tracks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchStation()
  }, [year, month])

  return { tracks, loading, error }
}