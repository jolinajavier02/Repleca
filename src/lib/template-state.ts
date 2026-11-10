import { projectTemplates } from "./templates.ts";
import { formatFields } from "./formats.ts";
import type { StudioProject } from "./projects";
export function templateState(
  id: string,
  mode: string,
): Partial<StudioProject> {
  const template = projectTemplates.find((t) => t.id === id && t.mode === mode);
  if (!template) throw new Error("Choose a template for this category.");
  const rows = template.cells?.map((row) => [...row]);
  if (rows) {
    const width = Math.max(8, ...rows.map((row) => row.length));
    rows.forEach((row) => {
      while (row.length < width) row.push("");
    });
    while (rows.length < 20) rows.push(Array(width).fill(""));
  }
  return {
    ...formatFields(template.formatId),
    templateId: id,
    templateStyle: template.style,
    templateNote: template.note,
    title: template.title,
    subtitle: template.subtitle,
    color:
      template.color ||
      ([
        "logo",
        "wordmark",
        "frame",
        "invitation",
        "business-card",
        "greeting-card",
        "presentation",
      ].includes(template.style)
        ? "#334b3e"
        : "#ffffff"),
    fontSize: template.style === "business-card" ? 42 : 54,
    scale: 100,
    opacity: 100,
    photoInset:
      template.style === "photo-border" || template.style === "frame" ? 6 : 0,
    media: null,
    script: template.body || "",
    cells: rows,
    stylesheet: template.css,
    scenes: (
      template.scenes || [
        {
          name: mode === "present" ? "Slide 1" : "Scene 1",
          title: template.title,
          subtitle: template.subtitle,
          variant: template.variant,
          duration: 8,
        },
      ]
    ).map((scene) => ({ ...scene, id: crypto.randomUUID() })),
  };
}
