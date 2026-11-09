export default function StudioArtwork({
  variant = 0,
  className = "",
}: {
  variant?: number;
  className?: string;
}) {
  const shared = {
    className: `studio-artwork ${className}`,
    viewBox: "0 0 700 430",
    preserveAspectRatio: "xMidYMid slice",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    role: "img" as const,
  };
  if (variant % 6 === 1)
    return (
      <svg
        {...shared}
        aria-label="Pink editorial illustration of oversized flowers in a striped blue vase"
      >
        <path fill="#edc8d2" d="M0 0h700v430H0z" />
        <path fill="#eddca9" d="M0 330h700v100H0z" />
        <path
          d="M83 0v330M168 0v330M615 0v330"
          stroke="#dfb3bf"
          strokeWidth="1"
        />
        <path
          d="M350 305V128m0 102-90-73m90 45 100-93"
          stroke="#415c42"
          strokeWidth="8"
        />
        <path
          d="M348 244c-95 0-110-51-99-83 69 2 105 27 99 83Zm4-23c89 4 128-43 120-82-64-4-105 21-120 82Z"
          fill="#567b50"
        />
        {[
          { x: 345, y: 105, r: 48, c: "#d95f43" },
          { x: 247, y: 154, r: 34, c: "#f8f0cc" },
          { x: 464, y: 95, r: 41, c: "#f6ad48" },
        ].map(({ x, y, r, c }) => (
          <g key={x}>
            {Array.from({ length: 7 }, (_, i) => (
              <ellipse
                key={i}
                cx={x}
                cy={y - r * 0.65}
                rx={r * 0.35}
                ry={r * 0.64}
                fill={c}
                transform={`rotate(${(i * 360) / 7} ${x} ${y})`}
              />
            ))}
            <circle cx={x} cy={y} r={r * 0.35} fill="#653f3a" />
          </g>
        ))}
        <path d="M281 268h139l-16 126H297z" fill="#5269a4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${293 + i * 27} 270l${i < 2 ? 9 : -6} 123`}
            stroke="#e0e8ee"
            strokeWidth="8"
          />
        ))}
        <ellipse cx="350" cy="268" rx="70" ry="9" fill="#334c83" />
        <path
          d="m80 71 9 18 21 3-15 15 4 21-19-10-18 10 3-21-15-15 21-3z"
          fill="#a982ac"
        />
        <path
          d="m580 270 10 19 21 3-15 15 3 21-19-10-18 10 3-21-15-15 21-3z"
          fill="#d36745"
        />
        <path d="M54 379h128m345-15h118" stroke="#c6ae78" strokeWidth="2" />
        <circle cx="115" cy="269" r="24" fill="#e59d8c" />
      </svg>
    );
  if (variant % 6 === 2)
    return (
      <svg
        {...shared}
        aria-label="Blue modernist illustration with geometric stairs, a golden sun, and graphic grids"
      >
        <path fill="#cee0e5" d="M0 0h700v430H0z" />
        <path d="M0 315h700v115H0z" fill="#27566a" />
        <circle cx="511" cy="109" r="65" fill="#efb34a" />
        <path d="M62 315V91h150v224" fill="#f6ede0" />
        <path d="M83 315V112h106v203" fill="#457b8b" />
        <path d="M212 315V185h102v130" fill="#e17853" />
        <path
          d="M293 369h307v-40h-45v-40h-45v-40h-45v-40h-45v-40h-45v-40h-82z"
          fill="#f3c5a6"
        />
        <path
          d="M293 329h262m-262-40h217m-217-40h172m-172-40h127m-127-40h82"
          stroke="#c28f78"
          strokeWidth="2"
        />
        <path
          d="M84 154h105m-105 43h105m-105 43h105m-53-128v203"
          stroke="#a1bdc1"
          strokeWidth="2"
        />
        <path d="m590 191 47-47 47 47-47 47z" fill="#376376" />
        <path d="m40 390 78-58 78 58" stroke="#aac5c6" strokeWidth="3" />
        <path
          d="M632 314V246m-22 51 22-21 22 21"
          stroke="#152f43"
          strokeWidth="5"
        />
        <path d="M607 314h50l-9 42h-32z" fill="#e7ae4a" />
      </svg>
    );
  if (variant % 6 === 3)
    return (
      <svg
        {...shared}
        aria-label="Graphic podcast cover with a vinyl record, orange waves, and a vintage microphone"
      >
        <path fill="#eabb8d" d="M0 0h700v430H0z" />
        <path fill="#bd5c40" d="M0 300h700v130H0z" />
        <circle cx="465" cy="208" r="161" fill="#32372d" />
        {[52, 69, 86, 103, 120, 138].map((r) => (
          <circle
            key={r}
            cx="465"
            cy="208"
            r={r}
            stroke="#586044"
            strokeWidth="1.5"
          />
        ))}
        <circle cx="465" cy="208" r="45" fill="#ecc563" />
        <circle cx="465" cy="208" r="8" fill="#bd5c40" />
        <rect
          x="111"
          y="70"
          width="106"
          height="178"
          rx="53"
          fill="#eee6ce"
          stroke="#434b37"
          strokeWidth="4"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M130 ${96 + i * 23}h68`}
            stroke="#717a5e"
            strokeWidth="4"
          />
        ))}
        <path
          d="M86 178v28a78 78 0 0 0 156 0v-28m-78 106v75m-56 0h112"
          stroke="#343f31"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M260 111c32 37 32 77 0 114m20-139c49 55 49 113 0 168"
          stroke="#ce7852"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="m45 39 12 24 28 4-20 20 5 27-25-13-25 13 5-27L5 67l28-4z"
          fill="#f2d16c"
        />
        <path d="M360 402h290" stroke="#f0bc8c" strokeWidth="2" />
        <path d="M627 40v58m-29-29h58" stroke="#f8e9be" strokeWidth="5" />
      </svg>
    );
  if (variant % 6 === 4)
    return (
      <svg
        {...shared}
        aria-label="Playful creative collage of pencils, abstract paper shapes, stars, and a hand-drawn eye"
      >
        <path fill="#e8e8d8" d="M0 0h700v430H0z" />
        <path d="M0 309 222 91l143 144L168 430H0z" fill="#9cae85" />
        <path d="M374 0h326v430H594L374 210z" fill="#e2b9a2" />
        <rect
          x="176"
          y="65"
          width="310"
          height="294"
          rx="2"
          transform="rotate(-12 331 212)"
          fill="#fcf3dc"
          stroke="#77795f"
          strokeWidth="2"
        />
        <path
          d="M244 205q99-106 193 0-94 106-193 0Z"
          fill="#adc2bf"
          stroke="#3d554c"
          strokeWidth="3"
        />
        <circle cx="339" cy="205" r="38" fill="#3e5b4c" />
        <circle cx="339" cy="205" r="16" fill="#e6b04d" />
        <circle cx="350" cy="192" r="7" fill="#fcf3dc" />
        <g transform="rotate(27 528 212)">
          <path d="M507 84h43v227l-21 43-22-43z" fill="#dc6a43" />
          <path d="M520 84v226m17-226v226" stroke="#f1aa6e" strokeWidth="5" />
          <path d="m507 311 22 43 21-43" fill="#f4d6a6" />
          <path d="m523 342 6 12 6-12" fill="#343d2c" />
          <path
            d="M507 59a9 9 0 0 1 9-9h25a9 9 0 0 1 9 9v25h-43z"
            fill="#a99bb4"
          />
        </g>
        <path
          d="m101 64 12 31 33 3-26 21 7 33-27-19-28 18 8-33-25-22 33-2z"
          fill="#e8b04a"
        />
        <path d="m561 363 30-33 30 33-30 33z" fill="#b39bb7" />
        <path
          d="M232 292h140m-136 16h93M60 260v59m-29-30h59"
          stroke="#788966"
          strokeWidth="3"
        />
        <circle cx="626" cy="97" r="25" fill="#d67553" />
        <path d="m622 80 11 17-11 17" stroke="#f9e7be" strokeWidth="3" />
      </svg>
    );
  if (variant % 6 === 5)
    return (
      <svg
        {...shared}
        aria-label="Warm still-life illustration of a coffee cup, notebook, and striped tablecloth"
      >
        <path fill="#f0dcbc" d="M0 0h700v430H0z" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <path
            key={i}
            d={`M${i * 90 - 20} 0v430`}
            stroke="#e6c8a2"
            strokeWidth="35"
          />
        ))}
        <rect
          x="368"
          y="61"
          width="222"
          height="303"
          rx="5"
          transform="rotate(12 480 212)"
          fill="#768a67"
          stroke="#4f6749"
          strokeWidth="3"
        />
        <rect
          x="388"
          y="78"
          width="190"
          height="270"
          rx="3"
          transform="rotate(12 480 212)"
          fill="#fbf2dc"
        />
        <path
          d="m414 130 128 27m-134-2 128 27m-133-2 128 27m-133-2 128 27m-133-2 128 27"
          stroke="#d1c6a8"
          strokeWidth="2"
        />
        <ellipse cx="226" cy="255" rx="120" ry="89" fill="#cba77d" />
        <ellipse cx="222" cy="238" rx="119" ry="89" fill="#f6edd6" />
        <path
          d="M286 178c104-24 99 92 10 76"
          stroke="#b46842"
          strokeWidth="23"
        />
        <path d="M139 184h160v54a80 66 0 0 1-160 0z" fill="#c8764d" />
        <ellipse cx="219" cy="184" rx="80" ry="35" fill="#e6b588" />
        <ellipse cx="219" cy="184" rx="64" ry="25" fill="#694a32" />
        <path
          d="M199 119c-26-23 28-33 5-57m33 62c-26-23 28-33 5-57"
          stroke="#fbf0da"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="m572 298 44 11-27 97-18 17-7-23z" fill="#c75f41" />
        <path d="m564 400 7 23 18-17" fill="#ecc999" />
        <path
          d="m65 48 8 20 22 1-17 14 5 22-18-13-19 12 6-21-17-15 23-1z"
          fill="#ce754e"
        />
      </svg>
    );
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
