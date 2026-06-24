import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

function RegisterForm() {
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors]         = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverFile, setCoverFile]   = useState(null);
  const [coverPreview, setCoverPreview]   = useState(null);

  const avatarInputRef = useRef(null);
  const coverInputRef  = useRef(null);

  // ── Validation ──────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.fullname.trim())              e.fullname  = "Full name is required.";
    if (!form.username.trim())              e.username  = "Username is required.";
    else if (/\s/.test(form.username))      e.username  = "Username cannot contain spaces.";
    if (!form.email.trim())                 e.email     = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)                     e.password  = "Password is required.";
    else if (form.password.length < 6)      e.password  = "Minimum 6 characters.";
    if (!avatarFile)                        e.avatar    = "Avatar is required.";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, avatar: "" }));
  }

  function handleCoverChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    // Build FormData — backend expects multipart/form-data
    const formData = new FormData();
    formData.append("fullname", form.fullname.trim());
    formData.append("username", form.username.trim().toLowerCase());
    formData.append("email", form.email.trim().toLowerCase());
    formData.append("password", form.password);
    formData.append("avatar", avatarFile);
    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    // useAuth handles API call, toast, store update and redirect
    await register(formData);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Register form">

      <Input
        label="Full Name"
        id="fullname"
        name="fullname"
        autoComplete="name"
        value={form.fullname}
        onChange={handleChange}
        error={errors.fullname}
        placeholder="John Doe"
      />

      <Input
        label="Username"
        id="username"
        name="username"
        autoComplete="username"
        value={form.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="johndoe"
        hint="Letters, numbers and underscores only"
      />

      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="john@example.com"
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="••••••••"
        hint="Minimum 6 characters"
      />

      {/* ── Avatar upload (required) ──────────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-text-secondary">
          Avatar <span className="text-accent">*</span>
        </p>
        <button
          type="button"
          onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
          className="w-full flex items-center gap-3 rounded-lg border border-dashed border-bg-border
                     bg-bg-elevated px-4 py-3 hover:border-accent transition-colors text-left"
        >
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="size-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="size-10 rounded-full bg-bg-border flex items-center justify-center shrink-0">
              <UploadCloud size={16} className="text-text-muted" aria-hidden="true" />
            </div>
          )}
          <span className="text-sm text-text-secondary">
            {avatarPreview ? "Change avatar" : "Upload avatar"}
          </span>
        </button>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleAvatarChange}
          aria-label="Upload avatar"
        />
        {errors.avatar && (
          <p role="alert" className="text-xs text-error">{errors.avatar}</p>
        )}
      </div>

      {/* ── Cover image upload (optional) ────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-text-secondary">
          Cover Image <span className="text-text-muted">(optional)</span>
        </p>
        <button
          type="button"
          onClick={() => coverInputRef.current && coverInputRef.current.click()}
          className="w-full rounded-lg border border-dashed border-bg-border bg-bg-elevated
                     hover:border-accent transition-colors overflow-hidden"
        >
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover preview"
              className="w-full h-20 object-cover"
            />
          ) : (
            <div className="flex items-center justify-center gap-2 py-4 text-text-muted">
              <UploadCloud size={16} aria-hidden="true" />
              <span className="text-sm">Upload cover image</span>
            </div>
          )}
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleCoverChange}
          aria-label="Upload cover image"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full mt-2"
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
