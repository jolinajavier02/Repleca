import TemplateArtwork from "./TemplateArtwork";
import { canvasFormats } from "../lib/formats";
import type { ProjectTemplate } from "../lib/templates";
export default function TemplatePreview({
  template,
}: {
  template: ProjectTemplate;
}) {
  const format = canvasFormats.find((f) => f.id === template.formatId)!;
  const portrait = format.height > format.width;
  return (
    <div className={`template-layout-preview preview-${template.style}`}>
      <div
        className={`template-preview-sheet ${portrait ? "portrait" : ""}`}
        style={{ aspectRatio: `${format.width}/${format.height}` }}
      >
        {template.style === "document" ? (
          <div className="template-doc-mini">
            <b>{template.title}</b>
            <small>{template.subtitle}</small>
            <p>{template.body?.slice(0, 320)}</p>
          </div>
        ) : template.style === "sheet" ? (
          <div className="template-sheet-mini">
            {template.cells?.slice(0, 7).map((row, i) => (
              <div key={i}>
                {row.slice(0, 4).map((cell, j) => (
                  <span key={j}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        ) : template.style === "website" ? (
          <div className="template-web-mini">
            <span>{template.category.toUpperCase()}</span>
            <b>{template.title}</b>
            <i />
            <p>YOUR OWN LITTLE CORNER OF THE WEB.</p>
          </div>
        ) : (
          <>
            <TemplateArtwork
              style={template.style}
              variant={template.variant}
              aspect={format.width / format.height}
            />
            {template.style === "photo-border" && (
              <i className="template-photo-mat" />
            )}
            <div
              className="template-mini-title"
              style={{
                color:
                  template.color ||
                  ([
                    "logo",
                    "wordmark",
                    "frame",
                    "invitation",
                    "business-card",
                    "greeting-card",
                    "presentation",
                  ].includes(template.style)
                    ? "#334b3e"
                    : "#fff"),
              }}
            >
              <b>{template.title || "YOUR PHOTO HERE"}</b>
              <small>{template.subtitle}</small>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
