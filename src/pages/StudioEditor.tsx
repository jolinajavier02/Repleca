import { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ArrowUpRight,
  Check,
  Film,
  Image,
  Type,
  Shapes,
  Music2,
  LayoutTemplate,
  Upload,
  Search,
  Plus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  Trash2,
  Volume2,
  Crop,
  Layers,
  X,
  Download,
  Maximize2,
  Save,
} from "lucide-react";
import Brand from "../components/Brand";
import AccountMenu from "../components/AccountMenu";
import TemplateArtwork from "../components/TemplateArtwork";
import TemplateBrowser from "../components/TemplateBrowser";
import FormatSelect from "../components/FormatSelect";
import { canvasFormats, formatFields, projectSize } from "../lib/formats";
import { templateState } from "../lib/template-state";
import MediaThumbnail from "../components/MediaThumbnail";
import {
  addMedia,
  listMedia,
  getMedia,
  mediaDataUrl,
  portableProject,
} from "../lib/media";
import type { MediaAsset } from "../lib/media";
import {
  createProject,
  downloadFile,
  readProjects,
  saveProject,
} from "../lib/projects";
import type { StudioProject } from "../lib/projects";

const clock = (n: number) =>
  `${Math.floor(n / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(n % 60)
    .toString()
    .padStart(2, "0")}`;
const panels = [
  { id: "media", label: "Media", icon: Image },
  { id: "text", label: "Text", icon: Type },
  { id: "elements", label: "Elements", icon: Shapes },
  { id: "audio", label: "Audio", icon: Music2 },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "properties", label: "Properties", icon: Layers },
];

