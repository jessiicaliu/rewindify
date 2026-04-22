"use client"
import Image from "next/image"
import { GhostSong } from "@/types"

interface Props {
  songs: GhostSong[]
}

export default function GhostSongsList({ songs }: Props) {
  if (songs.length === 0) return null

  return (
    <div className="space-y-2">
      {songs.map((song) => (
        <a
          key={song.id}
          href={song.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
        >
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <Image src={song.albumArt} alt={song.name} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-white truncate group-hover:text-violet-400 transition-colors">
              {song.name}
            </p>
            <p className="text-sm text-white/50 truncate">{song.artist}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-white/30">#{song.peakPosition} all-time</p>
            <p className="text-xs text-white/20">{song.daysSinceHeard}d ago</p>
          </div>
        </a>
      ))}
    </div>
  )
}
