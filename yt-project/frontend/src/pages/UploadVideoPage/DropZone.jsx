import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/utils/cn";

function DropZone({ label, accept, onFile, preview }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label={`Upload ${label}`}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer",
        "transition-colors duration-150 p-8 text-center",
        dragging
          ? "border-accent bg-accent/5"
          : "border-bg-border bg-bg-elevated hover:border-accent hover:bg-accent/5"
      )}
    >
      {preview ? (
        <div className="w-full">
          {preview.type?.startsWith("video") ? (
            <div className="text-text-secondary text-sm">📹 {preview.name}</div>
          ) : (
            <img src={preview.url} alt="Preview" className="h-24 object-cover rounded-lg mx-auto" />
          )}
          <p className="text-xs text-text-muted mt-2">Click to replace</p>
        </div>
      ) : (
        <>
          <UploadCloud size={32} className="text-text-muted" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-text-primary">{label}</p>
            <p className="text-xs text-text-muted mt-0.5">Drag & drop or click to browse</p>
          </div>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </div>
  );
}

export default DropZone;
