export type CanvasFormat = {
  id: string;
  mode: string;
  label: string;
  group: string;
  width: number;
  height: number;
  ratio: string;
  paper?: string;
};
const f = (
  id: string,
  mode: string,
  label: string,
  group: string,
  width: number,
  height: number,
  ratio: string,
  paper?: string,
): CanvasFormat => ({ id, mode, label, group, width, height, ratio, paper });
export const canvasFormats: CanvasFormat[] = [
  f("video-youtube", "video", "YouTube video", "YouTube", 1920, 1080, "16:9"),
  f("video-tiktok", "video", "TikTok vertical", "TikTok", 1080, 1920, "9:16"),
  f(
    "video-facebook-feed",
    "video",
    "Facebook feed portrait",
    "Facebook",
    1080,
    1350,
    "4:5",
  ),
  f(
    "video-facebook-square",
    "video",
    "Facebook square video",
    "Facebook",
    1080,
    1080,
    "1:1",
  ),
  f(
    "video-facebook-reel",
    "video",
    "Facebook Reels",
    "Facebook",
    1080,
    1920,
    "9:16",
  ),
  f(
    "video-instagram-reel",
    "video",
    "Instagram Reels",
    "Instagram",
    1080,
    1920,
    "9:16",
  ),
  f(
    "video-instagram-story",
    "video",
    "Instagram Story",
    "Instagram",
    1080,
    1920,
    "9:16",
  ),
  f(
    "video-instagram-feed",
    "video",
    "Instagram feed",
    "Instagram",
    1080,
    1350,
    "4:5",
  ),
  f(
    "video-youtube-short",
    "video",
    "YouTube Shorts",
    "YouTube",
    1080,
    1920,
    "9:16",
  ),
  f(
    "video-x",
    "video",
    "X / Twitter landscape",
    "X / Twitter",
    1920,
    1080,
    "16:9",
  ),
  f("design-logo", "image", "Square logo", "Logos", 1200, 1200, "1:1"),
  f(
    "design-wordmark",
    "image",
    "Landscape wordmark",
    "Logos",
    1600,
    800,
    "2:1",
  ),
  f("design-art", "image", "Art print · 2:3", "Art", 2400, 3600, "2:3"),
  f("design-frame", "image", "Photo frame · 4:5", "Frames", 1600, 2000, "4:5"),
  f(
    "design-invitation",
    "image",
    "Invitation · 5 × 7 in",
    "Invitations",
    1500,
    2100,
    "5:7",
    "5in 7in",
  ),
  f(
    "design-business-card",
    "image",
    "Business card · 3.5 × 2 in",
    "Cards",
    1050,
    600,
    "7:4",
    "3.5in 2in",
  ),
  f(
    "design-greeting-card",
    "image",
    "Greeting card · 5 × 7 in",
    "Cards",
    1500,
    2100,
    "5:7",
    "5in 7in",
  ),
  f(
    "slides-wide",
    "present",
    "Widescreen presentation",
    "Widescreen",
    1920,
    1080,
    "16:9",
  ),
  f(
    "slides-standard",
    "present",
    "Standard presentation",
    "Standard",
    1440,
    1080,
    "4:3",
  ),
  f(
    "slides-portrait",
    "present",
    "Portrait presentation",
    "Portrait",
    1080,
    1920,
    "9:16",
  ),
  f(
    "print-a4",
    "printing",
    "A4 portrait · 210 × 297 mm",
    "Paper",
    2480,
    3508,
    "210:297",
    "A4",
  ),
  f(
    "print-letter",
    "printing",
    "US Letter · 8.5 × 11 in",
    "Paper",
    2550,
    3300,
    "17:22",
    "letter",
  ),
  f(
    "print-poster",
    "printing",
    "Poster · 12 × 18 in",
    "Posters",
    3600,
    5400,
    "2:3",
    "12in 18in",
  ),
  f(
    "print-card",
    "printing",
    "Business card · 3.5 × 2 in",
    "Cards",
    1050,
    600,
    "7:4",
    "3.5in 2in",
  ),
  f("photo-square", "photo", "Square photo", "Square", 1080, 1080, "1:1"),
  f(
    "photo-portrait",
    "photo",
    "Portrait photo · 4:5",
    "Portrait",
    1600,
    2000,
    "4:5",
  ),
  f(
    "photo-landscape",
    "photo",
    "Landscape photo · 3:2",
    "Landscape",
    2400,
    1600,
    "3:2",
  ),
  f(
    "photo-print",
    "photo",
    "Photo print · 4 × 6 in",
    "Print",
    1200,
    1800,
    "2:3",
    "4in 6in",
  ),
  f(
    "photo-story",
    "photo",
    "Vertical story photo",
    "Portrait",
    1080,
    1920,
    "9:16",
  ),
  f(
    "document-a4",
    "document",
    "A4 document · 210 × 297 mm",
    "Paper",
    2480,
    3508,
    "210:297",
    "A4",
  ),
  f(
    "document-letter",
    "document",
    "US Letter · 8.5 × 11 in",
    "Paper",
    2550,
    3300,
    "17:22",
    "letter",
  ),
  f(
    "document-legal",
    "document",
    "US Legal · 8.5 × 14 in",
    "Paper",
    2550,
    4200,
    "17:28",
    "legal",
  ),
  f(
    "excel-a4",
    "excel",
    "A4 worksheet · portrait",
    "Paper",
    2480,
    3508,
    "210:297",
    "A4",
  ),
  f(
    "excel-wide",
    "excel",
    "A4 worksheet · landscape",
    "Paper",
    3508,
    2480,
    "297:210",
    "A4 landscape",
  ),
  f(
    "excel-letter",
    "excel",
    "US Letter worksheet",
    "Paper",
    2550,
    3300,
    "17:22",
    "letter",
  ),
  f(
    "website-desktop",
    "website",
    "Desktop website",
    "Desktop",
    1440,
    900,
    "8:5",
  ),
  f(
    "website-mobile",
    "website",
    "Mobile website",
    "Mobile",
    390,
    844,
    "195:422",
  ),
];
export const formatsFor = (mode: string) =>
  canvasFormats.filter((format) => format.mode === mode);
