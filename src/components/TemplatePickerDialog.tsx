import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import TemplateBrowser from "./TemplateBrowser";
import { studioTypes } from "../lib/studio-types";
import type { ProjectTemplate } from "../lib/templates";
export default function TemplatePickerDialog({
  mode,
  onChoose,
  onClose,
}: {
  mode: string;
  onChoose: (template: ProjectTemplate) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current!;
    el.showModal();
    return () => el.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="template-picker-dialog"
      aria-labelledby="template-picker-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="icon-button dialog-close"
        aria-label="Close templates"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <div className="eyebrow">A HEAD START, IN YOUR OWN STYLE.</div>
      <h2 id="template-picker-title">
        {studioTypes.find((type) => type.id === mode)?.label} templates
      </h2>
      <TemplateBrowser mode={mode} onChoose={onChoose} />
    </dialog>
  );
}
