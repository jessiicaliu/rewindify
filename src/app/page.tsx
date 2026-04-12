import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/past-station")
  }

  return (
    <div>
      <h1>Rewindify</h1>
      <a href="/api/auth/signin/spotify">Connect Spotify</a>
    </div>
  )
}
