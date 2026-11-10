import { useEffect, useRef, useState } from "react";
export default function WebsiteViewport({
  width,
  height,
  html,
}: {
  width: number;
  height: number;
  html: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 700, height: 700 });
  useEffect(() => {
    const el = ref.current!;
    const observer = new ResizeObserver(() =>
      setBounds({ width: el.clientWidth, height: el.clientHeight }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const scale = Math.min(
    1,
    (bounds.width - 30) / width,
    (bounds.height - 30) / height,
  );
  return (
    <div className="website-preview-stage" ref={ref}>
      <div
        style={{
          width: width * scale,
          height: height * scale,
          position: "relative",
        }}
      >
        <iframe
          title="Website preview"
          sandbox=""
          referrerPolicy="no-referrer"
          srcDoc={html}
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
}
