import { useEffect, useState } from "react";
import { FileQuestion } from "lucide-react";
import TemplateArtwork from "./TemplateArtwork";
import { projectSize } from "../lib/formats";
import StudioArtwork from "./StudioArtwork";
import MediaThumbnail from "./MediaThumbnail";
import { getMedia } from "../lib/media";
import type { MediaAsset } from "../lib/media";
import type { StudioProject } from "../lib/projects";
export default function ProjectThumbnail({
  project,
}: {
  project: StudioProject;
}) {
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let active = true;
    setAsset(null);
    setMissing(false);
    if (project.media?.assetId)
      void getMedia(project.media.assetId)
        .then((file) => {
          if (active) {
            setAsset(file);
            setMissing(!file);
          }
        })
        .catch(() => {
          if (active) setMissing(true);
        });
    return () => {
      active = false;
    };
  }, [project.media?.assetId]);
  if (asset) return <MediaThumbnail asset={asset} />;
  if (missing)
    return (
      <div className="project-file-missing">
        <FileQuestion size={30} />
        <span>Media removed</span>
      </div>
    );
  if (project.media?.type.startsWith("image/") && project.media.src)
    return <img src={project.media.src} alt={project.name} />;
  if (project.mode === "document" || project.mode === "script")
    return (
      <div className="project-document-preview">
        <span>
          {project.script.slice(0, 250) || "A new page for your ideas."}
        </span>
      </div>
    );
  if (project.mode === "excel")
    return (
      <div className="project-sheet-preview">
        {(project.cells || Array.from({ length: 6 }, () => Array(4).fill("")))
          .slice(0, 6)
          .map((row, i) => (
            <div key={i}>
              {row.slice(0, 4).map((cell, j) => (
                <span key={j}>{cell}</span>
              ))}
            </div>
          ))}
      </div>
    );
  if (project.mode === "website")
    return (
      <div className="project-code-preview">
        {project.script.slice(0, 300) ||
          "<main>\n  Your next big idea.\n</main>"}
      </div>
    );
  if (project.templateStyle) {
    const [w, h] = projectSize(project);
    return (
      <TemplateArtwork
        style={project.templateStyle}
        variant={project.scenes[0]?.variant || 0}
        aspect={w / h}
      />
    );
  }
  return <StudioArtwork variant={project.scenes[0]?.variant || 0} />;
}
