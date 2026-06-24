import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

function PasswordTab() {
  const { updatePassword, loading } = useAuth();
  const [form, setForm]     = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saved, setSaved]   = useState(false);

  function validate() {
    const e = {};
    if (!form.current)              e.current  = "Current password is required.";
    if (!form.next)                 e.next     = "New password is required.";
    else if (form.next.length < 6)  e.next     = "Minimum 6 characters.";
    if (form.next !== form.confirm) e.confirm  = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const ok = await updatePassword(form.current, form.next);
    if (ok) {
      setSaved(true);
      setForm({ current: "", next: "", confirm: "" });
    }
  }

  return (
    <section className="max-w-sm">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Current Password"
          name="current"
          type="password"
          value={form.current}
          onChange={(e) => { setForm((p) => ({ ...p, current: e.target.value })); setErrors((p) => ({ ...p, current: "" })); setSaved(false); }}
          error={errors.current}
          placeholder="••••••••"
        />
        <Input
          label="New Password"
          name="next"
          type="password"
          value={form.next}
          onChange={(e) => { setForm((p) => ({ ...p, next: e.target.value })); setErrors((p) => ({ ...p, next: "" })); setSaved(false); }}
          error={errors.next}
          placeholder="••••••••"
          hint="Minimum 6 characters"
        />
        <Input
          label="Confirm New Password"
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={(e) => { setForm((p) => ({ ...p, confirm: e.target.value })); setErrors((p) => ({ ...p, confirm: "" })); setSaved(false); }}
          error={errors.confirm}
          placeholder="••••••••"
        />
        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            {loading ? "Saving…" : "Change Password"}
          </Button>
          {saved && <span className="text-sm text-success">Updated ✓</span>}
        </div>
      </form>
    </section>
  );
}

export default PasswordTab;
