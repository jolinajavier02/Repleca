import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Search,
  LayoutGrid,
  Folder,
  Image,
  LayoutTemplate,
  Palette,
  ChartNoAxesCombined,
  Download,
  Settings,
  Film,
  Presentation,
  Mic,
  Type,
  ChevronDown,
  ArrowLeft,
  Upload,
  List,
  Trash2,
  X,
  Check,
  Menu,
} from "lucide-react";
import Brand from "../components/Brand";
import AccountMenu from "../components/AccountMenu";
import StudioArtwork from "../components/StudioArtwork";
import MediaLibrary from "./MediaLibrary";
import BrandKit from "./BrandKit";
import AnalyticsDashboard from "./AnalyticsDashboard";
import ExportCenter from "./ExportCenter";
import SettingsPage from "./SettingsPage";
import { readProjects, saveProject, projectStorageKey } from "../lib/projects";
import type { StudioProject } from "../lib/projects";

const navItems = [
  { id: "home", label: "Your workspace", icon: LayoutGrid },
  { id: "projects", label: "My projects", icon: Folder },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "media", label: "Media library", icon: Image },
  { id: "brand", label: "Brand kit", icon: Palette },
];
const studioTypes = [
  {
    id: "video",
    label: "Video",
    desc: "Find your next great cut.",
    icon: Film,
    color: "peach",
  },
  {
    id: "image",
    label: "Design",
    desc: "Give your ideas a look.",
    icon: Image,
    color: "lavender",
  },
  {
    id: "present",
    label: "Slides",
    desc: "Make your point beautifully.",
    icon: Presentation,
    color: "yellow",
  },
  {
    id: "podcast",
    label: "Audio",
    desc: "Make a little noise.",
    icon: Mic,
    color: "mint",
  },
  {
    id: "script",
    label: "Script",
    desc: "Start with a few words.",
    icon: Type,
    color: "pink",
  },
];
const templates = [
  { name: "The slow edit", mode: "video", label: "Video", variant: 0 },
  { name: "A fresh perspective", mode: "image", label: "Design", variant: 1 },
  { name: "Ideas worth sharing", mode: "present", label: "Slides", variant: 2 },
  {
    name: "The slow days podcast",
    mode: "podcast",
    label: "Audio",
    variant: 3,
  },
  {
    name: "Your next great story",
    mode: "script",
    label: "Script",
    variant: 4,
  },
  { name: "A little golden hour", mode: "image", label: "Design", variant: 5 },
];

