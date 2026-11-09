export default function Brand({
  onClick,
  compact = false,
}: {
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <button
      className={`brand ${compact ? "compact" : ""}`}
      onClick={onClick}
      aria-label="Repleca home"
    >
      <span className="brand-mark">
        <i />
        <i />
        <i />
      </span>
      {!compact && (
        <span>
          repleca<span className="brand-period">.</span>
        </span>
      )}
    </button>
  );
}
