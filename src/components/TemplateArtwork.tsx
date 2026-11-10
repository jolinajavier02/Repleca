import StudioArtwork from "./StudioArtwork";
export default function TemplateArtwork({
  style,
  variant = 0,
  aspect = 700 / 430,
}: {
  style?: string;
  variant?: number;
  aspect?: number;
}) {
  if (!style || ["video", "art", "photo-clean", "photo-border"].includes(style))
    return <StudioArtwork variant={variant} />;
  const palettes = [
    ["#f4eedc", "#a6b69a", "#d27b54"],
    ["#f0e2e5", "#af8fa5", "#d79574"],
    ["#e5e9e1", "#82978a", "#d9b460"],
  ];
  const [paper, accent, warm] = palettes[variant % 3];
  const h = 700 / aspect;
  return (
    <svg
      className="studio-artwork template-artwork"
      viewBox={`0 0 700 ${h}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${style.replace(/-/g, " ")} design layout`}
    >
      <rect width="700" height={h} fill={paper} />
      {style === "logo" ? (
        <g
          transform={`translate(350 ${h * 0.3})`}
          stroke={accent}
          strokeWidth="6"
          fill="none"
        >
          <ellipse rx="70" ry="28" transform="rotate(-40)" />
          <ellipse rx="70" ry="28" transform="rotate(40)" />
          <ellipse rx="70" ry="28" transform="rotate(90)" />
          <circle r="9" fill={warm} stroke="none" />
        </g>
      ) : style === "wordmark" ? (
        <>
          <path
            d={`M90 ${h * 0.25}h520M90 ${h * 0.75}h520`}
            stroke={accent}
            strokeWidth="2"
          />
          <path
            d={`m130 ${h * 0.21} 8-23 8 23m-14-7h10`}
            fill="none"
            stroke={warm}
            strokeWidth="3"
          />
        </>
      ) : style === "invitation" || style === "greeting-card" ? (
        <>
          <rect
            x="30"
            y={h * 0.04}
            width="640"
            height={h * 0.92}
            rx="5"
            fill="none"
            stroke={accent}
            strokeWidth="2"
          />
          {[0, 1, 2, 3].map((i) => (
            <g
              key={i}
              transform={`translate(${i % 2 ? 620 : 80} ${i < 2 ? h * 0.13 : h * 0.87}) rotate(${i * 90})`}
            >
              <path
                d="M0 0q40 5 45 40M0 0q-15 35-45 45"
                fill="none"
                stroke={accent}
                strokeWidth="3"
              />
              <ellipse
                cx="20"
                cy="7"
                rx="19"
                ry="8"
                fill={accent}
                transform="rotate(35 20 7)"
              />
              <ellipse
                cx="37"
                cy="26"
                rx="19"
                ry="8"
                fill={accent}
                transform="rotate(65 37 26)"
              />
              <circle cx="-11" cy="20" r="14" fill={warm} />
              <circle cx="-11" cy="20" r="5" fill={paper} />
            </g>
          ))}
        </>
      ) : style === "business-card" ? (
        <>
          <rect x="0" width="190" height={h} fill={accent} />
          <circle
            cx="95"
            cy={h / 2}
            r="49"
            stroke={paper}
            strokeWidth="2"
            fill="none"
          />
          <path
            d={`M72 ${h / 2 - 23}h46l-46 46h46`}
            stroke={paper}
            strokeWidth="4"
            fill="none"
          />
          <path d={`M230 ${h * 0.8}h400`} stroke={accent} strokeWidth="2" />
        </>
      ) : style === "frame" ? (
        <>
          <rect
            x="32"
            y={h * 0.05}
            width="636"
            height={h * 0.9}
            fill="#fffdf7"
            stroke={accent}
            strokeWidth="5"
          />
          <rect
            x="64"
            y={h * 0.1}
            width="572"
            height={h * 0.8}
            fill={paper}
            stroke={accent}
            strokeWidth="1"
          />
        </>
      ) : (
        <>
          <path
            d={`M0 ${h * 0.8}h700v${h * 0.2}H0z`}
            fill={accent}
            opacity=".14"
          />
          <path d={`M515 0h185v${h}H515z`} fill={accent} opacity=".28" />
          <circle cx="605" cy={h * 0.2} r="60" fill={warm} />
          <path d={`M535 ${h * 0.65}h130v${h * 0.18}H535z`} fill={accent} />
          <path d={`M535 ${h * 0.57}h90v${h * 0.08}h-90z`} fill={warm} />
          <path d={`M55 ${h * 0.85}h340`} stroke={accent} strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
