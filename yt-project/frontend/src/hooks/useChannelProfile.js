import { useEffect, useCallback } from "react";
import useChannelStore from "@/store/channelStore";
import useAuthStore from "@/store/authStore";
import { useAuthStatus } from "@/providers/AuthProvider";
import { getChannelProfile } from "@/api/services/user.service";
import { toggleSubscription } from "@/api/services/subscription.service";
import toast from "react-hot-toast";

/**
 * useChannelProfile — fetches a channel profile by username.
 *
 * @param {string} username — from URL params
 */
function useChannelProfile(username) {
    const { isLoggedIn } = useAuthStore();
    const { authChecked } = useAuthStatus();
    const {
        channel,
        loading,
        error,
        isSubscribed,
        subscribersCount,
        setChannel,
        setLoading,
        setError,
        toggleSubscribe,
        revertSubscribe,
        reset,
    } = useChannelStore();

    // ── Fetch channel on mount / username change ──────────────────────────
    useEffect(() => {
        if (!username || !authChecked) return;
        reset();

        const fetch = async () => {
            setLoading(true);
            try {
                const res = await getChannelProfile(username);
                setChannel(res.data);
            } catch (err) {
                setError(err?.response?.data?.message ?? "Channel not found.");
            } finally {
                setLoading(false);
            }
        };

        fetch();
        return () => reset();
    }, [username, authChecked]);

    // ── Subscribe toggle ──────────────────────────────────────────────────
    const handleSubscribe = useCallback(async () => {
        if (!isLoggedIn) {
            toast("Sign in to subscribe", { icon: "👋" });
            return;
        }

        toggleSubscribe(); // optimistic

        try {
            await toggleSubscription(channel._id);
        } catch {
            revertSubscribe();
        }
    }, [channel?._id, isLoggedIn, toggleSubscribe, revertSubscribe]);

    return {
        channel,
        loading,
        error,
        isSubscribed,
        subscribersCount,
        handleSubscribe,
        isLoggedIn,
    };
}

export default useChannelProfile;
