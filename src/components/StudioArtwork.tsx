export default function StudioArtwork({
  variant = 0,
  className = "",
}: {
  variant?: number;
  className?: string;
}) {
  const palettes = [
    ["#e8bda5", "#e7eadc", "#859883", "#445a49"],
    ["#ddcdec", "#f3d9ba", "#a79bc3", "#675780"],
    ["#e5c971", "#f1e6cd", "#c18d54", "#795238"],
  ];
  const p = palettes[variant % palettes.length];
  return (
    <svg
      className={`studio-artwork ${className}`}
      viewBox="0 0 700 430"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Flat illustration of a sunlit Mediterranean landscape with arches, hills, and a terracotta vase"
    >
      <path fill={p[1]} d="M0 0h700v430H0z" />
      <circle cx="475" cy="112" r="61" fill="#f5bf62" />
      <path
        d="M0 256c116-147 214-92 333 27 125-198 256-190 367-88v235H0z"
        fill={p[2]}
      />
      <path
        d="M0 341c151-124 271-83 367-17 138-97 238-65 333-3v109H0z"
        fill={p[3]}
      />
      <path fill={p[0]} d="M0 0h226v430H0z" />
      <path d="M47 430V169a66 66 0 0 1 132 0v261" fill={p[3]} />
      <path d="M66 430V171a47 47 0 0 1 94 0v259" fill={p[1]} />
      <path d="M66 290c45-26 76-19 94-3v143H66z" fill={p[2]} />
      <path d="M0 385h700v45H0z" fill="#d6a07e" />
      <path
        d="M0 400h700M230 385l-22 45m168-45 20 45m159-45 47 45"
        stroke="#b47c5b"
        strokeWidth="1.5"
      />
      <path
        d="M542 385c-33-40-49-71-24-109 13-20 9-35 2-50h77c-7 15-11 30 2 50 25 38 9 69-24 109z"
        fill="#c76f4c"
        stroke="#ae573c"
        strokeWidth="2"
      />
      <ellipse cx="558" cy="225" rx="39" ry="7" fill="#9f5037" />
      <path
        d="M558 227c-4-68 20-117 45-159m-42 134c-24-51-51-76-83-92m83 70c35-24 60-33 92-31"
        stroke={p[3]}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M586 112c-5-27 10-48 31-51 6 27-8 47-31 51Zm-18 49c1-30 19-45 42-43-2 28-19 43-42 43Zm-31 13c-27 0-47-17-44-39 27-1 45 16 44 39Zm-27-40c-29 0-47-19-42-40 27 0 44 17 42 40Zm95 30c13-26 36-30 55-18-14 24-35 29-55 18Z"
        fill={p[3]}
      />
      <path d="M290 341h106v44H290z" fill="#f2dbc0" />
      <path d="M302 329h82v12h-82z" fill="#edc25e" />
      <path d="M315 290h57v39h-57z" fill="#c87952" />
      <path d="M314 289h60" stroke="#9e583e" strokeWidth="4" />
      <path
        d="M342 290v-69m0 34c-24-6-29-23-24-37 19 4 28 20 24 37Zm2-13c20-3 30-16 28-32-22 2-30 17-28 32Z"
        stroke={p[3]}
        strokeWidth="3"
        fill={p[3]}
      />
    </svg>
  );
}