export const defaultFormat = (mode: string) => formatsFor(mode)[0];
export function validRatio(ratio: unknown): ratio is string {
  return (
    typeof ratio === "string" &&
    /^\d{1,5}:\d{1,5}$/.test(ratio) &&
    ratio.split(":").every((n) => Number(n) >= 1 && Number(n) <= 20000)
  );
}
export function formatFields(id: string) {
  const format = canvasFormats.find((f) => f.id === id);
  if (!format) throw new Error("Choose a valid format.");
  return {
    formatId: format.id,
    width: format.width,
    height: format.height,
    ratio: format.ratio,
  };
}
export function projectSize(project: {
  width?: number;
  height?: number;
  formatId?: string;
  ratio: string;
}): [number, number] {
  if (
    Number.isFinite(project.width) &&
    Number.isFinite(project.height) &&
    project.width! > 0 &&
    project.height! > 0
  )
    return [project.width!, project.height!];
  const preset = canvasFormats.find((f) => f.id === project.formatId);
  if (preset) return [preset.width, preset.height];
  const legacy: Record<string, [number, number]> = {
    "16:9": [1920, 1080],
    "9:16": [1080, 1920],
    "1:1": [1080, 1080],
    "4:5": [1080, 1350],
  };
  if (legacy[project.ratio]) return legacy[project.ratio];
  const [w, h] = project.ratio.split(":").map(Number);
  return [1080, Math.round((1080 * h) / w)];
}
export const formatLabel = (format: CanvasFormat) =>
  `${format.label} · ${format.width} × ${format.height} px`;
