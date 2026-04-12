import { Track } from "@/types"
import Image from "next/image"

interface Props {
  title: string
  description: string
  tracks: Track[]
  accent: string
}

export default function EraCard({ title, description, tracks, accent }: Props) {
  if (tracks.length === 0) return null

  return (
    <div className="mb-12">
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${accent}`}>{title}</h2>
        <p className="text-white/40 text-sm">{description}</p>
      </div>
      <div className="space-y-2">
        {tracks.slice(0, 10).map((track, i) => (
          <a
            key={track.id}
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <span className="text-white/30 text-xs w-4 shrink-0 text-right">{i + 1}</span>
            <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
              <Image src={track.albumArt} alt={track.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:opacity-70 transition-opacity">
                {track.name}
              </p>
              <p className="text-xs text-white/50 truncate">{track.artist}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
