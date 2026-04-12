import Link from "next/link"

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

interface Props {
  selectedYear: number | null
  selectedMonth: number | null
}

export default function DatePicker({ selectedYear, selectedMonth }: Props) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-2 flex-wrap">
        {YEARS.map((year) => (
          <Link
            key={year}
            href={`/past-station?year=${year}${selectedMonth ? `&month=${selectedMonth}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedYear === year ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {year}
          </Link>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {MONTHS.map(({ value, label }) => (
          <Link
            key={value}
            href={`/past-station?month=${value}${selectedYear ? `&year=${selectedYear}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedMonth === value ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      {selectedYear && !selectedMonth && (
        <p className="text-white/30 text-xs">Now pick a month</p>
      )}
      {!selectedYear && selectedMonth && (
        <p className="text-white/30 text-xs">Now pick a year</p>
      )}
    </div>
  )
}
