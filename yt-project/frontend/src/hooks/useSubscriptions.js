import { useEffect, useCallback } from "react";
import useSubscriptionStore from "@/store/subscriptionStore";
import useAuthStore from "@/store/authStore";
import { getSubscribedChannels, toggleSubscription } from "@/api/services/subscription.service";
import toast from "react-hot-toast";

function useSubscriptions() {
    const { user } = useAuthStore();
    const { channels, loading, error, setChannels, setLoading, setError, toggleChannel, reset } =
        useSubscriptionStore();

    useEffect(() => {
        if (!user?._id) return;

        const fetch = async () => {
            setLoading(true);
            try {
                const res = await getSubscribedChannels(user._id);
                // API returns paginated { docs } where each doc is { subscribedChannel: {...} }
                const docs = res.data?.docs ?? [];
                setChannels(docs.map((item) => ({
                    ...item.subscribedChannel,
                    isSubscribed: true, // already subscribed since they appear here
                })));
            } catch (err) {
                setError(err?.response?.data?.message ?? "Failed to load subscriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetch();
        return () => reset();
    }, [user?._id]);

    const handleToggle = useCallback(
        async (channelId) => {
            toggleChannel(channelId); // optimistic
            try {
                await toggleSubscription(channelId);
            } catch {
                toggleChannel(channelId); // revert
                toast.error("Failed to update subscription.");
            }
        },
        [toggleChannel]
    );

    return { channels, loading, error, handleToggle };
}

export default useSubscriptions;
