export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  const input = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      if (row.length >= 50)
        throw new Error(
          "This sheet exceeds 50 columns. The original file is still in Media.",
        );
      value = "";
    } else if (char === "\n" && !quoted) {
      row.push(value);
      rows.push(row);
      if (rows.length > 500)
        throw new Error(
          "This sheet exceeds 500 rows. The original file is still in Media.",
        );
      row = [];
      value = "";
    } else value += char;
  }
  if (quoted)
    throw new Error(
      "This CSV has an unclosed quoted field. The original file is still in Media.",
    );
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  if (rows.length > 500 || rows.some((row) => row.length > 50))
    throw new Error(
      "This sheet exceeds 500 rows or 50 columns. The original file is still in Media.",
    );
  const width = Math.max(
    8,
    rows.reduce((n, row) => Math.max(n, row.length), 0),
  );
  const normalized = rows
    .slice(0, 500)
    .map((r) => Array.from({ length: width }, (_, i) => r[i] || ""));
  while (normalized.length < 20) normalized.push(Array(width).fill(""));
  return normalized;
}
export function csvText(cells: string[][]) {
  return cells
    .map((row) =>
      row
        .map((cell) => {
          const safe = /^[=+@\-\t\r]/.test(cell) ? `'${cell}` : cell;
          return `"${safe.replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");
}
export function cellDisplay(value: string, cells: string[][]): string {
  if (!value.startsWith("=")) return value;
  const match = value.match(/^=(SUM|AVERAGE)\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/i);
  if (match) {
    const col = (label: string) =>
      [...label.toUpperCase()].reduce(
        (n, char) => n * 26 + char.charCodeAt(0) - 64,
        0,
      ) - 1;
    const numbers: number[] = [];
    const r1 = Number(match[3]) - 1,
      r2 = Number(match[5]) - 1,
      c1 = col(match[2]),
      c2 = col(match[4]);
    if (
      r1 < 0 ||
      r2 >= cells.length ||
      c1 < 0 ||
      c2 >= (cells[0]?.length || 0) ||
      r2 < r1 ||
      c2 < c1
    )
      return "#REF!";
    for (let r = r1; r <= r2; r++)
      for (let c = c1; c <= c2; c++)
        if (cells[r][c].trim() && Number.isFinite(Number(cells[r][c])))
          numbers.push(Number(cells[r][c]));
    return String(
      match[1].toUpperCase() === "SUM"
        ? numbers.reduce((n, v) => n + v, 0)
        : numbers.length
          ? numbers.reduce((n, v) => n + v, 0) / numbers.length
          : 0,
    );
  }
  return "#FORMULA?";
}
