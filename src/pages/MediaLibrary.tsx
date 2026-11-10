import { useEffect, useRef, useState } from "react";
import {
  Search,
  Upload,
  LayoutGrid,
  List,
  MoreHorizontal,
  X,
  ArrowUpRight,
  File,
  FolderPlus,
  Pencil,
  Copy,
  FolderInput,
  Download,
  Trash2,
  Eye,
  Settings2,
} from "lucide-react";
import {
  addMedia,
  listMedia,
  listFolders,
  createFolder,
  renameFolder,
  removeFolder,
  updateMedia,
  copyMedia,
  deleteMedia,
  collectProjectMedia,
  downloadBlob,
  fileKind,
} from "../lib/media";
import type { MediaAsset, MediaFolder } from "../lib/media";
import { startProject, saveProject } from "../lib/projects";
import MediaThumbnail from "../components/MediaThumbnail";
import { parseCsv } from "../lib/spreadsheet";
const bytes = (n: number) =>
  n < 1024
    ? `${n} B`
    : n < 1024 * 1024
      ? `${(n / 1024).toFixed(1)} KB`
      : `${(n / 1024 / 1024).toFixed(1)} MB`;
type Action =
  | { type: "preview" | "rename" | "move" | "delete"; asset: MediaAsset }
  | { type: "folder" }
  | { type: "folders" };
