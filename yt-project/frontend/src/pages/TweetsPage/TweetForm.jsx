import { useState } from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import useAuthStore from "@/store/authStore";

function TweetForm({ onPost }) {
    const { user } = useAuthStore();
    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);
    const MAX = 280;

    async function handleSubmit(e) {
        e.preventDefault();
        if (!text.trim()) return;
        setPosting(true);
        await onPost(text.trim());
        setText("");
        setPosting(false);
    }

    return (
        <form onSubmit={handleSubmit} className="bg-bg-elevated rounded-xl p-4 space-y-3">
            <div className="flex gap-3">
                <Avatar
                    src={user?.avatar}
                    alt={user?.fullname}
                    fallback={user?.username?.[0]}
                    size="sm"
                    className="shrink-0 mt-0.5"
                />
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={MAX}
                    placeholder="What's on your mind?"
                    rows={3}
                    aria-label="Compose tweet"
                    className="flex-1 resize-none text-sm bg-transparent text-text-primary
                               placeholder:text-text-muted focus:outline-none leading-relaxed"
                />
            </div>
            <div className="flex items-center justify-between border-t border-bg-border pt-3">
                <span className={`text-xs ${text.length > MAX * 0.9 ? "text-warning" : "text-text-muted"}`}>
                    {MAX - text.length} left
                </span>
                <Button type="submit" size="sm" variant="primary" disabled={!text.trim() || posting}>
                    {posting ? "Posting…" : "Post"}
                </Button>
            </div>
        </form>
    );
}

export default TweetForm;
