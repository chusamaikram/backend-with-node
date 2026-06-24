import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import useAuthStore from "@/store/authStore";
import { updateAccount, updateAvatar, updateCoverImage } from "@/api/services/user.service";
import toast from "react-hot-toast";

function ProfileTab() {
    const { user, updateUser } = useAuthStore();

    // ── Profile form ──────────────────────────────────────────────────────
    const [form, setForm]         = useState({ fullname: user?.fullname ?? "", email: user?.email ?? "" });
    const [formLoading, setFormLoading] = useState(false);

    async function handleSave(e) {
        e.preventDefault();
        if (!form.fullname.trim() || !form.email.trim()) return;
        setFormLoading(true);
        try {
            const res = await updateAccount({ fullname: form.fullname.trim(), email: form.email.trim() });
            updateUser({ fullname: res.data.fullname, email: res.data.email });
            toast.success("Profile updated.");
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Failed to update profile.");
        } finally {
            setFormLoading(false);
        }
    }

    // ── Avatar upload ─────────────────────────────────────────────────────
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);

    async function handleAvatarChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        setAvatarLoading(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const res = await updateAvatar(formData);
            updateUser({ avatar: res.data.avatar });
            setAvatarPreview(null);
            toast.success("Avatar updated.");
        } catch (err) {
            setAvatarPreview(null);
            toast.error(err?.response?.data?.message ?? "Failed to update avatar.");
        } finally {
            setAvatarLoading(false);
        }
    }

    // ── Cover image upload ────────────────────────────────────────────────
    const [coverPreview, setCoverPreview] = useState(null);
    const [coverLoading, setCoverLoading] = useState(false);

    async function handleCoverChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverPreview(URL.createObjectURL(file));
        setCoverLoading(true);
        try {
            const formData = new FormData();
            formData.append("coverImage", file);
            const res = await updateCoverImage(formData);
            updateUser({ coverImage: res.data.coverImage });
            setCoverPreview(null);
            toast.success("Cover image updated.");
        } catch (err) {
            setCoverPreview(null);
            toast.error(err?.response?.data?.message ?? "Failed to update cover image.");
        } finally {
            setCoverLoading(false);
        }
    }

    return (
        <section className="max-w-lg space-y-6">

            {/* Avatar */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-text-secondary">Avatar</p>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar
                            src={avatarPreview ?? user?.avatar}
                            alt={user?.fullname}
                            fallback={user?.username?.[0] ?? "U"}
                            size="xl"
                        />
                        {avatarLoading && (
                            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                                <span className="size-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            </div>
                        )}
                    </div>
                    <label className="cursor-pointer text-sm text-accent hover:underline">
                        {avatarLoading ? "Uploading…" : "Change avatar"}
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            disabled={avatarLoading}
                            onChange={handleAvatarChange}
                        />
                    </label>
                </div>
            </div>

            {/* Cover image */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-text-secondary">Cover Image</p>
                <label className="block cursor-pointer">
                    <div className="relative w-full h-28 rounded-xl overflow-hidden bg-bg-elevated border border-dashed border-bg-border hover:border-accent transition-colors">
                        {(coverPreview ?? user?.coverImage) ? (
                            <img
                                src={coverPreview ?? user?.coverImage}
                                alt="Cover"
                                className="size-full object-cover"
                            />
                        ) : (
                            <div className="size-full flex items-center justify-center">
                                <span className="text-sm text-text-muted">Click to upload cover image</span>
                            </div>
                        )}
                        {coverLoading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="size-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            </div>
                        )}
                        {!coverLoading && (coverPreview ?? user?.coverImage) && (
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                                <span className="text-white text-xs opacity-0 hover:opacity-100">Change</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={coverLoading}
                        onChange={handleCoverChange}
                    />
                </label>
            </div>

            {/* Profile form */}
            <form onSubmit={handleSave} className="space-y-4">
                <Input
                    label="Full Name"
                    name="fullname"
                    value={form.fullname}
                    onChange={(e) => setForm((p) => ({ ...p, fullname: e.target.value }))}
                    placeholder="Your full name"
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                />
                <Button type="submit" variant="primary" size="md" disabled={formLoading}>
                    {formLoading ? "Saving…" : "Save Changes"}
                </Button>
            </form>

        </section>
    );
}

export default ProfileTab;
