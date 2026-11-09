import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Film,
  Image,
  Presentation,
  Mic,
  Type,
  Plus,
  X,
  ArrowUpRight,
} from "lucide-react";
import { startProject } from "../lib/projects";
import type { StudioProject } from "../lib/projects";
const types = [
  { id: "video", label: "Video", icon: Film },
  { id: "image", label: "Design", icon: Image },
  { id: "present", label: "Slides", icon: Presentation },
  { id: "podcast", label: "Audio", icon: Mic },
  { id: "script", label: "Script", icon: Type },
];
export default function NewProjectDialog({
  initialMode,
  onClose,
  onCreated,
}: {
  initialMode: string;
  onClose: () => void;
  onCreated: (project: StudioProject) => void;
}) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [ratio, setRatio] = useState(initialMode === "image" ? "1:1" : "16:9");
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current!;
    el.showModal();
    return () => el.close();
  }, []);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      onCreated(startProject({ name, mode, ratio }));
    } catch (e) {
      setError(
        e instanceof Error && !/quota|storage/i.test(e.message)
          ? e.message
          : "Your device storage is full. Free some space and try again.",
      );
    }
  };
  return (
    <dialog
      ref={dialog}
      className="export-dialog new-project-dialog"
      aria-labelledby="new-project-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label="Close new project"
      >
        <X size={19} />
      </button>
      <div className="export-icon">
        <Plus size={25} />
      </div>
      <div className="eyebrow">MAKE ROOM FOR A NEW IDEA.</div>
      <h2 id="new-project-title">Your next great thing.</h2>
      <p>Give it a name. Choose your canvas. Make it yours.</p>
      <form onSubmit={submit} className="new-project-form">
        <label htmlFor="new-project-name">
          Project name
          <input
            id="new-project-name"
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="What are we making?"
            required
            maxLength={100}
          />
        </label>
        <fieldset>
          <legend>What would you like to create?</legend>
          <div
            className="new-project-types"
            role="radiogroup"
            aria-label="Project type"
          >
            {types.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                role="radio"
                aria-checked={mode === id}
                key={id}
                className={mode === id ? "active" : ""}
                onClick={() => {
                  setMode(id);
                  setRatio(id === "image" ? "1:1" : "16:9");
                }}
              >
                <Icon size={19} />
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <label htmlFor="new-project-format">
          Canvas format
          <select
            id="new-project-format"
            aria-label="Canvas format"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
          >
            <option value="16:9">Landscape · 16:9</option>
            <option value="9:16">Portrait · 9:16</option>
            <option value="1:1">Square · 1:1</option>
            <option value="4:5">Social post · 4:5</option>
          </select>
        </label>
        {error && (
          <div className="account-message error" role="alert">
            {error}
          </div>
        )}
        <div className="new-project-actions">
          <button
            type="button"
            className="button button-outline small"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="button button-orange small">
            Create project
            <ArrowUpRight size={16} />
          </button>
        </div>
      </form>
    </dialog>
  );
}
