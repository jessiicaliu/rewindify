"use client"
import { useState } from "react"
import { usePastStation } from "@/hooks/usePastStation"
import PastStationGrid from "@/components/PastStationGrid"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

const MONTHS = [
  { value: 1, label: "Jan" }, { value: 2, label: "Feb" },
  { value: 3, label: "Mar" }, { value: 4, label: "Apr" },
  { value: 5, label: "May" }, { value: 6, label: "Jun" },
  { value: 7, label: "Jul" }, { value: 8, label: "Aug" },
  { value: 9, label: "Sep" }, { value: 10, label: "Oct" },
  { value: 11, label: "Nov" }, { value: 12, label: "Dec" },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i)

export default function PastStationPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const { tracks, loading, error } = usePastStation(selectedYear, selectedMonth)

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Past Station</h1>
        <p className="text-white/50 text-sm">What were you listening to back then?</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedYear === year
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {MONTHS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedMonth(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedMonth === value
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!selectedYear || !selectedMonth ? (
        <p className="text-white/30 text-sm text-center py-16">
          Pick a year and month to tune in.
        </p>
      ) : loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-400 text-sm text-center py-16">{error}</p>
      ) : tracks.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-16">
          No data found for that period.
        </p>
      ) : (
        <PastStationGrid tracks={tracks} year={selectedYear} month={selectedMonth} />
      )}
    </main>
  )
}
