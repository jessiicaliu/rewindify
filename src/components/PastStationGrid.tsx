"use client"
import { Track } from "@/types"
import Image from "next/image"

interface Props {
  tracks: Track[]
  year: number
  month: number
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export default function PastStationGrid({ tracks, year, month }: Props) {
  if (tracks.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-white/80">
        {MONTH_NAMES[month - 1]} {year}
        <span className="ml-3 text-sm font-normal text-white/40">
          {tracks.length} tracks
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tracks.map((track, i) => (
          <a
            key={track.id}
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <span className="text-white/30 text-sm w-5 shrink-0 text-right">
              {i + 1}
            </span>
            <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
              <Image
                src={track.albumArt}
                alt={track.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors">
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
