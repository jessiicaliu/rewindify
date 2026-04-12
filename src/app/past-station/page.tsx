import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTopTracks } from "@/lib/spotify"
import { Track } from "@/types"
import DatePicker from "./DatePicker"
import PastStationGrid from "@/components/PastStationGrid"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ year?: string; month?: string }>
}

export default async function PastStationPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect("/")
  }

  const { year: yearStr, month: monthStr } = await searchParams
  const year = yearStr ? parseInt(yearStr) : null
  const month = monthStr ? parseInt(monthStr) : null

  let tracks: Track[] = []

  if (year && month) {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const monthsAgo = (currentYear - year) * 12 + (currentMonth - month)

    const range = monthsAgo <= 4 ? "short_term" : monthsAgo <= 12 ? "medium_term" : "long_term"
    tracks = await getTopTracks(session.accessToken, range)
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Past Station</h1>
        <p className="text-white/50 text-sm">What were you listening to back then?</p>
      </div>

      <Suspense>
        <DatePicker />
      </Suspense>

      {!year || !month ? (
        <p className="text-white/30 text-sm text-center py-16">Pick a year and month to tune in.</p>
      ) : tracks.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-16">No data found for that period.</p>
      ) : (
        <PastStationGrid tracks={tracks} year={year} month={month} />
      )}
    </main>
  )
}
