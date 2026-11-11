import { studioTypes } from "./studio-types";
import { defaultFormat, formatFields, validRatio } from "./formats";
import { templateState } from "./template-state";
export type Scene = {
  id: string;
  name: string;
  variant: number;
  duration: number;
  trimStart?: number;
  title?: string;
  subtitle?: string;
};
export type StudioProject = {
  id: string;
  name: string;
  mode: string;
  title: string;
  subtitle: string;
  color: string;
  fontSize: number;
  scale: number;
  opacity: number;
  ratio: string;
  scenes: Scene[];
  media: { name: string; src: string; type: string; assetId?: string } | null;
  script: string;
  updated: string;
  cells?: string[][];
  stylesheet?: string;
  formatId?: string;
  width?: number;
  height?: number;
  templateId?: string;
  templateStyle?: string;
  templateNote?: string;
  photoInset?: number;
};
let projectOwner: string | null = null;
export function setProjectOwner(id: string | null) {
  projectOwner = id;
}
export function accountStorageOwner() {
  if (!projectOwner) throw new Error("Please log in to access your files.");
  return projectOwner;
}
export function projectStorageKey() {
  if (!projectOwner) throw new Error("Please log in to access your projects.");
  return `repleca-projects:${projectOwner}`;
}
export function readProjects(): StudioProject[] {
  try {
    const stored = JSON.parse(
      localStorage.getItem(projectStorageKey()) || "[]",
    );
    return Array.isArray(stored)
      ? stored.filter(
          (p) => p && typeof p.id === "string" && Array.isArray(p.scenes),
        )
      : [];
  } catch {
    return [];
  }
}
export function saveProject(project: StudioProject) {
  const projects = readProjects();
  localStorage.setItem(
    projectStorageKey(),
    JSON.stringify([
      {
        ...project,
        media: project.media?.assetId
          ? { ...project.media, src: "" }
          : project.media,
      },
      ...projects.filter((p) => p.id !== project.id),
    ]),
  );
}
export function createProject(mode: string): StudioProject {
  return {
    id: crypto.randomUUID(),
    mode,
    ...(defaultFormat(mode) ? formatFields(defaultFormat(mode).id) : {}),
    name:
      mode === "image"
        ? "A fresh perspective"
        : mode === "present"
          ? "Ideas worth sharing"
          : mode === "podcast"
            ? "The slow days podcast"
            : mode === "script"
              ? "A story starts here"
              : "The slow days edit",
    title:
      mode === "image"
        ? "a fresh perspective."
        : mode === "present"
          ? "Ideas worth sharing."
          : "SLOW DAYS.",
    subtitle: "GOOD THINGS TAKE THEIR TIME.",
    color: "#ffffff",
    fontSize: 54,
    scale: 100,
    opacity: 100,
    ratio: defaultFormat(mode)?.ratio || (mode === "image" ? "1:1" : "16:9"),
    scenes: [
      {
        id: crypto.randomUUID(),
        name: "A little escape",
        variant:
          mode === "image"
            ? 1
            : mode === "present"
              ? 2
              : mode === "podcast"
                ? 3
                : mode === "script"
                  ? 4
                  : 0,
        duration: 8,
      },
      {
        id: crypto.randomUUID(),
        name: "A new perspective",
        variant: 1,
        duration: 8,
      },
      {
        id: crypto.randomUUID(),
        name: "The golden hour",
        variant: 2,
        duration: 8,
      },
    ],
    media: null,
    script:
      "Some days are made for slowing down.\n\nFor finding a little space. A fresh perspective.\n\nAnd making something that feels like you.",
    updated: new Date().toISOString(),
  };
}
export function startProject({
  name,
  mode,
  ratio,
  formatId,
  templateId,
}: {
  name: string;
  mode: string;
  ratio: string;
  formatId?: string;
  templateId?: string;
}): StudioProject {
  if (!name.trim() || name.trim().length > 100)
    throw new Error("Give your project a name (1–100 characters).");
  if (!studioTypes.some((type) => type.id === mode))
    throw new Error("Choose a project type.");
  if (!validRatio(ratio)) throw new Error("Choose a canvas format.");
  const project = createProject(mode);
  project.name = name.trim();
  project.title = name.trim();
  project.subtitle = "";
  project.script =
    mode === "website"
      ? `<main class="page">
  <p>YOUR NEXT GREAT THING</p>
  <h1>Hello, world.</h1>
  <p>Make this little corner of the internet yours.</p>
</main>`
      : "";
  if (mode === "website")
    project.stylesheet =
      "body { margin: 0; background: #f5f2e8; color: #303b2c; font-family: system-ui, sans-serif; } .page { padding: 80px 40px; max-width: 760px; margin: auto; } h1 { font-size: 64px; letter-spacing: -3px; } p { line-height: 1.8; }";
  if (mode === "excel")
    project.cells = Array.from({ length: 20 }, () => Array(8).fill(""));
  project.ratio = ratio;
  project.scenes = [
    { ...project.scenes[0], name: mode === "present" ? "Slide 1" : "Scene 1" },
  ];
  if (templateId) Object.assign(project, templateState(templateId, mode));
  if (formatId) Object.assign(project, formatFields(formatId));
  else if (!templateId) {
    project.ratio = ratio;
    if (project.ratio !== defaultFormat(mode)?.ratio) {
      project.formatId = undefined;
      project.width = undefined;
      project.height = undefined;
    }
  }
  project.name = name.trim();
  saveProject(project);
  return project;
}
export function downloadFile(content: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