export default function MediaLibrary({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [files, setFiles] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All files");
  const [folder, setFolder] = useState("all");
  const [sort, setSort] = useState("newest");
  const [list, setList] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [action, setAction] = useState<Action | null>(null);
  const [value, setValue] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [folderNames, setFolderNames] = useState<Record<string, string>>({});
  const previewRequest = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const refresh = async () => {
    const [nextFiles, nextFolders] = await Promise.all([
      listMedia(),
      listFolders(),
    ]);
    setFiles(nextFiles);
    setFolders(nextFolders);
    setFolderNames(Object.fromEntries(nextFolders.map((f) => [f.id, f.name])));
  };
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await collectProjectMedia();
        const [f, d] = await Promise.all([listMedia(), listFolders()]);
        if (active) {
          setFiles(f);
          setFolders(d);
          setFolderNames(
            Object.fromEntries(d.map((folder) => [folder.id, folder.name])),
          );
        }
      } catch (e) {
        if (active)
          setNotice(e instanceof Error ? e.message : "Could not load media.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (action) dialog.current?.showModal();
    else dialog.current?.close();
  }, [action]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: PointerEvent) => {
      if (e.target instanceof Element && !e.target.closest(".media-options"))
        setMenu(null);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [menu]);
  const choose = (next: Action) => {
    const request = ++previewRequest.current;
    setMenu(null);
    setError("");
    setPreviewText("");
    setValue(
      "asset" in next
        ? next.type === "move"
          ? next.asset.folderId || ""
          : next.asset.name
        : "",
    );
    setAction(next);
    if (
      "asset" in next &&
      next.type === "preview" &&
      (/^text\//.test(next.asset.type) ||
        /\.(csv|json|md|txt|html?)$/i.test(next.asset.name))
    )
      void next.asset.blob
        .text()
        .then((text) => {
          if (previewRequest.current === request)
            setPreviewText(text.slice(0, 100000));
        })
        .catch(() => setPreviewText("This file could not be previewed."));
  };
  const importFiles = async (selection: File[]) => {
    if (!selection.length) return;
    setBusy(true);
    let count = 0;
    const failures: string[] = [];
    for (const file of selection) {
      try {
        await addMedia(
          file,
          folder !== "all" && folder !== "unfiled" ? folder : null,
        );
        count++;
      } catch {
        failures.push(file.name);
      }
    }
    try {
      await refresh();
    } catch {
      failures.push("the library refresh");
    }
    setNotice(
      `${count ? `Imported ${count} ${count === 1 ? "file" : "files"}.` : ""}${failures.length ? ` Could not save ${failures.join(", ")}. Check device storage and try again.` : ""}`.trim(),
    );
    setBusy(false);
  };
  const run = async (operation: () => Promise<unknown>, message: string) => {
    setBusy(true);
    try {
      await operation();
      await refresh();
      setMenu(null);
      setNotice(message);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const submit = async () => {
    if (!action || action.type === "preview" || action.type === "folders")
      return;
    setBusy(true);
    setError("");
    try {
      if (action.type === "folder") await createFolder(value);
      else if (action.type === "rename")
        await updateMedia(action.asset.id, { name: value });
      else if (action.type === "move")
        await updateMedia(action.asset.id, { folderId: value || null });
      else await deleteMedia(action.asset.id);
      await refresh();
      setAction(null);
      setNotice(
        action.type === "delete"
          ? "File deleted from Media."
          : action.type === "folder"
            ? "Folder created. Use the folder filter to organize your files."
            : "Your changes are saved.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const editable = (asset: MediaAsset) =>
    /^(image|video)\//.test(asset.type) ||
    /^text\//.test(asset.type) ||
    /\.(csv|html?|txt|md|json)$/i.test(asset.name);
  const editFile = async (asset: MediaAsset) => {
    setMenu(null);
    try {
      const mode = asset.type.startsWith("image/")
        ? "photo"
        : asset.type.startsWith("video/")
          ? "video"
          : asset.type.startsWith("audio/")
            ? "podcast"
            : /\.csv$/i.test(asset.name)
              ? "excel"
              : /\.html?$/i.test(asset.name)
                ? "website"
                : "document";
      const project = startProject({
        name: asset.name.replace(/\.[^.]+$/, ""),
        mode,
        ratio: mode === "photo" ? "1:1" : "4:5",
      });
      if (["photo", "video", "podcast"].includes(mode))
        project.media = {
          assetId: asset.id,
          name: asset.name,
          type: asset.type,
          src: "",
        };
      else if (mode === "excel")
        project.cells = parseCsv(await asset.blob.text());
      else project.script = await asset.blob.text();
      saveProject(project);
      onNavigate(`editor-${mode}?id=${project.id}`);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not open the editor.");
    }
  };
  const visible = files
    .filter(
      (file) =>
        file.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "All files" || fileKind(file) === filter) &&
        (folder === "all" || folder === "unfiled"
          ? folder !== "unfiled" || !file.folderId
          : file.folderId === folder),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "oldest"
          ? a.created - b.created
          : sort === "size"
            ? b.size - a.size
            : sort === "type"
              ? fileKind(a).localeCompare(fileKind(b)) ||
                a.name.localeCompare(b.name)
              : b.created - a.created,
    );
  const title =
    action?.type === "folder"
      ? "A home for related files."
      : action?.type === "folders"
        ? "Organize your folders."
        : action?.type === "preview"
          ? action.asset.name
          : action?.type === "rename"
            ? "Give it a new name."
            : action?.type === "move"
              ? "Move your file."
              : "Delete this file?";
  return (
    <section
      className="workspace-content media-library"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (!busy) void importFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <div className="workspace-page-heading">
        <div>
          <div className="eyebrow">EVERY LITTLE PIECE OF YOUR NEXT IDEA.</div>
          <h1>
            Your media.<span className="heading-star">✳</span>
          </h1>
          <p>
            Photos, videos, audio, and documents. All your imports, together.
          </p>
        </div>
        <div className="media-heading-actions">
          <button
            className="button button-outline small"
            onClick={() => choose({ type: "folder" })}
          >
            <FolderPlus size={16} />
            Create folder
          </button>
          <button
            className="button button-orange small"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            <Upload size={16} />
            {busy ? "Importing…" : "Import files"}
          </button>
          <input
            ref={input}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              void importFiles(Array.from(e.target.files || []));
              e.target.value = "";
            }}
          />
        </div>
      </div>
      <div className="media-toolbar">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label="Search media"
            placeholder="Find a file…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Sort media"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
          <option value="size">Largest first</option>
          <option value="type">File type</option>
        </select>
        {folders.length > 0 && (
          <>
            <select
              aria-label="Filter by folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            >
              <option value="all">All files</option>
              <option value="unfiled">Unfiled</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <button
              className="icon-button"
              aria-label="Manage folders"
              onClick={() => choose({ type: "folders" })}
            >
              <Settings2 size={16} />
            </button>
          </>
        )}
        <button
          className={`icon-button ${!list ? "selected-view" : ""}`}
          aria-label="Media grid view"
          onClick={() => setList(false)}
        >
          <LayoutGrid size={17} />
        </button>
        <button
          className={`icon-button ${list ? "selected-view" : ""}`}
          aria-label="Media list view"
          onClick={() => setList(true)}
        >
          <List size={17} />
        </button>
      </div>
      <div className="media-filter-tabs">
        {["All files", "Photos", "Videos", "Audio", "Documents", "Other"].map(
          (type) => (
            <button
              key={type}
              className={filter === type ? "active" : ""}
              onClick={() => setFilter(type)}
            >
              {type}
              <span>
                {
                  files.filter(
                    (f) => type === "All files" || fileKind(f) === type,
                  ).length
                }
              </span>
            </button>
          ),
        )}
        <span>
          {files.length} files · {bytes(files.reduce((n, f) => n + f.size, 0))}
        </span>
      </div>
      {loading ? (
        <p className="empty-message" role="status">
          Opening your media…
        </p>
      ) : visible.length ? (
        <div className={`media-files ${list ? "media-list-view" : ""}`}>
          {visible.map((file) => (
            <article className="media-file-card" key={file.id}>
              <button
                className={`media-file-preview kind-${fileKind(file).toLowerCase()}`}
                aria-label={`Preview ${file.name}`}
                onClick={() => choose({ type: "preview", asset: file })}
              >
                <MediaThumbnail asset={file} />
                <span>
                  {file.name.split(".").pop()?.toUpperCase().slice(0, 8)}
                </span>
              </button>
              <div className="media-file-info">
                <div>
                  <h3 title={file.name}>{file.name}</h3>
                  <p>
                    {bytes(file.size)} · {fileKind(file)}
                    {file.folderId
                      ? ` · ${folders.find((f) => f.id === file.folderId)?.name || ""}`
                      : ""}
                  </p>
                </div>
                <div className="media-options">
                  <button
                    className="icon-button"
                    aria-label={`Options for ${file.name}`}
                    aria-expanded={menu === file.id}
                    onClick={() => setMenu(menu === file.id ? null : file.id)}
                  >
                    <MoreHorizontal size={19} />
                  </button>
                  {menu === file.id && (
                    <div className="file-action-menu">
                      <button
                        onClick={() => choose({ type: "preview", asset: file })}
                      >
                        <Eye size={14} />
                        Preview
                      </button>
                      {editable(file) && (
                        <button onClick={() => void editFile(file)}>
                          <Pencil size={14} />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => choose({ type: "rename", asset: file })}
                      >
                        <Pencil size={14} />
                        Rename
                      </button>
                      <button
                        disabled={busy}
                        onClick={() =>
                          void run(
                            () => copyMedia(file.id),
                            "A copy was added to Media.",
                          )
                        }
                      >
                        <Copy size={14} />
                        Make a copy
                      </button>
                      <button
                        onClick={() => choose({ type: "move", asset: file })}
                      >
                        <FolderInput size={14} />
                        Move to folder
                      </button>
                      <button
                        onClick={() => {
                          downloadBlob(file.blob, file.name);
                          setMenu(null);
                        }}
                      >
                        <Download size={14} />
                        Download
                      </button>
                      <button
                        className="danger-text"
                        onClick={() => choose({ type: "delete", asset: file })}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="projects-empty media-empty">
          <div className="empty-icon">
            <File size={33} />
            <span>✳</span>
          </div>
          <h3>
            {files.length
              ? "No files here just yet."
              : "Every great idea starts with a little something."}
          </h3>
          <p>
            {files.length
              ? "Try another filter, or import files into this space."
              : "Import your photos, videos, documents, and other files. Drag them here or use the button below."}
          </p>
          <button
            className="button button-outline small"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            <Upload size={15} />
            Import files
          </button>
        </div>
      )}
      {notice && (
        <div className="media-notice" role="status">
          {notice}
          <button
            className="icon-button"
            aria-label="Dismiss media message"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      <dialog
        ref={dialog}
        className={`export-dialog media-dialog ${action?.type === "preview" ? "media-preview-dialog" : ""}`}
        aria-labelledby="media-dialog-title"
        onCancel={() => setAction(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setAction(null);
        }}
      >
        <button
          className="icon-button dialog-close"
          aria-label="Close media dialog"
          disabled={busy}
          onClick={() => setAction(null)}
        >
          <X size={19} />
        </button>
        <h2 id="media-dialog-title">{title}</h2>
        {action?.type === "preview" ? (
          <>
            <div className="media-large-preview">
              {previewText ? (
                <pre>{previewText}</pre>
              ) : (
                <MediaThumbnail asset={action.asset} controls />
              )}
            </div>
            <p>
              {bytes(action.asset.size)} · {action.asset.type}
            </p>
            <button
              className="button button-outline small"
              onClick={() => downloadBlob(action.asset.blob, action.asset.name)}
            >
              <Download size={15} />
              Download original
            </button>
          </>
        ) : action?.type === "folders" ? (
          <>
            <p>Removing a folder keeps its files in Media.</p>
            <div className="folder-manager">
              {folders.map((f) => (
                <div key={f.id}>
                  <input
                    aria-label={`Folder name ${f.name}`}
                    value={folderNames[f.id] || ""}
                    onChange={(e) =>
                      setFolderNames({ ...folderNames, [f.id]: e.target.value })
                    }
                  />
                  <button
                    className="text-button"
                    disabled={busy}
                    onClick={() =>
                      void run(
                        () => renameFolder(f.id, folderNames[f.id]),
                        "Folder renamed.",
                      )
                    }
                  >
                    Save
                  </button>
                  <button
                    className="icon-button danger-text"
                    disabled={busy}
                    aria-label={`Remove folder ${f.name}`}
                    onClick={() =>
                      void run(async () => {
                        await removeFolder(f.id);
                        if (folder === f.id) setFolder("all");
                      }, "Folder removed. Your files are still in Media.")
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            {action?.type === "delete" ? (
              <p>
                Delete <strong>{action.asset.name}</strong> from Media? Projects
                using this file will need a replacement. This can’t be undone.
              </p>
            ) : (
              <label className="media-dialog-label">
                {action?.type === "folder"
                  ? "Folder name"
                  : action?.type === "move"
                    ? "Destination folder"
                    : "File name"}
                {action?.type === "move" ? (
                  <select
                    aria-label="Destination folder"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  >
                    <option value="">Unfiled</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    aria-label={
                      action?.type === "folder" ? "Folder name" : "File name"
                    }
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setError("");
                    }}
                    required
                    maxLength={action?.type === "folder" ? 80 : 160}
                  />
                )}
              </label>
            )}
            {error && (
              <p className="account-message error" role="alert">
                {error}
              </p>
            )}
            <div className="new-project-actions">
              <button
                type="button"
                className="button button-outline small"
                disabled={busy}
                onClick={() => setAction(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`button small ${action?.type === "delete" ? "button-danger" : "button-orange"}`}
                disabled={busy}
              >
                {busy
                  ? "Saving…"
                  : action?.type === "delete"
                    ? "Delete file"
                    : action?.type === "folder"
                      ? "Create folder"
                      : "Save changes"}
                <ArrowUpRight size={14} />
              </button>
            </div>
          </form>
        )}
      </dialog>
    </section>
  );
}
