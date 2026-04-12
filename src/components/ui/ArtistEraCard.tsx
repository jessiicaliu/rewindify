import { Artist } from "@/types"
import Image from "next/image"

interface Props {
  title: string
  description: string
  artists: Artist[]
  accent: string
}

export default function ArtistEraCard({ title, description, artists, accent }: Props) {
  if (artists.length === 0) return null

  return (
    <div className="mb-12">
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${accent}`}>{title}</h2>
        <p className="text-white/40 text-sm">{description}</p>
      </div>
      <div className="space-y-2">
        {artists.slice(0, 10).map((artist, i) => (
          <a
            key={artist.id}
            href={artist.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <span className="text-white/30 text-xs w-4 shrink-0 text-right">{i + 1}</span>
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
              {artist.image ? (
                <Image src={artist.image} alt={artist.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10 rounded-full" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:opacity-70 transition-opacity">
                {artist.name}
              </p>
              {artist.genres?.[0] && (
                <p className="text-xs text-white/50 truncate capitalize">{artist.genres[0]}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
