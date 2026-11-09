export type Scene = {
  id: string;
  name: string;
  variant: number;
  duration: number;
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
  media: { name: string; src: string; type: string } | null;
  script: string;
  updated: string;
};
let projectOwner: string | null = null;
export function setProjectOwner(id: string | null) {
  projectOwner = id;
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
    JSON.stringify([project, ...projects.filter((p) => p.id !== project.id)]),
  );
}
export function createProject(mode: string): StudioProject {
  return {
    id: crypto.randomUUID(),
    mode,
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
    ratio: mode === "image" ? "1:1" : "16:9",
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
export function downloadFile(content: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
