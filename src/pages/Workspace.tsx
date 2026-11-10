import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Search,
  LayoutGrid,
  Folder,
  Image,
  LayoutTemplate,
  Download,
  Settings,
  ChevronDown,
  Upload,
  MoreHorizontal,
  Pencil,
  Copy,
  List,
  Trash2,
  X,
  Check,
  Menu,
} from "lucide-react";
import Brand from "../components/Brand";
import AccountMenu from "../components/AccountMenu";
import StudioArtwork from "../components/StudioArtwork";
import ProjectThumbnail from "../components/ProjectThumbnail";
import MediaLibrary from "./MediaLibrary";
import ExportCenter from "./ExportCenter";
import SettingsPage from "./SettingsPage";
import {
  readProjects,
  saveProject,
  projectStorageKey,
  startProject,
} from "../lib/projects";
import { addMedia, portableProject } from "../lib/media";
import TemplateBrowser from "../components/TemplateBrowser";
import { projectTemplates } from "../lib/templates";
import { canvasFormats, validRatio } from "../lib/formats";
import { studioTypes } from "../lib/studio-types";
import NewProjectDialog from "../components/NewProjectDialog";
import { useAuth } from "../lib/auth";
import type { StudioProject } from "../lib/projects";

const navItems = [
  { id: "home", label: "Your workspace", icon: LayoutGrid },
  { id: "projects", label: "My projects", icon: Folder },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "media", label: "Media library", icon: Image },
];
export default function Workspace({
  view,
  onNavigate,
  onAuthRequested,
}: {
  view: string;
  onNavigate: (page: string) => void;
  onAuthRequested?: (mode: "login" | "signup") => void;
}) {
  const { user } = useAuth();
  const [loginPrompt, setLoginPrompt] = useState(false);
  const loginDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = loginDialog.current;
    if (loginPrompt) el?.showModal();
    else el?.close();
  }, [loginPrompt]);
  const requestAuth = (mode: "login" | "signup") => {
    setLoginPrompt(false);
    if (onAuthRequested) onAuthRequested(mode);
    else onNavigate("auth");
  };
  const [projects, setProjects] = useState(readProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [list, setList] = useState(false);
  const [newMode, setNewMode] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [projectMenu, setProjectMenu] = useState<string | null>(null);
  const [renameProject, setRenameProject] = useState<StudioProject | null>(
    null,
  );
  const [renameValue, setRenameValue] = useState("");
  const renameDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (renameProject) renameDialog.current?.showModal();
    else renameDialog.current?.close();
  }, [renameProject]);
  useEffect(() => {
    if (!projectMenu) return;
    const close = (e: PointerEvent) => {
      if (e.target instanceof Element && !e.target.closest(".project-options"))
        setProjectMenu(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [projectMenu]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const navigate = (page: string) => {
    setMobileMenu(false);
    setSearch("");
    setFilter("All");
    onNavigate(page);
  };
  const importProject = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const p = JSON.parse(String(reader.result)) as StudioProject;
        if (
          !p.id ||
          typeof p.name !== "string" ||
          (!studioTypes.some((type) => type.id === p.mode) &&
            !["podcast", "script", "social"].includes(p.mode)) ||
          !Array.isArray(p.scenes) ||
          !p.scenes.length ||
          p.scenes.some(
            (s) =>
              typeof s.name !== "string" ||
              !Number.isFinite(s.duration) ||
              s.duration < 1 ||
              !Number.isInteger(s.variant) ||
              s.variant < 0 ||
              s.variant > 5,
          ) ||
          !validRatio(p.ratio) ||
          ((p.width !== undefined || p.height !== undefined) &&
            ![p.width, p.height].every(
              (size) =>
                typeof size === "number" &&
                Number.isFinite(size) &&
                size > 0 &&
                size <= 20000,
            )) ||
          typeof p.title !== "string" ||
          typeof p.subtitle !== "string" ||
          typeof p.script !== "string" ||
          (p.stylesheet !== undefined && typeof p.stylesheet !== "string") ||
          (p.cells !== undefined &&
            (!Array.isArray(p.cells) ||
              !p.cells.length ||
              p.cells.length > 500 ||
              p.cells.some(
                (row) =>
                  !Array.isArray(row) ||
                  !row.length ||
                  row.length > 50 ||
                  row.some((cell) => typeof cell !== "string"),
              ))) ||
          !/^#[0-9a-f]{6}$/i.test(p.color) ||
          ![p.scale, p.opacity, p.fontSize].every(Number.isFinite) ||
          (p.media &&
            (!/^data:(image|video|audio)\//.test(p.media.src) ||
              !/^(image|video|audio)\//.test(p.media.type)))
        )
          throw new Error();
        if (p.media?.src.startsWith("data:")) {
          const blob = await (await fetch(p.media.src)).blob();
          const asset = await addMedia(
            new File([blob], p.media.name, { type: p.media.type }),
          );
          p.media = {
            name: asset.name,
            type: asset.type,
            assetId: asset.id,
            src: "",
          };
        }
        saveProject(p);
        setProjects(readProjects());
        setNotice("Your project is ready. Open it below.");
      } catch {
        setNotice(
          "This project could not be imported. Choose a valid Repleca project file and check available device storage.",
        );
      }
    };
    reader.readAsText(file);
  };
  const removeProject = (id: string) => {
    try {
      const next = projects.filter((p) => p.id !== id);
      localStorage.setItem(projectStorageKey(), JSON.stringify(next));
      setProjects(next);
      setDeleteId(null);
    } catch {
      setNotice("Could not update device storage. Try again.");
    }
  };
  const visibleProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" ||
        p.mode === studioTypes.find((s) => s.label === filter)?.id),
  );
  return (
    <div
      className="workspace-shell"
      onClickCapture={(event) => {
        if (user || !(event.target instanceof Element)) return;
        if (event.target.closest("[data-guest-allowed]")) return;
        if (event.target.closest("button, a")) {
          event.preventDefault();
          event.stopPropagation();
          setLoginPrompt(true);
        }
      }}
    >
      <aside className={`workspace-sidebar ${mobileMenu ? "is-open" : ""}`}>
        <div data-guest-allowed>
          <Brand onClick={() => navigate("home")} />
        </div>
        {user ? (
          <AccountMenu placement="sidebar" onNavigate={onNavigate} />
        ) : (
          <button className="workspace-switcher">
            <span className="workspace-avatar">G</span>
            <span>
              Your creative space<small>Guest workspace</small>
            </span>
            <ChevronDown size={15} />
          </button>
        )}
        <div className="sidebar-label">MAKE YOURSELF AT HOME</div>
        <nav aria-label="Workspace navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => navigate(id)}
            >
              <Icon size={18} />
              {label}
              {id === "projects" && (
                <span className="nav-count">{projects.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-label">A LITTLE MORE</div>
        <nav>
          {[
            { id: "exports", label: "Exports", icon: Download },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => navigate(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-tip">
          <span>✳</span>
          <h3>Big ideas live here.</h3>
          <p>Try something new. Make a little mess. Find your flow.</p>
          <button className="text-button" onClick={() => setNewMode("video")}>
            Start creating <ArrowUpRight size={15} />
          </button>
        </div>
      </aside>
      {mobileMenu && (
        <button
          className="sidebar-scrim"
          data-guest-allowed
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <main className="workspace-main">
        <button
          className="icon-button workspace-menu workspace-menu-floating"
          data-guest-allowed
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        {["home", "projects", "templates"].includes(view) ? (
          <div className="workspace-content">
            <div className="workspace-page-heading">
              <div>
                <div className="eyebrow">
                  {view === "home"
                    ? "A GOOD DAY TO MAKE SOMETHING."
                    : view === "templates"
                      ? "YOUR NEXT IDEA STARTS HERE."
                      : "ALL YOUR LITTLE BIG IDEAS."}
                </div>
                <h1>
                  {view === "home"
                    ? user
                      ? `Hello, ${user.name.split(" ")[0]}.`
                      : "Hello, creative human."
                    : view === "templates"
                      ? "A little inspiration."
                      : "Made by you."}
                  <span className="heading-star">✳</span>
                </h1>
                <p>
                  {view === "home"
                    ? "What will you bring to life today?"
                    : view === "templates"
                      ? "Find a starting point. Then make it entirely your own."
                      : "Your projects, drafts, and works in progress. All in one happy place."}
                </p>
              </div>
              <div className="new-project-wrap">
                <button
                  className="button button-orange"
                  onClick={() => setNewMode("video")}
                >
                  <Plus size={18} /> New project <ChevronDown size={14} />
                </button>
              </div>
            </div>
            {view === "home" && (
              <>
                <div className="workspace-banner">
                  <div>
                    <span className="eyebrow">
                      A LITTLE SPACE. ENDLESS POSSIBILITIES.
                    </span>
                    <h2>Go on. Make your thing.</h2>
                    <p>Your ideas deserve more than a notes app.</p>
                    <button
                      className="button button-dark small"
                      onClick={() => setNewMode("video")}
                    >
                      Find your flow
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                  <div className="banner-art">
                    <StudioArtwork variant={5} />
                    <span>
                      GOOD THINGS
                      <br />
                      <i>start here.</i>
                    </span>
                  </div>
                </div>
                <div className="create-types">
                  {studioTypes.map(({ id, label, desc, icon: Icon, color }) => (
                    <button key={id} onClick={() => setNewMode(id)}>
                      <span className={`create-icon ${color}`}>
                        <Icon size={22} />
                      </span>
                      <div>
                        <h3>{label}</h3>
                        <p>{desc}</p>
                      </div>
                      <ArrowUpRight size={16} />
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="work-section-heading">
              <h2>
                {view === "templates"
                  ? "Find your starting point"
                  : view === "home"
                    ? "Your recent projects"
                    : "Your projects"}{" "}
                <span>
                  {view === "templates"
                    ? projectTemplates.length
                    : projects.length}
                </span>
              </h2>
              {view !== "templates" && (
                <div>
                  {view !== "templates" && (
                    <button
                      className="text-button"
                      onClick={() => importRef.current?.click()}
                    >
                      <Upload size={15} /> Import project
                    </button>
                  )}
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json,.json"
                    hidden
                    onChange={(e) => importProject(e.target.files?.[0])}
                  />
                  <button
                    className={`icon-button ${!list ? "selected-view" : ""}`}
                    aria-label="Grid view"
                    onClick={() => setList(false)}
                  >
                    <LayoutGrid size={17} />
                  </button>
                  <button
                    className={`icon-button ${list ? "selected-view" : ""}`}
                    aria-label="List view"
                    onClick={() => setList(true)}
                  >
                    <List size={17} />
                  </button>
                </div>
              )}
            </div>
            {view !== "templates" && (
              <div className="project-filters">
                <div>
                  {["All", ...studioTypes.map((type) => type.label)].map(
                    (f) => (
                      <button
                        key={f}
                        className={filter === f ? "active" : ""}
                        onClick={() => setFilter(f)}
                      >
                        {f}
                      </button>
                    ),
                  )}
                </div>
                <div className="search-field">
                  <Search size={16} />
                  <input
                    aria-label="Search projects or templates"
                    placeholder={
                      view === "templates"
                        ? "Find a template…"
                        : "Find a project…"
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            )}
            {view === "templates" ? (
              <TemplateBrowser
                onChoose={(template) => {
                  try {
                    const format = canvasFormats.find(
                      (f) => f.id === template.formatId,
                    )!;
                    const project = startProject({
                      name: template.name,
                      mode: template.mode,
                      ratio: format.ratio,
                      formatId: format.id,
                      templateId: template.id,
                    });
                    setProjects(readProjects());
                    navigate(`editor-${project.mode}?id=${project.id}`);
                  } catch (error) {
                    setNotice(
                      error instanceof Error
                        ? error.message
                        : "Could not create this project.",
                    );
                  }
                }}
              />
            ) : visibleProjects.length ? (
              <div className={`workspace-projects ${list ? "list-view" : ""}`}>
                {visibleProjects.map((p) => (
                  <div className="workspace-project-card" key={p.id}>
                    <button
                      className="project-thumbnail"
                      onClick={() => navigate(`editor-${p.mode}?id=${p.id}`)}
                    >
                      <ProjectThumbnail project={p} />
                      <strong>{p.title}</strong>
                      <span className="project-open">
                        <ArrowUpRight size={20} />
                      </span>
                    </button>
                    <div className="project-card-meta">
                      <button
                        onClick={() => navigate(`editor-${p.mode}?id=${p.id}`)}
                      >
                        <h3>{p.name}</h3>
                        <span>
                          {studioTypes.find((t) => t.id === p.mode)?.label} ·{" "}
                          {new Date(p.updated).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </button>
                      {deleteId === p.id ? (
                        <div className="delete-confirm">
                          <span>Delete?</span>
                          <button
                            className="icon-button"
                            aria-label={`Confirm delete ${p.name}`}
                            onClick={() => removeProject(p.id)}
                          >
                            <Check size={15} />
                          </button>
                          <button
                            className="icon-button"
                            aria-label="Cancel delete"
                            onClick={() => setDeleteId(null)}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <div className="project-options">
                          <button
                            className="icon-button"
                            aria-label={`Options for project ${p.name}`}
                            aria-expanded={projectMenu === p.id}
                            onClick={() =>
                              setProjectMenu(projectMenu === p.id ? null : p.id)
                            }
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {projectMenu === p.id && (
                            <div className="file-action-menu">
                              <button
                                onClick={() =>
                                  navigate(`editor-${p.mode}?id=${p.id}`)
                                }
                              >
                                <Pencil size={14} />
                                Edit project
                              </button>
                              <button
                                onClick={() => {
                                  setRenameProject(p);
                                  setRenameValue(p.name);
                                  setProjectMenu(null);
                                }}
                              >
                                <Pencil size={14} />
                                Rename
                              </button>
                              <button
                                onClick={() => {
                                  try {
                                    saveProject({
                                      ...p,
                                      id: crypto.randomUUID(),
                                      name: `${p.name} copy`,
                                      updated: new Date().toISOString(),
                                    });
                                    setProjects(readProjects());
                                    setProjectMenu(null);
                                  } catch {
                                    setNotice(
                                      "Could not copy this project. Check device storage.",
                                    );
                                  }
                                }}
                              >
                                <Copy size={14} />
                                Make a copy
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const portable = await portableProject(p);
                                    const { downloadFile } =
                                      await import("../lib/projects");
                                    downloadFile(
                                      JSON.stringify(portable, null, 2),
                                      "application/json",
                                      `${p.name}.repleca.json`,
                                    );
                                    setProjectMenu(null);
                                  } catch (error) {
                                    setNotice(
                                      error instanceof Error
                                        ? error.message
                                        : "Could not download this project.",
                                    );
                                  }
                                }}
                              >
                                <Download size={14} />
                                Download project
                              </button>
                              <button
                                className="danger-text"
                                onClick={() => {
                                  setDeleteId(p.id);
                                  setProjectMenu(null);
                                }}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="projects-empty">
                <div className="empty-icon">
                  <Folder size={30} />
                  <span>✳</span>
                </div>
                <h3>
                  {projects.length
                    ? "No projects found."
                    : "A little space for your next big idea."}
                </h3>
                <p>
                  {projects.length
                    ? "Try another search or filter."
                    : "Create your first project and save it here. Your creative journey starts with a little something."}
                </p>
                <button
                  className="button button-outline small"
                  onClick={() => setNewMode("video")}
                >
                  Make something new
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        ) : view === "media" ? (
          <MediaLibrary onNavigate={navigate} />
        ) : (
          <div className="legacy-page">
            {view === "exports" && <ExportCenter />}
            {view === "settings" && <SettingsPage />}
          </div>
        )}
        <footer className="workspace-footer">
          <span>A happy place for big ideas.</span>
          <span>Made for your creative flow. ✳</span>
        </footer>
      </main>
      <dialog
        ref={renameDialog}
        className="export-dialog"
        aria-labelledby="rename-project-title"
        onCancel={() => setRenameProject(null)}
      >
        <button
          className="icon-button dialog-close"
          aria-label="Close rename project"
          onClick={() => setRenameProject(null)}
        >
          <X size={18} />
        </button>
        <h2 id="rename-project-title">Rename your project.</h2>
        <form
          className="new-project-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!renameProject || !renameValue.trim()) return;
            try {
              saveProject({
                ...renameProject,
                name: renameValue.trim(),
                updated: new Date().toISOString(),
              });
              setProjects(readProjects());
              setRenameProject(null);
            } catch {
              setNotice("Could not rename this project. Check device storage.");
            }
          }}
        >
          <label>
            Project name
            <input
              aria-label="New project name"
              required
              maxLength={100}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
            />
          </label>
          <div className="new-project-actions">
            <button
              type="button"
              className="button button-outline small"
              onClick={() => setRenameProject(null)}
            >
              Cancel
            </button>
            <button type="submit" className="button button-orange small">
              Save name
            </button>
          </div>
        </form>
      </dialog>
      {newMode && (
        <NewProjectDialog
          initialMode={newMode}
          onClose={() => setNewMode(null)}
          onCreated={(project) => {
            setProjects(readProjects());
            setNewMode(null);
            navigate(`editor-${project.mode}?id=${project.id}`);
          }}
        />
      )}
      <dialog
        ref={loginDialog}
        data-guest-allowed
        className="export-dialog guest-login-dialog"
        aria-labelledby="guest-login-title"
        onCancel={() => setLoginPrompt(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLoginPrompt(false);
        }}
      >
        <button
          className="icon-button dialog-close"
          aria-label="Close login reminder"
          onClick={() => setLoginPrompt(false)}
        >
          <X size={19} />
        </button>
        <div className="export-icon">
          <span className="orange-text">✳</span>
        </div>
        <div className="eyebrow">YOUR IDEAS DESERVE A PLACE.</div>
        <h2 id="guest-login-title">Log in to make it yours.</h2>
        <p>
          Create projects, try the tools, and save your work with your own
          account.
        </p>
        <div className="guest-login-actions">
          <button
            className="button button-orange"
            onClick={() => requestAuth("login")}
          >
            Log in <ArrowUpRight size={16} />
          </button>
          <button
            className="button button-outline"
            onClick={() => requestAuth("signup")}
          >
            Create an account <Plus size={16} />
          </button>
        </div>
        <button
          className="text-button guest-keep-browsing"
          onClick={() => setLoginPrompt(false)}
        >
          Keep looking around
        </button>
      </dialog>
      {notice && (
        <div className="toast" role="status">
          {notice}
          <button
            className="icon-button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
