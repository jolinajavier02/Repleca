import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { studioTypes } from "../lib/studio-types";
import { canvasFormats, formatLabel } from "../lib/formats";
import { projectTemplates } from "../lib/templates";
import type { ProjectTemplate } from "../lib/templates";
import TemplatePreview from "./TemplatePreview";
export default function TemplateBrowser({
  mode,
  compact = false,
  onChoose,
}: {
  mode?: string;
  compact?: boolean;
  onChoose: (template: ProjectTemplate) => void;
}) {
  const [category, setCategory] = useState(mode || "all");
  const [group, setGroup] = useState("all");
  const [size, setSize] = useState("all");
  const [search, setSearch] = useState("");
  const inCategory = projectTemplates.filter(
    (t) => category === "all" || t.mode === category,
  );
  const groups = [...new Set(inCategory.map((t) => t.category))];
  const sizes = canvasFormats.filter((f) =>
    inCategory.some((t) => t.formatId === f.id),
  );
  const visible = inCategory.filter(
    (t) =>
      (group === "all" || t.category === group) &&
      (size === "all" || t.formatId === size) &&
      `${t.name} ${t.category} ${t.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <section
      className={`category-template-browser ${compact ? "compact-template-browser" : ""}`}
      aria-label="Category templates"
    >
      {!mode && (
        <div className="template-category-tabs">
          {[{ id: "all", label: "All templates" }, ...studioTypes].map(
            (type) => (
              <button
                key={type.id}
                className={category === type.id ? "active" : ""}
                onClick={() => {
                  setCategory(type.id);
                  setGroup("all");
                  setSize("all");
                }}
              >
                {type.label}
              </button>
            ),
          )}
        </div>
      )}
      <div className="template-browse-controls">
        <div className="search-field">
          <Search size={15} />
          <input
            aria-label="Search templates"
            placeholder="Find your starting point…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label={category === "video" ? "Video platform" : "Template type"}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="all">
            {category === "video" ? "All platforms" : "All types"}
          </option>
          {groups.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <select
          aria-label="Template size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          <option value="all">All sizes</option>
          {sizes.map((f) => (
            <option key={f.id} value={f.id}>
              {formatLabel(f)}
            </option>
          ))}
        </select>
      </div>
      <p className="template-browser-summary">
        {visible.length} {visible.length === 1 ? "template" : "templates"} ·{" "}
        {category === "video"
          ? "Original editable layouts for your own footage."
          : "Pick a layout, then make it your own."}
      </p>
      <div className="category-template-grid">
        {visible.map((template) => (
          <button
            className="category-template-card"
            key={template.id}
            onClick={() => onChoose(template)}
          >
            <TemplatePreview template={template} />
            <div className="category-template-meta">
              <span className="template-category-tag">{template.category}</span>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <small>
                {canvasFormats.find((f) => f.id === template.formatId)?.width} ×{" "}
                {canvasFormats.find((f) => f.id === template.formatId)?.height}{" "}
                px{" "}
                <span>
                  {canvasFormats.find((f) => f.id === template.formatId)?.ratio}
                </span>
              </small>
              <span className="template-use">
                Use template <ArrowUpRight size={14} />
              </span>
            </div>
          </button>
        ))}
      </div>
      {!visible.length && (
        <p className="empty-message">
          No templates match those filters. Try another size or type.
        </p>
      )}
    </section>
  );
}
