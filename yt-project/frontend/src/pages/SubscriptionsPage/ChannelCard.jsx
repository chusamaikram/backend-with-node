import { Link } from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useState } from "react";

function ChannelCard({ channel }) {
  const [subscribed, setSubscribed] = useState(channel.isSubscribed);

  return (
    <article className="flex flex-col items-center gap-3 bg-bg-elevated rounded-xl p-5 text-center">
      <Link to={`/channel/${channel.username}`}>
        <Avatar
          src={channel.avatar}
          alt={channel.fullname}
          fallback={channel.username[0]}
          size="xl"
          className="hover:ring-2 hover:ring-accent transition-all"
        />
      </Link>
      <div>
        <Link to={`/channel/${channel.username}`}>
          <p className="font-semibold text-text-primary text-sm hover:text-accent transition-colors">{channel.fullname}</p>
        </Link>
        <p className="text-xs text-text-muted mt-0.5">{channel.subscribersCount?.toLocaleString()} subscribers</p>
      </div>
      <Button
        variant={subscribed ? "secondary" : "primary"}
        size="sm"
        onClick={() => setSubscribed((p) => !p)}
      >
        {subscribed ? "Subscribed ✓" : "Subscribe"}
      </Button>
    </article>
  );
}

export default ChannelCard;
