import Container from "@/layouts/Container";
import TweetForm from "./TweetForm";
import TweetCard from "./TweetCard";
import { Skeleton } from "@/components/skeletons";
import useTweets from "@/hooks/useTweets";

function TweetCardSkeleton() {
    return (
        <div className="bg-bg-elevated rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
                <Skeleton className="size-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                </div>
            </div>
        </div>
    );
}

function TweetsPage() {
    const { tweets, loading, error, handleCreate, handleEdit, handleDelete, handleLike } = useTweets();

    return (
        <Container as="section" className="py-6 max-w-2xl space-y-5">
            <h1 className="text-xl font-semibold text-text-primary">Tweets</h1>
            <TweetForm onPost={handleCreate} />

            {loading ? (
                <ul className="space-y-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <li key={i}><TweetCardSkeleton /></li>
                    ))}
                </ul>
            ) : error ? (
                <p className="text-error text-sm">{error}</p>
            ) : tweets.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-4xl mb-3">✍️</p>
                    <p className="text-text-primary font-medium">No tweets yet</p>
                    <p className="text-sm text-text-muted mt-1">Share your thoughts above.</p>
                </div>
            ) : (
                <ul role="list" className="space-y-4">
                    {tweets.map((t) => (
                        <li key={t._id}>
                            <TweetCard
                                tweet={t}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onLike={handleLike}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </Container>
    );
}

export default TweetsPage;
