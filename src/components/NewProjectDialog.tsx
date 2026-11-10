import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Plus, X, ArrowUpRight } from "lucide-react";
import {
  defaultFormat,
  formatsFor,
  formatLabel,
  canvasFormats,
} from "../lib/formats";
import { projectTemplates } from "../lib/templates";
import TemplatePreview from "./TemplatePreview";
import { studioTypes } from "../lib/studio-types";
import { startProject } from "../lib/projects";
import type { StudioProject } from "../lib/projects";
const types = studioTypes;
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
  const [formatId, setFormatId] = useState(
    defaultFormat(initialMode)?.id || "video-youtube",
  );
  const [templateId, setTemplateId] = useState("");
  const selectedFormat = canvasFormats.find(
    (format) => format.id === formatId,
  )!;
  const selectedTemplate = projectTemplates.find(
    (template) => template.id === templateId,
  );
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
      onCreated(
        startProject({
          name,
          mode,
          ratio: selectedFormat.ratio,
          formatId,
          templateId: templateId || undefined,
        }),
      );
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
                  setFormatId(defaultFormat(id)!.id);
                  setTemplateId("");
                }}
              >
                <Icon size={19} />
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <label htmlFor="new-project-format">
          {mode === "video" ? "Platform & frame size" : "Size & format"}
          <select
            id="new-project-format"
            aria-label={mode === "video" ? "Video frame size" : "Canvas format"}
            value={formatId}
            onChange={(e) => {
              setFormatId(e.target.value);
              setTemplateId("");
            }}
          >
            {formatsFor(mode).map((format) => (
              <option key={format.id} value={format.id}>
                {formatLabel(format)} · {format.ratio}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="new-project-template">
          Starting template
          <select
            id="new-project-template"
            aria-label="Starting template"
            value={templateId}
            onChange={(e) => {
              setTemplateId(e.target.value);
              const template = projectTemplates.find(
                (t) => t.id === e.target.value,
              );
              if (template && !name.trim()) setName(template.name);
            }}
          >
            <option value="">Blank project</option>
            {projectTemplates
              .filter(
                (template) =>
                  template.mode === mode && template.formatId === formatId,
              )
              .map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
          </select>
        </label>
        {selectedTemplate && (
          <div className="new-project-template-preview">
            <TemplatePreview template={selectedTemplate} />
            <p>{selectedTemplate.description}</p>
          </div>
        )}
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
