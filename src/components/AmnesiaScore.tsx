"use client"
import { AmnesiaScore as AmnesiaScoreType } from "@/types"

interface Props {
  score: AmnesiaScoreType
}

export default function AmnesiaScore({ score }: Props) {
  const pct = score.score

  return (
    <div className="rounded-2xl bg-white/5 p-6 mb-8">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Amnesia Score</p>
          <p className="text-5xl font-bold text-white">{pct}</p>
        </div>
        <p className="text-white/40 text-sm text-right">
          {score.ghostCount} forgotten<br />
          of {score.totalTracksAnalyzed} tracks
        </p>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-white/30">
        {pct < 20 && "You don't forget a beat."}
        {pct >= 20 && pct < 50 && "A few songs slipped through the cracks."}
        {pct >= 50 && pct < 75 && "Half your past is a blur."}
        {pct >= 75 && "Your memory is mostly vibes."}
      </p>
    </div>
  )
}