export default function StudioEditor({
  mode: rawMode,
  onNavigate,
}: {
  mode: string;
  onNavigate: (page: string) => void;
}) {
  const [mode, query] = rawMode.split("?");
  const [project, setProject] = useState<StudioProject>(() => {
    const params = new URLSearchParams(query);
    const existing = readProjects().find((p) => p.id === params.get("id"));
    if (existing) return existing;
    const fresh = createProject(mode);
    const template = Number(params.get("template"));
    if (
      params.has("template") &&
      Number.isInteger(template) &&
      template >= 0 &&
      template <= 5
    ) {
      fresh.scenes[0].variant = template;
      fresh.title = [
        "SLOW DAYS.",
        "a fresh perspective.",
        "Ideas worth sharing.",
        "SOUND GOOD.",
        "MAKE YOUR MARK.",
        "THE GOLDEN HOUR.",
      ][template];
      fresh.name = params.get("name") || fresh.name;
    }
    return fresh;
  });
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setStageSize({ width: el.clientWidth, height: el.clientHeight }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const [missingMedia, setMissingMedia] = useState(false);
  const [library, setLibrary] = useState<MediaAsset[]>([]);
  const [past, setPast] = useState<StudioProject[]>([]);
  const [future, setFuture] = useState<StudioProject[]>([]);
  const [panel, setPanel] = useState("media");
  const [selectedIndex, setSelected] = useState(0);
  const selected = Math.min(selectedIndex, project.scenes.length - 1);
  const [playing, setPlaying] = useState(false);
  const [playbackTime, setTime] = useState(0);
  const [search, setSearch] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const [assetsOpen, setAssetsOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [trim, setTrim] = useState<{ start: number; end: number } | null>(null);
  const trimRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeScene =
    project.scenes[Math.min(selected, project.scenes.length - 1)];
  const activeTitle = activeScene.title ?? project.title;
  const activeSubtitle = activeScene.subtitle ?? project.subtitle;
  const [canvasWidth, canvasHeight] = projectSize(project);
  const fittedWidth = Math.max(
    80,
    Math.min(
      (stageSize.width - 48) * 0.9,
      ((stageSize.height - 55) * canvasWidth) / canvasHeight,
    ),
  );
  const duration = project.scenes.reduce((sum, s) => sum + s.duration, 0);
  const time = Math.min(playbackTime, duration);
  const timed = mode === "video" || mode === "podcast";
  const edit = (changes: Partial<StudioProject>) => {
    if (
      !changes.scenes &&
      (changes.title !== undefined || changes.subtitle !== undefined) &&
      activeScene.title !== undefined
    ) {
      changes.scenes = project.scenes.map((scene, i) =>
        i === selected
          ? {
              ...scene,
              ...(changes.title !== undefined ? { title: changes.title } : {}),
              ...(changes.subtitle !== undefined
                ? { subtitle: changes.subtitle }
                : {}),
            }
          : scene,
      );
      if (selected !== 0) {
        changes.title = project.title;
        changes.subtitle = project.subtitle;
      }
    }
    setPast((p) => [...p.slice(-39), project]);
    setFuture([]);
    setProject((p) => ({
      ...p,
      ...changes,
      updated: new Date().toISOString(),
    }));
    setDirty(true);
  };
  const undo = () => {
    if (!past.length) return;
    setFuture((f) => [project, ...f]);
    setProject(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
    setDirty(true);
  };
  const redo = () => {
    if (!future.length) return;
    setPast((p) => [...p, project]);
    setProject(future[0]);
    setFuture((f) => f.slice(1));
    setDirty(true);
  };
  const save = () => {
    try {
      saveProject(project);
      setDirty(false);
      setNotice("Project saved on this device.");
    } catch {
      setNotice(
        "Your device storage is full. Download the project to keep your changes.",
      );
    }
  };
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(id);
  }, [notice]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      const next = Math.min(duration, time + 0.1);
      setTime(next);
      let end = 0;
      const index = project.scenes.findIndex((scene) => {
        end += scene.duration;
        return next < end;
      });
      setSelected(index < 0 ? project.scenes.length - 1 : index);
      if (next >= duration) setPlaying(false);
    }, 100);
    return () => clearInterval(timer);
  }, [playing, duration, time, project.scenes]);
  useEffect(() => {
    const media = videoRef.current || audioRef.current;
    if (!media) return;
    if (playing) {
      const start = project.scenes
        .slice(0, selected)
        .reduce((n, scene) => n + scene.duration, 0);
      const sourceTime = (activeScene.trimStart ?? start) + time - start;
      media.currentTime = Math.min(
        sourceTime,
        Number.isFinite(media.duration) ? media.duration : sourceTime,
      );
      void media.play().catch(() => {
        setPlaying(false);
        setNotice("This file could not be played in this browser.");
      });
    } else media.pause();
    // Playback position is set when the playback state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, project.media, selected]);
  useEffect(() => {
    if (exportOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [exportOpen]);
  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, [dirty]);
  useEffect(() => {
    let active = true;
    void listMedia()
      .then((files) => {
        if (active) setLibrary(files);
      })
      .catch(() => {});
    void Promise.resolve()
      .then(() => {
        if (!active) return;
        saveProject(project);
        const params = new URLSearchParams(query);
        if (!params.has("id")) {
          params.set("id", project.id);
          history.replaceState(null, "", `#/editor-${mode}?${params}`);
        }
      })
      .catch(() => {
        if (active)
          setNotice("Your project could not be saved. Check device storage.");
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const id = project.media?.assetId;
    if (!id) return;
    let active = true;
    let url = "";
    void getMedia(id)
      .then((asset) => {
        if (!active) return;
        if (!asset) {
          setMissingMedia(true);
          setNotice(
            "This media file was deleted. Choose a replacement from Media.",
          );
          return;
        }
        setMissingMedia(false);
        url = URL.createObjectURL(asset.blob);
        setProject((p) =>
          p.media?.assetId === id
            ? {
                ...p,
                media: {
                  ...p.media,
                  src: url,
                  name: asset.name,
                  type: asset.type,
                },
              }
            : p,
        );
      })
      .catch(() => {
        if (active) setNotice("Could not load this media file.");
      });
    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [project.media?.assetId]);
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      try {
        saveProject(project);
        setDirty(false);
      } catch {
        setNotice("Your device storage is full. Download your changes.");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [project, dirty]);
  const leave = () => {
    if (dirty) {
      try {
        saveProject(project);
      } catch {
        setNotice(
          "Storage is full. Please download your project before leaving.",
        );
        return;
      }
    }
    onNavigate("projects");
  };
  const seek = (value: number, keepPlaying = false) => {
    const next = Math.max(0, Math.min(duration, value));
    let end = 0;
    let index = project.scenes.findIndex((scene) => {
      end += scene.duration;
      return next < end;
    });
    if (index < 0) index = project.scenes.length - 1;
    setSelected(index);
    setTime(next);
    if (!keepPlaying) setPlaying(false);
    const start = project.scenes
      .slice(0, index)
      .reduce((n, scene) => n + scene.duration, 0);
    const sourceTime =
      (project.scenes[index].trimStart ?? start) + next - start;
    const media = videoRef.current || audioRef.current;
    if (media && media.readyState)
      media.currentTime = Math.min(
        sourceTime,
        Number.isFinite(media.duration) ? media.duration : sourceTime,
      );
  };
  const pickScene = (index: number, keepPlaying = false) => {
    seek(
      project.scenes
        .slice(0, index)
        .reduce((n, scene) => n + scene.duration, 0),
      keepPlaying,
    );
  };
  const clipWidths = project.scenes.map((scene) =>
    Math.max(190, scene.duration * 22),
  );
  const stripWidth = clipWidths.reduce((n, width) => n + width + 10, 0);
  const sceneStart = project.scenes
    .slice(0, selected)
    .reduce((n, scene) => n + scene.duration, 0);
  const playheadX =
    clipWidths.slice(0, selected).reduce((n, width) => n + width + 10, 0) +
    Math.max(0, Math.min(1, (time - sceneStart) / activeScene.duration)) *
      clipWidths[selected];
  useEffect(() => {
    if (!playing)
      sceneRefs.current.get(activeScene.id)?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
  }, [activeScene.id, playing]);
  useEffect(() => {
    const track = trackRef.current;
    if (
      playing &&
      track &&
      (playheadX > track.scrollLeft + track.clientWidth - 50 ||
        playheadX < track.scrollLeft)
    ) {
      track.scrollTo({ left: Math.max(0, playheadX - 80), behavior: "smooth" });
    }
  }, [playheadX, playing]);
  useEffect(() => {
    if (trim) trimRef.current?.showModal();
    else trimRef.current?.close();
  }, [trim]);
  const upload = async (file?: File) => {
    if (!file) return;
    if (!/^(image|video|audio)\//.test(file.type)) {
      setNotice(
        "Choose an image, video, or audio file. Other files can be imported in Media.",
      );
      return;
    }
    try {
      const asset = await addMedia(file);
      edit({
        media: {
          name: asset.name,
          src: "",
          type: asset.type,
          assetId: asset.id,
        },
      });
      setLibrary(await listMedia());
      setNotice(`${file.name} added to your project and stored in Media.`);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not save this file.");
    }
  };
  const splitScene = () => {
    const start = project.scenes
      .slice(0, selected)
      .reduce((n, s) => n + s.duration, 0);
    const offset = time - start;
    if (offset < 0.5 || offset > activeScene.duration - 0.5) {
      setNotice("Move the playhead inside a scene to split it.");
      return;
    }
    const scenes = [...project.scenes];
    scenes.splice(
      selected,
      1,
      { ...activeScene, duration: offset },
      {
        ...activeScene,
        id: crypto.randomUUID(),
        name: `${activeScene.name} (cut)`,
        duration: activeScene.duration - offset,
        trimStart: (activeScene.trimStart ?? start) + offset,
      },
    );
    edit({ scenes });
  };
  const exportArtwork = async () => {
    const [w, h] = projectSize(project);
    const xml = (str: string) =>
      str.replace(
        /[<>&"']/g,
        (c) =>
          ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
          })[c]!,
      );
    let imageSource = project.media?.src || "";
    if (project.media?.assetId && project.media.type.startsWith("image/")) {
      const asset = await getMedia(project.media.assetId);
      if (!asset) {
        setNotice(
          "This file was deleted. Choose another image before exporting.",
        );
        return;
      }
      imageSource = await mediaDataUrl(asset.blob);
    }
    const artwork = project.media?.type.startsWith("image/")
      ? `<image href="${xml(imageSource)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`
      : renderToStaticMarkup(
          <TemplateArtwork
            style={project.templateStyle}
            variant={activeScene.variant}
            aspect={w / h}
          />,
        ).replace("<svg", `<svg width="${w}" height="${h}"`);
    const canvas = canvasRef.current!;
    const bounds = canvas.getBoundingClientRect();
    const factor = w / bounds.width;
    const textSvg = (selector: string, content: string, weight: number) => {
      const element = canvas.querySelector(selector)!;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const fontSize = parseFloat(style.fontSize);
      const spacing = parseFloat(style.letterSpacing) || 0;
      const ctx = document.createElement("canvas").getContext("2d")!;
      const actualWeight = style.fontWeight || String(weight);
      ctx.font = `${actualWeight} ${fontSize}px ${style.fontFamily}`;
      const lines: string[] = [];
      let line = "";
      for (const char of content) {
        if (
          char === "\n" ||
          (line &&
            ctx.measureText(line + char).width + (line.length + 1) * spacing >
              rect.width)
        ) {
          lines.push(line);
          line = char === "\n" ? "" : char;
        } else line += char;
      }
      lines.push(line);
      return lines
        .map(
          (value, i) =>
            `<text x="${(rect.left - bounds.left + rect.width / 2) * factor}" y="${(rect.top - bounds.top + fontSize * 0.82 + i * (parseFloat(style.lineHeight) || fontSize * 1.2)) * factor}" text-anchor="middle" font-family="${xml(style.fontFamily)}" font-weight="${actualWeight}" font-size="${fontSize * factor}" letter-spacing="${spacing * factor}" fill="${project.color}">${xml(value)}</text>`,
        )
        .join("");
    };
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><clipPath id="canvas"><rect width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#canvas)"><rect width="${w}" height="${h}" fill="#fffdf7"/><g transform="translate(${w / 2} ${h / 2}) scale(${project.scale / 100}) translate(${-w / 2} ${-h / 2})" opacity="${project.opacity / 100}"><svg x="${(w * (project.photoInset || 0)) / 100}" y="${(h * (project.photoInset || 0)) / 100}" width="${w * (1 - (2 * (project.photoInset || 0)) / 100)}" height="${h * (1 - (2 * (project.photoInset || 0)) / 100)}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">${artwork}</svg></g>${textSvg(".canvas-text > span", activeTitle, 750)}${textSvg(".canvas-text > small", activeSubtitle, 500)}</g></svg>`;
    downloadFile(svg, "image/svg+xml", `${project.name}.svg`);
    setExportOpen(false);
    setNotice("Your artwork has been downloaded.");
  };
  return (
    <div className="editor-shell streamlined-editor">
      <style media="print">{`@page { size: ${canvasFormats.find((format) => format.id === project.formatId)?.paper || "A4"}; margin: 0; }`}</style>
      <header className="editor-header">
        <div className="editor-header-left">
          <Brand compact onClick={leave} />
          <span className="header-divider" />
          <div className="project-name">
            <input
              aria-label="Project name"
              value={project.name}
              onChange={(e) => edit({ name: e.target.value })}
            />
            <span>
              <span className={dirty ? "orange-dot" : "status-dot"} />
              {dirty ? "Unsaved changes" : "Local workspace"}{" "}
              <span className="project-mode">
                / {mode === "present" ? "Slides" : mode} studio
              </span>
            </span>
          </div>
        </div>
        <div className="editor-header-right">
          <button
            className="button button-orange small"
            onClick={() => setExportOpen(true)}
          >
            Export <ArrowUpRight size={16} />
          </button>
        </div>
      </header>
      <div className="editor-workspace">
        <nav className="editor-rail" aria-label="Editor tools">
          {panels.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={panel === id ? "active" : ""}
              onClick={() => {
                setPanel(id);
                setAssetsOpen(true);
                setSearch("");
              }}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>
          ))}
          <div className="rail-account">
            <AccountMenu
              onNavigate={onNavigate}
              onBeforeLogout={() => {
                try {
                  saveProject(project);
                  setDirty(false);
                  return true;
                } catch {
                  setNotice(
                    "Please download your project before signing out; device storage is full.",
                  );
                  return false;
                }
              }}
            />
            <span>Account</span>
          </div>
        </nav>
        <aside className={`asset-panel ${assetsOpen ? "mobile-open" : ""}`}>
          <div className="panel-heading">
            <h2>{panels.find((p) => p.id === panel)?.label}</h2>
            <span className="subtle-tag">YOUR TOOLKIT</span>
            <button
              className="icon-button mobile-close"
              aria-label="Close tool panel"
              onClick={() => setAssetsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          {panel === "media" && (
            <>
              <button
                className="upload-button"
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={17} /> Upload media
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                hidden
                onChange={(e) => {
                  upload(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <div className="search-field">
                <Search size={15} />
                <input
                  aria-label="Search media"
                  placeholder="Search your media"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="asset-subhead">
                Project media{" "}
                <span>{project.scenes.length + (project.media ? 1 : 0)}</span>
              </div>
              <div className="media-grid">
                {project.media &&
                  project.media.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) && (
                    <button
                      className="media-item imported"
                      onClick={() =>
                        setNotice(
                          "Your uploaded file is already on the canvas.",
                        )
                      }
                    >
                      <div>
                        {project.media.type.startsWith("image") ? (
                          <img
                            src={project.media.src}
                            alt={project.media.name}
                          />
                        ) : project.media.type.startsWith("video") ? (
                          <Film />
                        ) : (
                          <Music2 />
                        )}
                      </div>
                      <span>{project.media.name}</span>
                      <small>UPLOADED</small>
                    </button>
                  )}
                {project.scenes.map(
                  (scene, i) =>
                    scene.name.toLowerCase().includes(search.toLowerCase()) && (
                      <button
                        key={scene.id}
                        className={`media-item ${selected === i ? "active" : ""}`}
                        onClick={() => pickScene(i)}
                      >
                        <div>
                          <TemplateArtwork
                            style={project.templateStyle}
                            variant={scene.variant}
                            aspect={canvasWidth / canvasHeight}
                          />
                          <span className="media-duration">
                            {clock(scene.duration)}
                          </span>
                        </div>
                        <span>{scene.name}</span>
                        <small>STUDIO ILLUSTRATION</small>
                      </button>
                    ),
                )}
              </div>
              {!project.scenes.some((s) =>
                s.name.toLowerCase().includes(search.toLowerCase()),
              ) &&
                !project.media?.name
                  .toLowerCase()
                  .includes(search.toLowerCase()) && (
                  <p className="empty-message">No media matches your search.</p>
                )}
              <div
                className="upload-drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  upload(e.dataTransfer.files[0]);
                }}
              >
                <Upload size={22} />
                <p>A little something to start with?</p>
                <span>
                  Drop files here, or upload above.
                  <br />
                  Images, video, and audio
                </span>
              </div>
            </>
          )}
          {panel === "media" && library.length > 0 && (
            <section className="editor-library">
              <div className="asset-subhead">
                From your media <span>{library.length}</span>
              </div>
              <div className="media-grid">
                {library
                  .filter(
                    (asset) =>
                      /^(image|video|audio)\//.test(asset.type) &&
                      asset.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((asset) => (
                    <button
                      key={asset.id}
                      className="media-item"
                      onClick={() =>
                        edit({
                          media: {
                            name: asset.name,
                            type: asset.type,
                            assetId: asset.id,
                            src: "",
                          },
                        })
                      }
                    >
                      <div>
                        <MediaThumbnail asset={asset} />
                      </div>
                      <span>{asset.name}</span>
                    </button>
                  ))}
              </div>
            </section>
          )}
          {panel === "text" && (
            <>
              <p className="panel-description">
                The right words make it yours.
              </p>
              <button
                className="add-text-card"
                onClick={() =>
                  edit({ title: "Your next big idea", fontSize: 54 })
                }
              >
                Add a heading <Plus size={18} />
              </button>
              <button
                className="add-text-card subtitle"
                onClick={() =>
                  edit({ subtitle: "A LITTLE SPACE FOR YOUR STORY." })
                }
              >
                Add a subtitle <Plus size={16} />
              </button>
              <label className="field-label">
                Heading
                <textarea
                  value={activeTitle}
                  onChange={(e) => edit({ title: e.target.value })}
                />
              </label>
              <label className="field-label">
                Subtitle
                <textarea
                  value={activeSubtitle}
                  onChange={(e) => edit({ subtitle: e.target.value })}
                />
              </label>
            </>
          )}
          {panel === "elements" && (
            <>
              <p className="panel-description">
                Set the mood with a color story.
              </p>
              {["Earthy & easy", "A little daydream", "Golden hour"].map(
                (name, i) => (
                  <button
                    className={`palette-card ${i === activeScene.variant ? "active" : ""}`}
                    key={name}
                    onClick={() =>
                      edit({
                        media: null,
                        scenes: project.scenes.map((s, n) =>
                          n === selected ? { ...s, variant: i } : s,
                        ),
                      })
                    }
                  >
                    <TemplateArtwork
                      style={project.templateStyle}
                      variant={i}
                      aspect={canvasWidth / canvasHeight}
                    />
                    <span>{name}</span>
                    <ArrowUpRight size={16} />
                  </button>
                ),
              )}
            </>
          )}
          {panel === "audio" && (
            <>
              <div className="audio-illustration">
                <Music2 size={48} />
                <span>Every story has a rhythm.</span>
              </div>
              <p className="panel-description">
                Bring your own soundtrack. Upload an audio file to preview it
                with your project.
              </p>
              <button
                className="upload-button"
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={17} /> Upload audio
              </button>
              <input
                ref={inputRef}
                hidden
                type="file"
                accept="audio/*"
                onChange={(e) => upload(e.target.files?.[0])}
              />
              {project.media?.type.startsWith("audio") && (
                <div className="audio-file">
                  <Music2 size={18} />
                  <span>{project.media.name}</span>
                  <button
                    className="icon-button"
                    aria-label="Remove audio"
                    onClick={() => edit({ media: null })}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
              <p className="panel-footnote">
                Audio previews in your browser. Save a project file to keep your
                arrangement.
              </p>
            </>
          )}
          {panel === "templates" && (
            <TemplateBrowser
              mode={mode}
              compact
              onChoose={(template) => {
                const changes = templateState(template.id, mode);
                edit({
                  ...changes,
                  media: mode === "photo" ? project.media : null,
                });
                setSelected(0);
                setTime(0);
                setPlaying(false);
                setNotice(
                  `${template.name} applied. Use Undo to restore the previous layout.`,
                );
              }}
            />
          )}
          {panel === "properties" && (
            <>
              <div className="property-section">
                <div className="property-heading">
                  <span>Scene properties</span>
                  <span className="subtle-tag">
                    {String(selected + 1).padStart(2, "0")}
                  </span>
                </div>
                <label className="field-label">
                  Scene name
                  <input
                    value={activeScene.name}
                    onChange={(e) =>
                      edit({
                        scenes: project.scenes.map((s, i) =>
                          i === selected ? { ...s, name: e.target.value } : s,
                        ),
                      })
                    }
                  />
                </label>
                <div className="property-grid">
                  <label className="field-label">
                    Format
                    <FormatSelect
                      mode={mode}
                      value={project.formatId}
                      ratio={project.ratio}
                      label="Scene format"
                      onChange={(id) => edit(formatFields(id))}
                    />
                  </label>
                  <label className="field-label">
                    Duration (s)
                    <input
                      type="number"
                      min="0.5"
                      max="120"
                      step="0.1"
                      value={activeScene.duration}
                      onChange={(e) =>
                        edit({
                          scenes: project.scenes.map((s, i) =>
                            i === selected
                              ? {
                                  ...s,
                                  duration: Math.max(
                                    0.5,
                                    Math.min(
                                      120,
                                      Number(e.target.value) || 0.5,
                                    ),
                                  ),
                                }
                              : s,
                          ),
                        })
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="property-section">
                <div className="property-heading">Transform</div>
                {[
                  {
                    label: "Scale",
                    key: "scale" as const,
                    value: project.scale,
                    min: 70,
                    max: 150,
                  },
                  {
                    label: "Opacity",
                    key: "opacity" as const,
                    value: project.opacity,
                    min: 0,
                    max: 100,
                  },
                ].map(({ label, key, value, min, max }) => (
                  <label className="range-field" key={key}>
                    <span>
                      {label}
                      <b>{value}%</b>
                    </span>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={value}
                      onChange={(e) => edit({ [key]: Number(e.target.value) })}
                    />
                  </label>
                ))}
              </div>
              <div className="property-section">
                <div className="property-heading">
                  Typography <Type size={15} />
                </div>
                <label className="field-label">
                  Heading
                  <input
                    value={activeTitle}
                    onChange={(e) => edit({ title: e.target.value })}
                  />
                </label>
                <div className="property-grid">
                  <label className="field-label">
                    Size
                    <input
                      aria-label="Font size"
                      type="number"
                      min="18"
                      max="100"
                      value={project.fontSize}
                      onChange={(e) =>
                        edit({
                          fontSize: Math.max(
                            18,
                            Math.min(100, Number(e.target.value) || 18),
                          ),
                        })
                      }
                    />
                  </label>
                  <label className="field-label">
                    Color
                    <input
                      type="color"
                      aria-label="Text color"
                      value={project.color}
                      onChange={(e) => edit({ color: e.target.value })}
                    />
                  </label>
                </div>
                <div className="color-swatches">
                  {["#ffffff", "#242922", "#ef683e", "#efd28c", "#bdafcd"].map(
                    (color) => (
                      <button
                        key={color}
                        aria-label={`Set text color to ${color}`}
                        className={project.color === color ? "active" : ""}
                        style={{ background: color }}
                        onClick={() => edit({ color })}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="property-section">
                <div className="property-heading">Color story</div>
                <div className="scene-palettes">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      className={activeScene.variant === i ? "active" : ""}
                      aria-label={`Use color story ${i + 1}`}
                      onClick={() =>
                        edit({
                          media: null,
                          scenes: project.scenes.map((s, n) =>
                            n === selected ? { ...s, variant: i } : s,
                          ),
                        })
                      }
                    >
                      <TemplateArtwork
                        style={project.templateStyle}
                        variant={i}
                        aspect={canvasWidth / canvasHeight}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {project.media && (
                <button
                  className="text-button remove-media"
                  onClick={() => edit({ media: null })}
                >
                  <Trash2 size={14} /> Remove uploaded media
                </button>
              )}
            </>
          )}
        </aside>
        <main className="editor-main">
          <div
            className="canvas-stage"
            ref={stageRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              upload(e.dataTransfer.files[0]);
            }}
          >
            {mode === "script" ? (
              <div className="script-sheet">
                <span className="eyebrow">YOUR STORY STARTS HERE</span>
                <input
                  aria-label="Script title"
                  value={activeTitle}
                  onChange={(e) => edit({ title: e.target.value })}
                />
                <textarea
                  aria-label="Script content"
                  value={project.script}
                  onChange={(e) => edit({ script: e.target.value })}
                />
                <span>
                  {project.script.trim()
                    ? project.script.trim().split(/\s+/).length
                    : 0}{" "}
                  words · Make every one count.
                </span>
              </div>
            ) : (
              <div
                className={`editing-canvas layout-${project.templateStyle || "default"} ratio-${project.ratio.replace(":", "-")}`}
                ref={canvasRef}
                style={{
                  aspectRatio: project.ratio.replace(":", "/"),
                  width: `${fittedWidth}px`,
                  maxWidth: "100%",
                  maxHeight: "none",
                }}
              >
                <div
                  className="canvas-art"
                  style={{
                    transform: `scale(${project.scale / 100})`,
                    opacity: project.opacity / 100,
                    inset: `${project.photoInset || 0}%`,
                  }}
                >
                  {project.media?.assetId && !project.media.src ? (
                    <div className="canvas-file-state">
                      {missingMedia
                        ? "This file was removed from Media. Choose a replacement."
                        : "Opening your media…"}
                    </div>
                  ) : project.media?.type.startsWith("image") ? (
                    <img src={project.media.src} alt={project.media.name} />
                  ) : project.media?.type.startsWith("video") ? (
                    <video
                      ref={videoRef}
                      src={project.media.src}
                      muted={muted}
                      playsInline
                    />
                  ) : (
                    <TemplateArtwork
                      style={project.templateStyle}
                      variant={activeScene.variant}
                      aspect={canvasWidth / canvasHeight}
                    />
                  )}
                </div>
                <button
                  className={`canvas-text ${panel === "text" ? "selected-text" : ""}`}
                  onClick={() => {
                    setPanel("text");
                    setAssetsOpen(true);
                  }}
                  aria-label="Edit canvas text"
                  style={{ color: project.color }}
                >
                  <span
                    style={{
                      fontSize: `${project.fontSize / 7}cqw`,
                    }}
                  >
                    {activeTitle}
                  </span>
                  <small>{activeSubtitle}</small>
                  {panel === "text" && (
                    <>
                      <i className="handle tl" />
                      <i className="handle tr" />
                      <i className="handle bl" />
                      <i className="handle br" />
                    </>
                  )}
                </button>
                <span className="canvas-corner-tag">
                  {project.scenes.length > 1
                    ? `SCENE ${selected + 1}`
                    : "YOUR CREATION"}
                </span>
              </div>
            )}
            {project.media?.type.startsWith("audio") && (
              <audio ref={audioRef} src={project.media.src} muted={muted} />
            )}
          </div>
          <div className="canvas-bottom">
            <span>
              {mode === "script"
                ? "Draft"
                : `${canvasWidth} × ${canvasHeight} px`}
            </span>
            <div className="preview-actions">
              <button
                className="icon-button"
                disabled={!past.length}
                onClick={undo}
                aria-label="Undo"
              >
                <Undo2 size={17} />
              </button>
              <button
                className="icon-button"
                disabled={!future.length}
                onClick={redo}
                aria-label="Redo"
              >
                <Redo2 size={17} />
              </button>
              <span className="header-divider" />
              <button
                className="icon-button"
                aria-label="Full preview"
                onClick={() => {
                  if (document.fullscreenElement)
                    void document.exitFullscreen();
                  else
                    void stageRef.current
                      ?.requestFullscreen()
                      .catch(() =>
                        setNotice(
                          "Full preview is unavailable in this browser.",
                        ),
                      );
                }}
              >
                <Maximize2 size={17} />
              </button>
            </div>
          </div>
        </main>
      </div>
      <section
        className={`timeline ${!timed ? "scene-timeline" : ""}`}
        aria-label="Project timeline"
      >
        <div className="timeline-toolbar unified-transport">
          {timed && (
            <div className="transport-controls">
              <button
                className="play-button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => {
                  if (!playing && time >= duration) seek(0);
                  setPlaying(!playing);
                }}
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <span className="header-divider" />
              <button
                className="icon-button"
                aria-label="Previous scene"
                disabled={selected === 0 && time === 0}
                onClick={() => pickScene(Math.max(0, selected - 1), playing)}
              >
                <SkipBack size={17} />
              </button>
              <button
                className="icon-button"
                aria-label="Next scene"
                disabled={selected >= project.scenes.length - 1}
                onClick={() =>
                  pickScene(
                    Math.min(project.scenes.length - 1, selected + 1),
                    playing,
                  )
                }
              >
                <SkipForward size={17} />
              </button>
              <span className="playback-time">
                {clock(time)} <span>/ {clock(duration)}</span>
              </span>
              <input
                className="playback-seek"
                type="range"
                aria-label="Timeline playhead"
                min="0"
                max={duration}
                step="0.1"
                value={time}
                onChange={(event) => seek(Number(event.target.value), playing)}
              />
              <button
                className="icon-button"
                aria-label={muted ? "Unmute audio" : "Mute audio"}
                aria-pressed={muted}
                onClick={() => setMuted(!muted)}
              >
                <Volume2 size={16} opacity={muted ? 0.35 : 1} />
              </button>
            </div>
          )}
          <div className="timeline-edit-tools">
            {timed && (
              <>
                <span className="header-divider" />
                <button
                  className="icon-button"
                  aria-label="Split scene at playhead"
                  title="Split scene at playhead"
                  onClick={splitScene}
                >
                  <Scissors size={17} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Trim selected scene"
                  title="Trim selected scene"
                  onClick={() => {
                    setPlaying(false);
                    setTrim({ start: 0, end: activeScene.duration });
                  }}
                >
                  <Crop size={17} />
                </button>
              </>
            )}
            <button
              className="icon-button"
              aria-label="Duplicate selected scene"
              title="Duplicate selected scene"
              onClick={() => {
                const scenes = [...project.scenes];
                scenes.splice(selected + 1, 0, {
                  ...activeScene,
                  id: crypto.randomUUID(),
                  name: `${activeScene.name} copy`,
                });
                edit({ scenes });
                setPlaying(false);
                setTime(sceneStart + activeScene.duration);
                setSelected(selected + 1);
              }}
            >
              <Copy size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="Delete selected scene"
              title="Delete selected scene"
              disabled={project.scenes.length <= 1}
              onClick={() => {
                edit({
                  scenes: project.scenes.filter((_, i) => i !== selected),
                });
                setPlaying(false);
                setSelected(Math.max(0, selected - 1));
                setTime(
                  project.scenes
                    .slice(0, Math.max(0, selected - 1))
                    .reduce((n, scene) => n + scene.duration, 0),
                );
              }}
            >
              <Trash2 size={17} />
            </button>
          </div>
          <span className="timeline-total">
            {project.scenes.length} {mode === "present" ? "slides" : "scenes"}
            {!timed && ` · ${clock(duration)}`}
          </span>
        </div>
        <div className="scene-strip-scroll" ref={trackRef}>
          <div
            className="scene-strip-content"
            style={{ width: stripWidth + 120 }}
          >
            {timed && (
              <div className="scene-ruler">
                {project.scenes.map((scene, index) => (
                  <span
                    key={scene.id}
                    style={{ width: clipWidths[index] + 10 }}
                  >
                    {clock(
                      project.scenes
                        .slice(0, index)
                        .reduce((n, item) => n + item.duration, 0),
                    )}
                  </span>
                ))}
              </div>
            )}
            <div className="scene-track">
              {project.scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  ref={(node) => {
                    if (node) sceneRefs.current.set(scene.id, node);
                    else sceneRefs.current.delete(scene.id);
                  }}
                  className={`scene-clip ${selected === index ? "active" : ""}`}
                  style={{ width: clipWidths[index] }}
                  onClick={() => pickScene(index)}
                  aria-label={`Scene ${index + 1}: ${scene.name}`}
                  aria-pressed={selected === index}
                >
                  <TemplateArtwork
                    style={project.templateStyle}
                    variant={scene.variant}
                    aspect={canvasWidth / canvasHeight}
                  />
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {scene.name}
                    <small>{clock(scene.duration)}</small>
                  </div>
                </button>
              ))}
              <button
                className="add-scene-tile"
                aria-label="Add scene"
                onClick={() => {
                  edit({
                    scenes: [
                      ...project.scenes,
                      {
                        id: crypto.randomUUID(),
                        name: "A new idea",
                        variant: project.scenes.length % 3,
                        duration: 8,
                      },
                    ],
                  });
                  setPlaying(false);
                  setTime(duration);
                  setSelected(project.scenes.length);
                }}
              >
                <Plus size={25} />
                <span>{mode === "present" ? "Add slide" : "Add scene"}</span>
              </button>
            </div>
            {timed && project.media?.type.startsWith("audio") && (
              <button
                className="audio-track has-audio"
                style={{ width: stripWidth - 10 }}
                onClick={() => {
                  setPanel("audio");
                  setAssetsOpen(true);
                }}
              >
                <Music2 size={14} />
                {project.media.name}
              </button>
            )}
            {timed && (
              <div className="timeline-playhead" style={{ left: playheadX }}>
                <span />
              </div>
            )}
          </div>
        </div>
      </section>
      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {notice}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      <dialog
        ref={trimRef}
        className="export-dialog trim-dialog"
        onCancel={() => setTrim(null)}
      >
        <button
          className="icon-button dialog-close"
          aria-label="Close trim"
          onClick={() => setTrim(null)}
        >
          <X size={20} />
        </button>
        <h2>Trim scene</h2>
        <p>
          Choose the portion to keep from {activeScene.name}. Minimum length:
          0.5 seconds.
        </p>
        {trim && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (
                trim.start < 0 ||
                trim.end > activeScene.duration ||
                trim.end - trim.start < 0.5
              )
                return;
              edit({
                scenes: project.scenes.map((scene, index) =>
                  index === selected
                    ? {
                        ...scene,
                        duration: Number((trim.end - trim.start).toFixed(2)),
                        trimStart: (scene.trimStart ?? sceneStart) + trim.start,
                      }
                    : scene,
                ),
              });
              setTime(sceneStart);
              setTrim(null);
            }}
          >
            <label>
              Start (seconds)
              <input
                aria-label="Trim start"
                type="number"
                min="0"
                max={Math.max(0, trim.end - 0.5)}
                step="0.1"
                required
                value={trim.start}
                onChange={(event) =>
                  setTrim({ ...trim, start: Number(event.target.value) })
                }
              />
            </label>
            <label>
              End (seconds)
              <input
                aria-label="Trim end"
                type="number"
                min={trim.start + 0.5}
                max={activeScene.duration}
                step="0.1"
                required
                value={trim.end}
                onChange={(event) =>
                  setTrim({ ...trim, end: Number(event.target.value) })
                }
              />
            </label>
            <button className="button button-primary" type="submit">
              Apply trim
            </button>
          </form>
        )}
      </dialog>
      <dialog
        ref={dialogRef}
        className="export-dialog"
        onCancel={() => setExportOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setExportOpen(false);
        }}
      >
        <button
          className="icon-button dialog-close"
          onClick={() => setExportOpen(false)}
          aria-label="Close export"
        >
          <X size={20} />
        </button>
        <div className="export-icon">
          <Download size={25} />
        </div>
        <div className="eyebrow">READY FOR ITS NEXT CHAPTER.</div>
        <h2>Take your idea with you.</h2>
        <p>Save your editable project or download your current artwork.</p>
        <button className="export-option" onClick={save}>
          <Save size={22} />
          <span>
            <b>Save project</b>
            <small>
              {dirty
                ? "Save your latest changes on this device"
                : "All changes saved on this device"}
            </small>
          </span>
          <Check size={19} />
        </button>
        {mode === "printing" && (
          <button className="export-option" onClick={() => window.print()}>
            <Download size={22} />
            <span>
              <b>Print artwork</b>
              <small>Open your printer settings</small>
            </span>
            <ArrowUpRight size={19} />
          </button>
        )}
        <button
          className="export-option"
          onClick={async () => {
            try {
              const portable = await portableProject(project);
              downloadFile(
                JSON.stringify(portable, null, 2),
                "application/json",
                `${project.name}.repleca.json`,
              );
              setExportOpen(false);
            } catch (error) {
              setNotice(
                error instanceof Error
                  ? error.message
                  : "Could not export this project.",
              );
            }
          }}
        >
          <Save size={22} />
          <span>
            <b>Project file</b>
            <small>Editable arrangement, settings, and uploaded media</small>
          </span>
          <ArrowUpRight size={19} />
        </button>
        {mode === "script" ? (
          <button
            className="export-option"
            onClick={() => {
              downloadFile(
                `${project.title}\n\n${project.script}`,
                "text/plain",
                `${project.name}.txt`,
              );
              setExportOpen(false);
            }}
          >
            <Type size={22} />
            <span>
              <b>Script document</b>
              <small>Plain text · ready for your next draft</small>
            </span>
            <ArrowUpRight size={19} />
          </button>
        ) : (
          <button
            className="export-option"
            disabled={project.media?.type.startsWith("video")}
            onClick={() => {
              void exportArtwork().catch(() =>
                setNotice(
                  "This artwork could not be exported. Try replacing the media file.",
                ),
              );
            }}
          >
            <Image size={22} />
            <span>
              <b>Current artwork</b>
              <small>SVG image · {project.ratio} · current scene</small>
            </span>
            <ArrowUpRight size={19} />
          </button>
        )}
        <p className="export-note">
          Video and audio rendering aren’t available in this local workspace.
          Your project file keeps your arrangement for later.
        </p>
      </dialog>
    </div>
  );
}
