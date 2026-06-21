import { useEffect, useRef, useState } from "react"

function ShrineGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L20 12L12 22L4 12L12 2Z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
    </svg>
  )
}

type BingoCellProps = {
  label: string
  checked: boolean
  mine: boolean
  disabled: boolean
  onClick: () => void
}

export function BingoCell({ label, checked, mine, disabled, onClick }: BingoCellProps) {
  const wasChecked = useRef(false)
  const [justActivated, setJustActivated] = useState(false)

  // Déclenche le pulse "sanctuaire activé" une seule fois,
  // au moment exact où la case passe de non-cochée à cochée.
  useEffect(() => {
    if (checked && !wasChecked.current) {
      setJustActivated(true)
      const timeout = setTimeout(() => setJustActivated(false), 650)
      wasChecked.current = true
      return () => clearTimeout(timeout)
    }
    wasChecked.current = checked
  }, [checked])

  const glyphColor = mine ? "text-korok-moss" : "text-guardian-ember"
  const ringStyle = mine
    ? "border-korok-moss/60 shadow-[0_0_18px_-4px_rgba(121,163,60,0.55)]"
    : "border-guardian-ember/60 shadow-[0_0_18px_-4px_rgba(255,106,61,0.55)]"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "relative flex aspect-square w-full flex-col items-center justify-center gap-1",
        "rounded-md border p-2 text-center transition-all duration-300",
        checked
          ? `bg-slate-stone ${ringStyle}`
          : "border-white/5 bg-slate-stone/70 hover:border-sheikah-teal/40 hover:bg-slate-stone",
        disabled && !checked ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        justActivated ? "animate-shrine-pulse" : "",
      ].join(" ")}
    >
      {checked && (
        <ShrineGlyph
          className={`h-4 w-4 ${glyphColor} ${justActivated ? "animate-shrine-glyph-in" : ""}`}
        />
      )}
      <span
        className={`font-body text-[10.5px] leading-tight ${
          checked ? "text-white/90" : "text-parchment/70"
        }`}
      >
        {label}
      </span>
    </button>
  )
}