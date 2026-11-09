import { useEffect, useState } from "react";
import { FileText, File, Music2 } from "lucide-react";
import type { MediaAsset } from "../lib/media";
export default function MediaThumbnail({
  asset,
  controls = false,
}: {
  asset: MediaAsset;
  controls?: boolean;
}) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(asset.blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [asset.blob]);
  if (!url) return null;
  if (asset.type.startsWith("image/"))
    return <img src={url} alt={asset.name} />;
  if (asset.type.startsWith("video/"))
    return (
      <video
        src={url}
        controls={controls}
        preload="metadata"
        muted={!controls}
        playsInline
      />
    );
  if (asset.type.startsWith("audio/"))
    return controls ? <audio src={url} controls /> : <Music2 size={40} />;
  return /text|pdf|document|sheet|csv|json/.test(asset.type) ? (
    <FileText size={40} />
  ) : (
    <File size={40} />
  );
}
