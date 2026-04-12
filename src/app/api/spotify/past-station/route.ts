import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getTopTracks } from "@/lib/spotify"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const month = searchParams.get("month")

  if (!year || !month) {
    return NextResponse.json({ error: "Missing year or month" }, { status: 400 })
  }

  const longTerm = await getTopTracks(session.accessToken, "long_term")
  const mediumTerm = await getTopTracks(session.accessToken, "medium_term")
  const shortTerm = await getTopTracks(session.accessToken, "short_term")

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const monthsAgo =
    (currentYear - parseInt(year)) * 12 + (currentMonth - parseInt(month))

  let tracks
  if (monthsAgo <= 4) tracks = shortTerm
  else if (monthsAgo <= 12) tracks = mediumTerm
  else tracks = longTerm

  return NextResponse.json({ tracks, year, month })
}