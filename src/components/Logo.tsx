/** "haluna" wordmark with a small rising-sun mark. Pure SVG so it stays crisp at any size. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 132 32" className={className} role="img" aria-label="Haluna">
      <g>
        <circle cx="14" cy="17" r="8.5" fill="#F28C4B" />
        <path d="M2.5 21.5h23" stroke="#2B1E16" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6.5 26h15" stroke="#2B1E16" strokeWidth="2.2" strokeLinecap="round" opacity=".35" />
      </g>
      <text
        x="34"
        y="24"
        fill="#2B1E16"
        fontFamily="Fraunces, Georgia, serif"
        fontSize="25"
        fontWeight="400"
        letterSpacing="-0.6"
      >
        haluna
      </text>
    </svg>
  )
}
