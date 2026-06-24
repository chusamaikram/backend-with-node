import { useState } from "react";
import Container from "@/layouts/Container";
import TweetForm from "./TweetForm";
import TweetCard from "./TweetCard";
import { MOCK_TWEETS, MOCK_USER } from "@/data/mockData";

function TweetsPage() {
  const [tweets, setTweets] = useState(MOCK_TWEETS);

  function handlePost(content) {
    setTweets([
      {
        _id: `t-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        owner: MOCK_USER,
        likesCount: 0,
        isLiked: false,
      },
      ...tweets,
    ]);
  }

  function handleEdit(id, content) {
    setTweets((p) => p.map((t) => t._id === id ? { ...t, content } : t));
  }

  function handleDelete(id) {
    setTweets((p) => p.filter((t) => t._id !== id));
  }

  return (
    <Container as="section" className="py-6 max-w-2xl space-y-5">
      <h1 className="text-xl font-semibold text-text-primary">Your Tweets</h1>
      <TweetForm onPost={handlePost} />

      {tweets.length ? (
        <ul role="list" className="space-y-4">
          {tweets.map((t) => (
            <li key={t._id}>
              <TweetCard tweet={t} onEdit={handleEdit} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-text-primary font-medium">No tweets yet</p>
          <p className="text-sm text-text-muted mt-1">Share your thoughts above.</p>
        </div>
      )}
    </Container>
  );
}

export default TweetsPage;
