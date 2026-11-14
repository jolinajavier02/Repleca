import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  ArrowLeftRight,
  GripVertical,
  ImagePlus,
  Music2,
  Plus,
} from "lucide-react";
import TemplateArtwork from "./TemplateArtwork";
import type { Scene, StudioProject } from "../lib/projects";

const stamp = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
export default function SceneTimeline({
  project,
  selected,
  time,
  playing,
  zoom,
  onSelect,
  onSeek,
  onChange,
  onAdd,
  onAudio,
  onCover,
  onTransition,
}: {
  project: StudioProject;
  selected: number;
  time: number;
  playing: boolean;
  zoom: number;
  onSelect: (index: number) => void;
  onSeek: (time: number) => void;
  onChange: (scenes: Scene[], selected: number) => void;
  onAdd: () => void;
  onAudio: () => void;
  onCover: () => void;
  onTransition: (index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const clipRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [draft, setDraft] = useState<Scene[] | null>(null);
  const [dragged, setDragged] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const gesture = useRef<{
    kind: "start" | "end" | "move" | "seek";
    index: number;
    x: number;
    width: number;
    scenes: Scene[];
    draft: Scene[];
    target: number;
    scroll: number;
  } | null>(null);
  const scenes = draft ?? project.scenes;
  const widths = scenes.map((scene) => Math.max(64, scene.duration * zoom));
  const offset = 62;
  const startX = (index: number) =>
    offset + widths.slice(0, index).reduce((sum, width) => sum + width + 20, 0);
  const totalWidth = startX(scenes.length) + 36;
  let runningTime = 0;
  let current = scenes.length - 1;
  for (let i = 0; i < scenes.length; i++) {
    if (time < runningTime + scenes[i].duration) {
      current = i;
      break;
    }
    runningTime += scenes[i].duration;
  }
  const sceneTime = scenes
    .slice(0, current)
    .reduce((sum, scene) => sum + scene.duration, 0);
  const head =
    startX(current) +
    Math.max(0, Math.min(1, (time - sceneTime) / scenes[current].duration)) *
      widths[current];
  const audio =
    project.audio ??
    (project.media?.type.startsWith("audio") ? project.media : null);
  useEffect(() => {
    if (playing) return;
    const track = scrollRef.current;
    if (track && selected === project.scenes.length - 1) {
      track.scrollTo({
        left: track.scrollWidth - track.clientWidth,
        behavior: "smooth",
      });
    } else
      clipRefs.current
        .get(project.scenes[selected]?.id)
        ?.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "smooth",
        });
  }, [selected, project.scenes, playing]);
  useEffect(() => {
    const track = scrollRef.current;
    if (
      playing &&
      track &&
      (head > track.scrollLeft + track.clientWidth - 35 ||
        head < track.scrollLeft)
    )
      track.scrollLeft = Math.max(0, head - 80);
  }, [head, playing]);
  const seekAt = (clientX: number) => {
    const rect = scrollRef.current!.getBoundingClientRect();
    const x = clientX - rect.left + scrollRef.current!.scrollLeft - 12;
    let seconds = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (x <= startX(i) + widths[i] + 20) {
        onSeek(
          seconds +
            Math.max(0, Math.min(1, (x - startX(i)) / widths[i])) *
              scenes[i].duration,
        );
        return;
      }
      seconds += scenes[i].duration;
    }
    onSeek(seconds);
  };
  const begin = (
    event: PointerEvent<HTMLElement>,
    kind: "start" | "end" | "move" | "seek",
    index: number,
  ) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      kind,
      index,
      x: event.clientX,
      width: widths[index] || 1,
      scenes: project.scenes,
      draft: project.scenes,
      target: index,
      scroll: scrollRef.current?.scrollLeft || 0,
    };
    if (kind === "seek") seekAt(event.clientX);
    else {
      onSelect(index);
      if (kind === "move") setDragged(index);
    }
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const state = gesture.current;
    if (!state) return;
    if (state.kind === "seek") {
      seekAt(event.clientX);
      return;
    }
    const track = scrollRef.current!;
    const rect = track.getBoundingClientRect();
    if (event.clientX > rect.right - 28) track.scrollLeft += 12;
    if (event.clientX < rect.left + 28) track.scrollLeft -= 12;
    if (state.kind === "move") {
      let target = state.index;
      for (let i = 0; i < scenes.length; i++) {
        const box = clipRefs.current.get(scenes[i].id)?.getBoundingClientRect();
        if (box && event.clientX >= box.left && event.clientX <= box.right + 20)
          target = i;
      }
      state.target = target;
      setDropIndex(target);
      return;
    }
    const scene = state.scenes[state.index];
    const delta =
      ((event.clientX - state.x + track.scrollLeft - state.scroll) /
        state.width) *
      scene.duration;
    const source =
      scene.trimStart ??
      state.scenes
        .slice(0, state.index)
        .reduce((sum, item) => sum + item.duration, 0);
    let next = { ...scene };
    if (state.kind === "end")
      next.duration =
        Math.round(Math.max(0.5, Math.min(120, scene.duration + delta)) * 10) /
        10;
    else {
      const change =
        Math.round(
          Math.max(-source, Math.min(scene.duration - 0.5, delta)) * 10,
        ) / 10;
      next = {
        ...scene,
        duration: Math.round((scene.duration - change) * 10) / 10,
        trimStart: Math.max(0, source + change),
      };
    }
    state.draft = state.scenes.map((item, index) =>
      index === state.index ? next : item,
    );
    setDraft(state.draft);
  };
  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || to >= project.scenes.length)
      return;
    const next = [...project.scenes];
    const [scene] = next.splice(from, 1);
    next.splice(to, 0, scene);
    onChange(next, to);
  };
  const finish = (event: PointerEvent<HTMLElement>, cancel = false) => {
    const state = gesture.current;
    if (!state) return;
    gesture.current = null;
    if (!cancel) {
      if (state.kind === "move") reorder(state.index, state.target);
      else if (state.kind !== "seek" && state.draft !== state.scenes)
        onChange(state.draft, state.index);
    }
    setDraft(null);
    setDragged(null);
    setDropIndex(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const dragHandlers = {
    onPointerMove: move,
    onPointerUp: (event: PointerEvent<HTMLElement>) => finish(event),
    onPointerCancel: (event: PointerEvent<HTMLElement>) => finish(event, true),
  };
  return (
    <div className="compact-track-scroll" ref={scrollRef}>
      <div className="compact-track-content" style={{ width: totalWidth }}>
        <div
          className="compact-ruler"
          onPointerDown={(event) => begin(event, "seek", 0)}
          {...dragHandlers}
          aria-label="Seek on timeline"
        >
          {scenes.map((scene, index) => (
            <span key={scene.id} style={{ left: startX(index) }}>
              {stamp(
                scenes
                  .slice(0, index)
                  .reduce((sum, item) => sum + item.duration, 0),
              )}
            </span>
          ))}
        </div>
        <div className="compact-scenes">
          <button
            className="cover-tile"
            aria-label={
              project.cover ? "Change cover photo" : "Add cover photo"
            }
            onClick={onCover}
          >
            {project.cover?.src ? (
              <img src={project.cover.src} alt="Project cover" />
            ) : (
              <ImagePlus size={17} />
            )}
            <span>Cover</span>
            <Plus size={10} />
          </button>
          {scenes.map((scene, index) => (
            <div className="scene-and-transition" key={scene.id}>
              <div
                ref={(node) => {
                  if (node) clipRefs.current.set(scene.id, node);
                  else clipRefs.current.delete(scene.id);
                }}
                data-scene-index={index}
                className={`compact-scene ${selected === index ? "active" : ""} ${dragged === index ? "dragging" : ""} ${dropIndex === index ? "drop-target" : ""}`}
                style={{ width: widths[index] }}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData(
                    "text/repleca-scene",
                    String(index),
                  );
                  event.dataTransfer.effectAllowed = "move";
                  setDragged(index);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDropIndex(index);
                }}
                onDragEnd={() => {
                  setDragged(null);
                  setDropIndex(null);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const from = Number(
                    event.dataTransfer.getData("text/repleca-scene"),
                  );
                  if (event.dataTransfer.types.includes("text/repleca-scene"))
                    reorder(from, index);
                  setDragged(null);
                  setDropIndex(null);
                }}
              >
                <button
                  className="scene-thumbnail"
                  aria-label={`Scene ${index + 1}: ${scene.name}`}
                  aria-pressed={selected === index}
                  onClick={() => onSelect(index)}
                  onKeyDown={(event) => {
                    if (
                      event.altKey &&
                      (event.key === "ArrowRight" || event.key === "ArrowLeft")
                    ) {
                      event.preventDefault();
                      reorder(
                        index,
                        index + (event.key === "ArrowRight" ? 1 : -1),
                      );
                    }
                  }}
                >
                  {project.media?.type.startsWith("image") &&
                  project.media.src ? (
                    <img src={project.media.src} alt="" draggable={false} />
                  ) : project.media?.type.startsWith("video") &&
                    project.media.src ? (
                    <video
                      src={project.media.src}
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={(event) => {
                        const media = event.currentTarget;
                        media.currentTime = Math.min(
                          scene.trimStart ??
                            scenes
                              .slice(0, index)
                              .reduce((sum, item) => sum + item.duration, 0),
                          Math.max(0, media.duration - 0.05),
                        );
                      }}
                    />
                  ) : (
                    <TemplateArtwork
                      style={project.templateStyle}
                      variant={scene.variant}
                      aspect={16 / 9}
                    />
                  )}
                  <span>{index + 1}</span>
                  <small>{stamp(scene.duration)}</small>
                </button>
                <button
                  className="scene-drag-grip"
                  aria-label={`Move scene ${index + 1}`}
                  title="Drag to reorder; Alt + arrow keys on the thumbnail also moves scenes"
                  onPointerDown={(event) => begin(event, "move", index)}
                  {...dragHandlers}
                >
                  <GripVertical size={12} />
                </button>
                {selected === index && (
                  <>
                    <button
                      className="clip-edge start"
                      aria-label={`Trim start of scene ${index + 1}`}
                      title="Drag to trim start"
                      onPointerDown={(event) => begin(event, "start", index)}
                      {...dragHandlers}
                      onKeyDown={(event) => {
                        if (
                          event.key === "ArrowRight" &&
                          scene.duration > 0.5
                        ) {
                          event.preventDefault();
                          const source =
                            scene.trimStart ??
                            scenes
                              .slice(0, index)
                              .reduce((n, s) => n + s.duration, 0);
                          onChange(
                            scenes.map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    duration: Math.max(0.5, s.duration - 0.1),
                                    trimStart: source + 0.1,
                                  }
                                : s,
                            ),
                            index,
                          );
                        }
                      }}
                    />
                    <button
                      className="clip-edge end"
                      aria-label={`Trim end of scene ${index + 1}`}
                      title="Drag to trim or extend end"
                      onPointerDown={(event) => begin(event, "end", index)}
                      {...dragHandlers}
                      onKeyDown={(event) => {
                        if (
                          event.key === "ArrowLeft" ||
                          event.key === "ArrowRight"
                        ) {
                          event.preventDefault();
                          onChange(
                            scenes.map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    duration: Math.max(
                                      0.5,
                                      Math.min(
                                        120,
                                        s.duration +
                                          (event.key === "ArrowRight"
                                            ? 0.1
                                            : -0.1),
                                      ),
                                    ),
                                  }
                                : s,
                            ),
                            index,
                          );
                        }
                      }}
                    />
                  </>
                )}
              </div>
              {index < scenes.length - 1 && (
                <button
                  className={`transition-connector ${scenes[index + 1].transitionIn?.type && scenes[index + 1].transitionIn?.type !== "none" ? "applied" : ""}`}
                  aria-label={`Transition between scenes ${index + 1} and ${index + 2}`}
                  title="Edit transition"
                  onClick={() => onTransition(index + 1)}
                >
                  <ArrowLeftRight size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            className="compact-add-scene"
            aria-label="Add scene"
            title="Add scene"
            onClick={onAdd}
          >
            <Plus size={17} />
          </button>
        </div>
        <button
          className={`compact-audio-track ${audio ? "has-audio" : ""}`}
          style={{
            marginLeft: offset,
            width: Math.max(120, totalWidth - offset - 36),
          }}
          onClick={onAudio}
        >
          <Music2 size={13} />
          <span>{audio?.name || "Add audio"}</span>
          {audio && (
            <span className="compact-waveform">
              {Array.from({ length: 60 }, (_, i) => (
                <i key={i} style={{ height: 4 + ((i * 7) % 14) }} />
              ))}
            </span>
          )}
          <Plus size={12} />
        </button>
        <div
          className="compact-playhead"
          style={{ left: head }}
          role="slider"
          tabIndex={0}
          aria-label="Drag playhead"
          aria-valuemin={0}
          aria-valuemax={scenes.reduce((n, s) => n + s.duration, 0)}
          aria-valuenow={Number(time.toFixed(1))}
          onPointerDown={(event) => begin(event, "seek", current)}
          {...dragHandlers}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              onSeek(time + (event.key === "ArrowRight" ? 0.1 : -0.1));
            }
          }}
        >
          <span />
        </div>
      </div>
    </div>
  );
}
