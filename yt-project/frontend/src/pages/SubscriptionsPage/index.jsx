import Container from "@/layouts/Container";
import ChannelCard from "./ChannelCard";
import { ChannelCardSkeleton } from "@/components/skeletons";
import useSubscriptions from "@/hooks/useSubscriptions";

function SubscriptionsPage() {
    const { channels, loading, error, handleToggle } = useSubscriptions();

    return (
        <Container as="section" className="py-6 space-y-6">
            <h1 className="text-xl font-semibold text-text-primary">Subscribed Channels</h1>

            {loading ? (
                <ChannelCardSkeleton count={8} />
            ) : error ? (
                <p className="text-error text-sm">{error}</p>
            ) : channels.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                    <p className="text-5xl mb-4">📺</p>
                    <p className="text-lg font-medium text-text-primary">No subscriptions yet</p>
                    <p className="text-sm text-text-muted mt-1">Subscribe to channels to see them here.</p>
                </div>
            ) : (
                <ul
                    role="list"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                >
                    {channels.map((ch) => (
                        <li key={ch._id}>
                            <ChannelCard channel={ch} onToggle={handleToggle} />
                        </li>
                    ))}
                </ul>
            )}
        </Container>
    );
}

export default SubscriptionsPage;
