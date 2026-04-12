import { NowPlayingTrack } from "@/types"
import Image from "next/image"

interface Props {
  track: NowPlayingTrack | null
}

export default function NowPlaying({ track }: Props) {
  if (!track) {
    return (
      <div className="rounded-2xl bg-white/5 px-5 py-4 mb-8">
        <p className="text-xs text-white/30 uppercase tracking-widest">Nothing playing right now</p>
      </div>
    )
  }

  const progress = Math.round((track.progressMs / track.durationMs) * 100)
  const elapsed = Math.floor(track.progressMs / 1000)
  const total = Math.floor(track.durationMs / 1000)
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  return (
    <div className="rounded-2xl bg-white/5 p-4 mb-8">
      <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
        {track.isPlaying ? "Now Playing" : "Paused"}
      </p>
      <a
        href={track.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 group"
      >
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
          <Image src={track.albumArt} alt={track.name} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white truncate group-hover:opacity-70 transition-opacity">
            {track.name}
          </p>
          <p className="text-sm text-white/50 truncate">{track.artist}</p>
        </div>
      </a>
      <div className="mt-4">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/30">{fmt(elapsed)}</span>
          <span className="text-xs text-white/30">{fmt(total)}</span>
        </div>
      </div>
    </div>
  )
}