export default function Workspace({
  view,
  onNavigate,
}: {
  view: string;
  onNavigate: (page: string) => void;
}) {
  const [projects, setProjects] = useState(readProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [list, setList] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const title =
    view === "home"
      ? "Your workspace"
      : navItems.find((n) => n.id === view)?.label ||
        { analytics: "Analytics", exports: "Exports", settings: "Settings" }[
          view
        ] ||
        "Your workspace";
  const navigate = (page: string) => {
    setMobileMenu(false);
    setSearch("");
    setFilter("All");
    onNavigate(page);
  };
  const importProject = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(String(reader.result)) as StudioProject;
        if (
          !p.id ||
          typeof p.name !== "string" ||
          !["video", "image", "present", "podcast", "script"].includes(
            p.mode,
          ) ||
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
          !["16:9", "9:16", "1:1", "4:5"].includes(p.ratio) ||
          typeof p.title !== "string" ||
          typeof p.subtitle !== "string" ||
          typeof p.script !== "string" ||
          !/^#[0-9a-f]{6}$/i.test(p.color) ||
          ![p.scale, p.opacity, p.fontSize].every(Number.isFinite) ||
          (p.media &&
            (!/^data:(image|video|audio)\//.test(p.media.src) ||
              !/^(image|video|audio)\//.test(p.media.type)))
        )
          throw new Error();
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
    <div className="workspace-shell">
      <aside className={`workspace-sidebar ${mobileMenu ? "is-open" : ""}`}>
        <Brand onClick={() => navigate("landing")} />
        <button className="workspace-switcher" onClick={() => navigate("home")}>
          <span className="workspace-avatar">Y</span>
          <span>
            Your creative space<small>Personal workspace</small>
          </span>
          <ChevronDown size={15} />
        </button>
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
            { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
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
          <button
            className="text-button"
            onClick={() => navigate("editor-video")}
          >
            Start creating <ArrowUpRight size={15} />
          </button>
        </div>
        <button
          className="back-website text-button"
          onClick={() => navigate("landing")}
        >
          <ArrowLeft size={16} /> Back to the website
        </button>
      </aside>
      {mobileMenu && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <button
              className="icon-button workspace-menu"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <span>/</span>
            <b>{title}</b>
          </div>
          <div>
            <span className="device-label">
              <span className="status-dot" /> Saved on this device
            </span>
            <AccountMenu onNavigate={onNavigate} />
          </div>
        </header>
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
                    ? "Hello, creative human."
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
                  aria-expanded={newOpen}
                  onClick={() => setNewOpen(!newOpen)}
                >
                  <Plus size={18} />
                  New project
                  <ChevronDown size={14} />
                </button>
                {newOpen && (
                  <div className="new-project-menu">
                    {studioTypes.map(({ id, label, icon: Icon }) => (
                      <button key={id} onClick={() => navigate(`editor-${id}`)}>
                        <Icon size={17} />
                        {label} studio
                        <ArrowUpRight size={15} />
                      </button>
                    ))}
                  </div>
                )}
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
                      onClick={() => navigate("editor-video")}
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
                    <button key={id} onClick={() => navigate(`editor-${id}`)}>
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
                  {view === "templates" ? templates.length : projects.length}
                </span>
              </h2>
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
            </div>
            <div className="project-filters">
              <div>
                {["All", "Video", "Design", "Slides", "Audio", "Script"].map(
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
            {view === "templates" ? (
              <div className={`workspace-projects ${list ? "list-view" : ""}`}>
                {templates
                  .filter(
                    (t) =>
                      (filter === "All" || t.label === filter) &&
                      t.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((t) => (
                    <button
                      className="workspace-project-card"
                      key={t.name}
                      onClick={() =>
                        navigate(
                          `editor-${t.mode}?template=${t.variant}&name=${encodeURIComponent(t.name)}`,
                        )
                      }
                    >
                      <div className="project-thumbnail">
                        <StudioArtwork variant={t.variant} />
                        <strong>{t.name}</strong>
                        <span className="project-open">
                          <ArrowUpRight size={20} />
                        </span>
                      </div>
                      <div className="project-card-meta">
                        <h3>{t.name}</h3>
                        <span>{t.label} · Studio template</span>
                      </div>
                    </button>
                  ))}
                {!templates.some(
                  (t) =>
                    (filter === "All" || t.label === filter) &&
                    t.name.toLowerCase().includes(search.toLowerCase()),
                ) && (
                  <p className="empty-message">
                    No templates match your search.
                  </p>
                )}
              </div>
            ) : visibleProjects.length ? (
              <div className={`workspace-projects ${list ? "list-view" : ""}`}>
                {visibleProjects.map((p) => (
                  <div className="workspace-project-card" key={p.id}>
                    <button
                      className="project-thumbnail"
                      onClick={() => navigate(`editor-${p.mode}?id=${p.id}`)}
                    >
                      <StudioArtwork variant={p.scenes[0]?.variant || 0} />
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
                        <button
                          className="icon-button"
                          aria-label={`Delete ${p.name}`}
                          onClick={() => setDeleteId(p.id)}
                        >
                          <Trash2 size={15} />
                        </button>
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
                  onClick={() => navigate("editor-video")}
                >
                  Make something new
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="legacy-page">
            {view === "media" && <MediaLibrary />}
            {view === "brand" && <BrandKit />}
            {view === "analytics" && <AnalyticsDashboard />}
            {view === "exports" && <ExportCenter />}
            {view === "settings" && <SettingsPage />}
          </div>
        )}
        <footer className="workspace-footer">
          <span>A happy place for big ideas.</span>
          <span>Made for your creative flow. ✳</span>
        </footer>
      </main>
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
