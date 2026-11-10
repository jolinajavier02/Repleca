import { canvasFormats, formatLabel, formatsFor } from "../lib/formats";
export default function FormatSelect({
  mode,
  value,
  ratio,
  label = "Canvas format",
  onChange,
}: {
  mode: string;
  value?: string;
  ratio: string;
  label?: string;
  onChange: (id: string) => void;
}) {
  const options = formatsFor(mode);
  return (
    <select
      aria-label={label}
      value={
        value && canvasFormats.some((f) => f.id === value && f.mode === mode)
          ? value
          : ""
      }
      onChange={(e) => {
        if (e.target.value) onChange(e.target.value);
      }}
    >
      <option value="" disabled>
        Custom · {ratio}
      </option>
      {options.map((format) => (
        <option key={format.id} value={format.id}>
          {formatLabel(format)}
        </option>
      ))}
    </select>
  );
}
