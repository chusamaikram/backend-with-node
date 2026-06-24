import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import useAuthStore from "@/store/authStore";

function ProfileTab() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm]     = useState({ fullname: user?.fullname ?? "", email: user?.email ?? "" });
  const [saved, setSaved]   = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    updateUser(form);  // Sprint 6: also call API
    setSaved(true);
  }

  return (
    <section className="max-w-lg space-y-6">
      {/* Avatar + cover preview */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-secondary block">Avatar</label>
        <div className="flex items-center gap-4">
          <Avatar
            src={user?.avatar}
            alt={user?.fullname}
            fallback={user?.username?.[0] ?? "U"}
            size="xl"
          />
          <label className="cursor-pointer text-sm text-accent hover:underline">
            Change avatar
            <input type="file" accept="image/*" className="sr-only" />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-text-secondary block">Cover Image</label>
        <div className="w-full h-24 rounded-xl bg-bg-elevated border border-dashed border-bg-border
                        flex items-center justify-center cursor-pointer hover:border-accent transition-colors">
          <label className="cursor-pointer text-sm text-text-muted hover:text-accent transition-colors">
            Upload cover image
            <input type="file" accept="image/*" className="sr-only" />
          </label>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label="Full Name"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          placeholder="Your full name"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
        />
        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="md">Save Changes</Button>
          {saved && <span className="text-sm text-success">Saved ✓</span>}
        </div>
      </form>
    </section>
  );
}

export default ProfileTab;
