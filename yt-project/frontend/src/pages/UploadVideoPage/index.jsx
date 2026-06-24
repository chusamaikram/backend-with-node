import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/layouts/Container";
import DropZone from "./DropZone";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function UploadVideoPage() {
  const navigate = useNavigate();
  const [form, setForm]           = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [errors, setErrors]       = useState({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);

  function validate() {
    const e = {};
    if (!form.title.trim())  e.title       = "Title is required.";
    if (!videoFile)          e.videoFile   = "Please select a video file.";
    if (!thumbnail)          e.thumbnail   = "Thumbnail is required.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setUploading(true);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150));
      setProgress(i);
    }
    setUploading(false);
    navigate("/dashboard");
  }

  return (
    <Container as="section" className="py-6 max-w-2xl">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Video file */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-text-secondary">
            Video File <span className="text-accent">*</span>
          </p>
          <DropZone
            label="Drop your video here"
            accept="video/*"
            onFile={setVideoFile}
            preview={videoFile ? { type: "video", name: videoFile.name } : null}
          />
          {errors.videoFile && <p className="text-xs text-error">{errors.videoFile}</p>}
        </div>

        <Input
          label="Title"
          value={form.title}
          onChange={(e) => { setForm((p) => ({ ...p, title: e.target.value })); setErrors((p) => ({ ...p, title: "" })); }}
          error={errors.title}
          placeholder="Give your video a title"
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Tell viewers what your video is about…"
            rows={4}
            className="w-full px-3 py-2 text-sm rounded-md bg-bg-elevated border border-bg-border
                       text-text-primary placeholder:text-text-muted resize-none
                       focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Thumbnail */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-text-secondary">
            Thumbnail <span className="text-accent">*</span>
          </p>
          <DropZone
            label="Drop thumbnail image here"
            accept="image/*"
            onFile={(file) => setThumbnail({ file, url: URL.createObjectURL(file) })}
            preview={thumbnail}
          />
          {errors.thumbnail && <p className="text-xs text-error">{errors.thumbnail}</p>}
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Uploading…</span><span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="md" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={uploading}>
            Publish Video
          </Button>
        </div>
      </form>
    </Container>
  );
}

export default UploadVideoPage;
