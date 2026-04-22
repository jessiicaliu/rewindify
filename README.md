# Rewindify

Classifies your Spotify listening history into trends (Rising, Timeless, Fading, and Ghost) by comparing how often you've played tracks across different time windows.

## Features

- Connects to Spotify via OAuth
- Compares short-term, medium-term, and long-term top tracks to classify songs and artists
- Ghost Songs: tracks that were in your all-time top but have disappeared from your recent listening, with days since last heard pulled from your play history
- Caches ghost songs in Supabase so they don't get recomputed on every visit
- Shows currently playing track on the home page

## Stack

- Next.js, TypeScript, Tailwind CSS
- Spotify Web API with next-auth (handles OAuth and token refresh)
- Supabase for caching
