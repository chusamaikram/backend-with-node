import { useState, useRef } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";

function DropZone({ label, accept, onFile, preview, uploading = false, progress = 0 }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && !uploading) onFile(file);
    }

    const done = uploading && progress >= 100;

    return (
        <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label={`Upload ${label}`}
            onKeyDown={(e) => e.key === "Enter" && !uploading && inputRef.current?.click()}
            className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed",
                "transition-all duration-150 p-8 text-center",
                uploading
                    ? "dropzone-uploading cursor-not-allowed"
                    : dragging
                        ? "border-accent bg-accent/5 cursor-pointer"
                        : "border-bg-border bg-bg-elevated hover:border-accent hover:bg-accent/5 cursor-pointer"
            )}
        >
            {uploading ? (
                <div className="flex flex-col items-center gap-3 w-full">
                    {done ? (
                        <CheckCircle size={32} className="text-success" aria-hidden="true" />
                    ) : (
                        <UploadCloud size={32} className="text-success animate-bounce" aria-hidden="true" />
                    )}

                    {/* Percentage */}
                    <p className="text-2xl font-bold text-success">{progress}%</p>

                    {/* Mini progress bar inside dropzone */}
                    <div className="w-full h-1.5 bg-bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full progress-bar-fill transition-all duration-150"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-xs text-text-muted">
                        {done ? "Upload complete!" : "Uploading, please wait…"}
                    </p>
                </div>
            ) : preview ? (
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
                onChange={(e) => e.target.files?.[0] && !uploading && onFile(e.target.files[0])}
            />
        </div>
    );
}

export default DropZone;
