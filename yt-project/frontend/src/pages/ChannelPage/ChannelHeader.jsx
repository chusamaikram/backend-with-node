import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

function ChannelHeader({ channel }) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <header>
      {/* Cover image */}
      <div className="w-full h-36 sm:h-48 rounded-xl overflow-hidden bg-bg-elevated">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-bg-elevated to-bg-border" />
        )}
      </div>

      {/* Profile row */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-4">
        <Avatar
          src={channel.avatar}
          alt={channel.fullname}
          fallback={channel.username?.[0] ?? "?"}
          size="xl"
          className="-mt-10 ring-4 ring-bg-base"
        />

        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-xl font-bold text-text-primary">{channel.fullname}</h1>
          <p className="text-sm text-text-muted">
            @{channel.username} &middot; {channel.subscribersCount?.toLocaleString()} subscribers
            &middot; {channel.channelsSubscribedToCount} subscriptions
          </p>
        </div>

        <Button
          variant={subscribed ? "secondary" : "primary"}
          size="md"
          onClick={() => setSubscribed((p) => !p)}
          className="shrink-0"
        >
          {subscribed ? "Subscribed ✓" : "Subscribe"}
        </Button>
      </div>
    </header>
  );
}

export default ChannelHeader;
