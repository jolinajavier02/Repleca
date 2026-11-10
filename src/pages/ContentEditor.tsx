import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Download,
  Plus,
  Save,
  Printer,
  Code2,
  Eye,
  Upload,
  X,
  Check,
  LayoutTemplate,
  Undo2,
} from "lucide-react";
import TemplatePickerDialog from "../components/TemplatePickerDialog";
import FormatSelect from "../components/FormatSelect";
import WebsiteViewport from "../components/WebsiteViewport";
import { projectSize, canvasFormats, formatFields } from "../lib/formats";
import { templateState } from "../lib/template-state";
import Brand from "../components/Brand";
import AccountMenu from "../components/AccountMenu";
import {
  createProject,
  readProjects,
  saveProject,
  downloadFile,
} from "../lib/projects";
import { addMedia } from "../lib/media";
import { parseCsv, csvText, cellDisplay } from "../lib/spreadsheet";
import type { StudioProject } from "../lib/projects";
const columnName = (index: number) =>
  index < 26
    ? String.fromCharCode(65 + index)
    : `A${String.fromCharCode(65 + index - 26)}`;
export default function ContentEditor({
  mode: rawMode,
  onNavigate,
}: {
  mode: string;
  onNavigate: (page: string) => void;
}) {
  const [mode, query] = rawMode.split("?");
  const [project, setProject] = useState<StudioProject>(
    () =>
      readProjects().find(
        (p) => p.id === new URLSearchParams(query).get("id"),
      ) || {
        ...createProject(mode),
        name: `Untitled ${mode === "excel" ? "spreadsheet" : mode}`,
        title: "",
        script: "",
        cells: Array.from({ length: 20 }, () => Array(8).fill("")),
      },
  );
  const [templateOpen, setTemplateOpen] = useState(false);
  const [templateBackup, setTemplateBackup] = useState<StudioProject | null>(
    null,
  );
  const [pageWidth, pageHeight] = projectSize(project);
  const paper =
    canvasFormats.find((format) => format.id === project.formatId)?.paper ||
    "A4";
  const [notice, setNotice] = useState("");
  const [focused, setFocused] = useState("");
  const [pane, setPane] = useState("html");
  const [preview, setPreview] = useState(true);
  const upload = useRef<HTMLInputElement>(null);
  const persisted = useRef(project);
  const cells =
    project.cells || Array.from({ length: 20 }, () => Array(8).fill(""));
  const update = (changes: Partial<StudioProject>) =>
    setProject((p) => ({
      ...p,
      ...changes,
      updated: new Date().toISOString(),
    }));
  const save = () => {
    try {
      saveProject(project);
      persisted.current = project;
      setNotice("Your project is saved.");
      return true;
    } catch {
      setNotice(
        "Your device storage is full. Download your work to keep your changes.",
      );
      return false;
    }
  };
  useEffect(() => {
    try {
      saveProject(project);
      persisted.current = project;
      const params = new URLSearchParams(query);
      if (!params.has("id")) {
        params.set("id", project.id);
        history.replaceState(null, "", `#/editor-${mode}?${params}`);
      }
    } catch {
      setNotice("Your project could not be saved. Check device storage.");
    } // Initial draft must appear in Projects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (persisted.current === project) return;
    const timer = setTimeout(() => {
      try {
        saveProject(project);
        persisted.current = project;
      } catch {
        setNotice("Your device storage is full. Download your changes.");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [project]);
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => {
      if (persisted.current !== project) e.preventDefault();
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, [project]);
  const leave = () => {
    if (save()) onNavigate("projects");
  };
  const website = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${project.stylesheet || ""}</style></head><body>${project.script}</body></html>`;
  const safePreview = website.replace(
    "<head>",
    "<head><meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; form-action 'none'\">",
  );
  const exportContent = () => {
    if (mode === "website")
      downloadFile(website, "text/html", `${project.name}.html`);
    else if (mode === "excel")
      downloadFile(
        csvText(cells),
        "text/csv;charset=utf-8",
        `${project.name}.csv`,
      );
    else
      downloadFile(
        `${project.title || project.name}\n\n${project.script}`,
        "text/plain",
        `${project.name}.txt`,
      );
  };
  const importContent = async (file?: File) => {
    if (!file) return;
    try {
      const text = await file.text();
      await addMedia(file);
      if (mode === "excel") update({ cells: parseCsv(text) });
      else update({ script: text });
      setNotice(`${file.name} imported and stored in Media.`);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not import this file.");
    }
  };
  return (
    <div className={`content-editor content-${mode}`}>
      <header className="editor-header">
        <div className="editor-header-left">
          <button
            className="icon-button"
            aria-label="Back to projects"
            onClick={leave}
          >
            <ArrowLeft size={19} />
          </button>
          <Brand compact onClick={leave} />
          <span className="header-divider" />
          <div className="project-name">
            <input
              aria-label="Project name"
              value={project.name}
              onChange={(e) => update({ name: e.target.value })}
            />
            <span>
              <span className="status-dot" />
              {mode === "excel"
                ? "Spreadsheet"
                : mode === "website"
                  ? "Website"
                  : "Document"}{" "}
              studio · Saved on this device
            </span>
          </div>
        </div>
        <div className="editor-header-right">
          <button className="button button-outline small" onClick={save}>
            <Save size={14} />
            Save
          </button>
          {(mode === "document" || mode === "excel") && (
            <button
              className="icon-button"
              aria-label={
                mode === "excel" ? "Print worksheet" : "Print document"
              }
              onClick={() => {
                save();
                window.print();
              }}
            >
              <Printer size={18} />
            </button>
          )}
          <button
            className="button button-orange small"
            onClick={exportContent}
          >
            <Download size={14} />
            {mode === "excel"
              ? "Export CSV"
              : mode === "website"
                ? "Export HTML"
                : "Export text"}
          </button>
          <AccountMenu onNavigate={onNavigate} onBeforeLogout={save} />
        </div>
      </header>
      <div className="content-toolbar">
        <span>
          {mode === "excel"
            ? "A little order for your ideas."
            : mode === "website"
              ? "Your own little corner of the internet."
              : "Make space for what you want to say."}
        </span>
        <div>
          <button className="text-button" onClick={() => setTemplateOpen(true)}>
            <LayoutTemplate size={14} />
            Templates
          </button>
          {templateBackup && (
            <button
              className="text-button"
              onClick={() => {
                setProject({
                  ...templateBackup,
                  updated: new Date().toISOString(),
                });
                setTemplateBackup(null);
              }}
            >
              <Undo2 size={14} />
              Undo template
            </button>
          )}
          <FormatSelect
            mode={mode}
            value={project.formatId}
            ratio={project.ratio}
            onChange={(id) => update(formatFields(id))}
          />
          <button
            className="text-button"
            onClick={() => upload.current?.click()}
          >
            <Upload size={14} />
            Import{" "}
            {mode === "excel" ? "CSV" : mode === "website" ? "HTML" : "text"}
          </button>
          <input
            ref={upload}
            hidden
            type="file"
            accept={
              mode === "excel"
                ? ".csv,text/csv"
                : mode === "website"
                  ? ".html,.htm,text/html"
                  : ".txt,.md,text/plain,text/markdown"
            }
            onChange={(e) => {
              void importContent(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {mode === "excel" && (
            <>
              <button
                className="text-button"
                disabled={cells.length >= 500}
                onClick={() =>
                  update({
                    cells: [...cells, Array(cells[0]?.length || 8).fill("")],
                  })
                }
              >
                <Plus size={14} />
                Add row
              </button>
              <button
                className="text-button"
                disabled={(cells[0]?.length || 0) >= 50}
                onClick={() =>
                  update({ cells: cells.map((row) => [...row, ""]) })
                }
              >
                <Plus size={14} />
                Add column
              </button>
            </>
          )}
          {mode === "website" && (
            <button
              className="text-button"
              aria-pressed={preview}
              onClick={() => setPreview(!preview)}
            >
              <Eye size={14} />
              {preview ? "Hide preview" : "Show preview"}
            </button>
          )}
        </div>
      </div>
      {mode === "excel" ? (
        <>
          <div className="sheet-help">
            Enter values or use <code>=SUM(A1:A5)</code> and{" "}
            <code>=AVERAGE(A1:A5)</code>. CSV exports open in Excel.
          </div>
          <div className="spreadsheet-scroll">
            <table className="spreadsheet">
              <thead>
                <tr>
                  <th aria-label="Row number" />
                  {cells[0]?.map((_, c) => (
                    <th key={c}>{columnName(c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cells.map((row, r) => (
                  <tr key={r}>
                    <th>{r + 1}</th>
                    {row.map((value, c) => (
                      <td key={c}>
                        <input
                          aria-label={`${columnName(c)}${r + 1}`}
                          value={
                            focused === `${r}:${c}`
                              ? value
                              : cellDisplay(value, cells)
                          }
                          onFocus={() => setFocused(`${r}:${c}`)}
                          onBlur={() => setFocused("")}
                          onChange={(e) =>
                            update({
                              cells: cells.map((line, i) =>
                                i === r
                                  ? line.map((cell, j) =>
                                      j === c ? e.target.value : cell,
                                    )
                                  : line,
                              ),
                            })
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : mode === "website" ? (
        <div className={`website-editor ${preview ? "" : "code-only"}`}>
          <div className="website-code">
            <div className="website-code-tabs">
              <button
                className={pane === "html" ? "active" : ""}
                onClick={() => setPane("html")}
              >
                <Code2 size={14} />
                HTML
              </button>
              <button
                className={pane === "css" ? "active" : ""}
                onClick={() => setPane("css")}
              >
                CSS
              </button>
            </div>
            <textarea
              aria-label={pane === "html" ? "Website HTML" : "Website CSS"}
              spellCheck={false}
              value={
                pane === "html" ? project.script : project.stylesheet || ""
              }
              onChange={(e) =>
                update(
                  pane === "html"
                    ? { script: e.target.value }
                    : { stylesheet: e.target.value },
                )
              }
            />
          </div>
          {preview && (
            <WebsiteViewport
              width={pageWidth}
              height={pageHeight}
              html={safePreview}
            />
          )}
        </div>
      ) : (
        <main className="document-stage">
          {project.templateNote && (
            <aside className="document-template-note">
              {project.templateNote}
            </aside>
          )}
          <article
            className="document-paper"
            style={{ aspectRatio: `${pageWidth}/${pageHeight}` }}
          >
            <span className="eyebrow">YOUR IDEAS, IN YOUR WORDS.</span>
            <input
              aria-label="Document title"
              placeholder="Give your story a title…"
              value={project.title}
              onChange={(e) => update({ title: e.target.value })}
            />
            <textarea
              aria-label="Document content"
              placeholder="A blank page. A world of possibility. Start writing…"
              value={project.script}
              onChange={(e) => update({ script: e.target.value })}
            />
            <span className="word-count">
              {project.script.trim()
                ? project.script.trim().split(/\s+/).length
                : 0}{" "}
              words
            </span>
          </article>
          <article className="document-print">
            <h1>{project.title || project.name}</h1>
            <p>{project.script}</p>
          </article>
        </main>
      )}
      <style media="print">{`@page { size: ${paper}; margin: 15mm; }`}</style>
      {templateOpen && (
        <TemplatePickerDialog
          mode={mode}
          onClose={() => setTemplateOpen(false)}
          onChoose={(template) => {
            setTemplateBackup(project);
            update(templateState(template.id, mode));
            setTemplateOpen(false);
            setNotice(
              `${template.name} applied. You can undo this template change.`,
            );
          }}
        />
      )}
      {notice && (
        <div className="toast" role="status">
          <Check size={16} />
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
    </div>
  );
}
