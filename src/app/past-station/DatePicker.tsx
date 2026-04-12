"use client"
import { useRouter, useSearchParams } from "next/navigation"

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

export default function DatePicker() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedYear = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null
  const selectedMonth = searchParams.get("month") ? parseInt(searchParams.get("month")!) : null

  function select(year: number | null, month: number | null) {
    const y = year ?? selectedYear
    const m = month ?? selectedMonth
    if (!y || !m) return
    router.push(`/past-station?year=${y}&month=${m}`)
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-2 flex-wrap">
        {YEARS.map((year) => (
          <button
            key={year}
            onClick={() => select(year, null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedYear === year ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
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
            onClick={() => select(null, value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedMonth === value ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
