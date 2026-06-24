import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Container from "@/layouts/Container";
import ChannelHeader from "./ChannelHeader";
import ChannelTabs from "./ChannelTabs";
import VideoGrid from "@/pages/HomePage/VideoGrid";
import { VideoGridSkeleton, PlaylistCardSkeleton } from "@/components/skeletons";
import PlaylistCard from "@/pages/PlaylistsPage/PlaylistCard";
import SearchInput from "@/components/ui/SearchInput";
import useChannelProfile from "@/hooks/useChannelProfile";
import { getAllVideos } from "@/api/services/video.service";
import { getUserPlaylists } from "@/api/services/playlist.service";
import { getUserTweets } from "@/api/services/tweet.service";
import useAuthStore from "@/store/authStore";
import { formatDate } from "@/utils/formatDate";
import useDebounce from "@/hooks/useDebounce";

/**
 * ChannelPage — public channel profile with lazy-loaded tabs.
 *
 * Lazy tab loading — why and how:
 *   We don't fetch all 3 tabs on mount — that would be 3 API calls for data
 *   the user may never see. Instead we track which tabs have been "activated"
 *   using a Set stored in a ref. When a tab is first clicked, we fetch its data
 *   and mark it as loaded. Subsequent clicks just show the cached state.
 *
 * Why useRef for loadedTabs instead of useState?
 *   We don't need a re-render when a tab is marked as loaded — we just need
 *   to remember the fact. useRef is the right tool for mutable values that
 *   don't drive rendering.
 */
function ChannelPage() {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("Videos");
    const [query, setQuery]         = useState("");
    const debouncedQuery            = useDebounce(query, 250);

    // Reset search when switching tabs
    function handleTabChange(tab) {
        setActiveTab(tab);
        setQuery("");
    }

    const { user } = useAuthStore();
    const isOwner = user?.username === username;

    const {
        channel,
        loading: channelLoading,
        error,
        isSubscribed,
        subscribersCount,
        handleSubscribe,
    } = useChannelProfile(username);

    // ── Tab data state ────────────────────────────────────────────────────
    const [videos, setVideos]         = useState([]);
    const [playlists, setPlaylists]   = useState([]);
    const [tweets, setTweets]         = useState([]);
    const [tabLoading, setTabLoading] = useState(false);

    // Track which tabs have already been fetched — no re-fetching on tab switch
    const loadedTabs = useRef(new Set());

    // ── Fetch tab data when channel is loaded and tab changes ─────────────
    useEffect(() => {
        if (!channel?._id || loadedTabs.current.has(activeTab)) return;

        const fetchTab = async () => {
            setTabLoading(true);
            try {
                if (activeTab === "Videos") {
                    const res = await getAllVideos({ userId: channel._id, limit: 12 });
                    setVideos(res.data.docs ?? []);
                }
                if (activeTab === "Playlists") {
                    const res = await getUserPlaylists(channel._id);
                    setPlaylists(res.data.docs ?? []);
                }
                if (activeTab === "Tweets") {
                    const res = await getUserTweets(channel._id, { limit: 10 });
                    setTweets(res.data.docs ?? []);
                }
                // Mark this tab as loaded so we don't re-fetch on next switch
                loadedTabs.current.add(activeTab);
            } catch {
                // Tab fetch failed silently — show empty state
            } finally {
                setTabLoading(false);
            }
        };

        fetchTab();
    }, [activeTab, channel?._id]);

    // ── Filtered data per tab ─────────────────────────────────────────────
    const q = debouncedQuery.toLowerCase().trim();
    const filteredVideos    = q ? videos.filter((v) => v.title.toLowerCase().includes(q))         : videos;
    const filteredPlaylists = q ? playlists.filter((pl) => pl.name.toLowerCase().includes(q))     : playlists;
    const filteredTweets    = q ? tweets.filter((t) => t.content.toLowerCase().includes(q))       : tweets;

    // ── Error state ───────────────────────────────────────────────────────
    if (error) {
        return (
            <Container className="py-24 text-center">
                <p className="text-5xl mb-4">😕</p>
                <p className="text-lg font-medium text-text-primary">Channel not found</p>
                <p className="text-sm text-text-muted mt-1">{error}</p>
            </Container>
        );
    }

    return (
        <Container as="section" className="py-6 space-y-6">

            <ChannelHeader
                channel={channel}
                loading={channelLoading}
                isSubscribed={isSubscribed}
                subscribersCount={subscribersCount}
                onSubscribe={handleSubscribe}
                isOwner={isOwner}
            />

            {/* Only render tabs once channel data is loaded */}
            {!channelLoading && channel && (
                <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <ChannelTabs active={activeTab} onChange={handleTabChange} />
                        {!tabLoading && (
                            <SearchInput
                                value={query}
                                onChange={setQuery}
                                placeholder={`Search ${activeTab.toLowerCase()}…`}
                                className="w-48 sm:w-60"
                            />
                        )}
                    </div>

                    <div className="pt-2">

                        {/* Videos tab */}
                        {activeTab === "Videos" && (
                            tabLoading ? (
                                <VideoGridSkeleton count={8} />
                            ) : filteredVideos.length === 0 ? (
                                <EmptyTab message={q ? `No videos match “${debouncedQuery}”` : "No videos uploaded yet."} />
                            ) : (
                                <VideoGrid videos={filteredVideos} />
                            )
                        )}

                        {/* Playlists tab */}
                        {activeTab === "Playlists" && (
                            tabLoading ? (
                                <PlaylistCardSkeleton count={6} />
                            ) : filteredPlaylists.length === 0 ? (
                                <EmptyTab message={q ? `No playlists match “${debouncedQuery}”` : "No playlists yet."} />
                            ) : (
                                <ul
                                    role="list"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                                >
                                    {filteredPlaylists.map((pl) => (
                                        <li key={pl._id}>
                                            <PlaylistCard playlist={pl} />
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}

                        {/* Tweets tab */}
                        {activeTab === "Tweets" && (
                            tabLoading ? (
                                <TweetsSkeleton />
                            ) : filteredTweets.length === 0 ? (
                                <EmptyTab message={q ? `No tweets match “${debouncedQuery}”` : "No tweets yet."} />
                            ) : (
                                <ul role="list" className="space-y-4 max-w-2xl">
                                    {filteredTweets.map((tweet) => (
                                        <li
                                            key={tweet._id}
                                            className="bg-bg-elevated rounded-xl p-4 space-y-2"
                                        >
                                            <p className="text-sm text-text-primary leading-relaxed">
                                                {tweet.content}
                                            </p>
                                            <p className="text-xs text-text-muted">
                                                {formatDate(tweet.createdAt)}
                                                &nbsp;&middot;&nbsp;
                                                ❤ {tweet.likesCount}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}

                    </div>
                </>
            )}
        </Container>
    );
}

/* ── Small reusable pieces ───────────────────────────────────────────── */
function EmptyTab({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm text-text-muted">{message}</p>
        </div>
    );
}

function TweetsSkeleton() {
    return (
        <ul className="space-y-4 max-w-2xl">
            {Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="bg-bg-elevated rounded-xl p-4 space-y-2 animate-pulse">
                    <div className="h-4 bg-bg-border rounded w-full" />
                    <div className="h-4 bg-bg-border rounded w-3/4" />
                    <div className="h-3 bg-bg-border rounded w-24 mt-1" />
                </li>
            ))}
        </ul>
    );
}

export default ChannelPage;
