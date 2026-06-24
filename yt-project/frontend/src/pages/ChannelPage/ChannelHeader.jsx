import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/skeletons/Skeleton";

/**
 * ChannelHeader — purely presentational.
 * All state (isSubscribed, subscribersCount) comes from useChannelProfile via ChannelPage.
 */
function ChannelHeader({ channel, isSubscribed, subscribersCount, onSubscribe, loading, isOwner }) {

    if (loading || !channel) {
        return (
            <header className="space-y-4">
                <Skeleton className="w-full h-36 sm:h-48 rounded-xl" />
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-4">
                    <Skeleton className="size-20 rounded-full -mt-10 ring-4 ring-bg-base shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-lg shrink-0" />
                </div>
            </header>
        );
    }

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
                    className="-mt-10 ring-4 ring-bg-base shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                    <h1 className="text-xl font-bold text-text-primary">{channel.fullname}</h1>
                    <p className="text-sm text-text-muted">
                        @{channel.username}
                        &nbsp;&middot;&nbsp;
                        {subscribersCount.toLocaleString()} subscriber{subscribersCount !== 1 ? "s" : ""}
                        &nbsp;&middot;&nbsp;
                        {channel.channelsSubscribedToCount} subscriptions
                    </p>
                </div>

                {!isOwner && (
                    <Button
                        variant={isSubscribed ? "secondary" : "primary"}
                        size="md"
                        onClick={onSubscribe}
                        className="shrink-0"
                    >
                        {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                    </Button>
                )}
            </div>
        </header>
    );
}

export default ChannelHeader;
