"use client"
import { useGhostSongs } from "@/hooks/useGhostSongs"
import GhostSongsList from "@/components/GhostSongsList"
import AmnesiaScore from "@/components/AmnesiaScore"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function GhostSongsPage() {
  const { ghostSongs, amnesiaScore, loading, error } = useGhostSongs()

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Ghost Songs</h1>
        <p className="text-white/50 text-sm">Songs you loved and forgot.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-400 text-sm text-center py-16">{error}</p>
      ) : (
        <>
          {amnesiaScore && <AmnesiaScore score={amnesiaScore} />}
          <GhostSongsList songs={ghostSongs} />
          {ghostSongs.length === 0 && !loading && (
            <p className="text-white/30 text-sm text-center py-16">
              No ghost songs found. Your memory is intact.
            </p>
          )}
        </>
      )}
    </main>
  )
}
