"use client"
import { signIn } from "next-auth/react"

export default function Home() {
  return (
    <div>
      <h1>Rewindify</h1>
      <button onClick={() => signIn("spotify")}>Connect Spotify</button>
    </div>
  )
}