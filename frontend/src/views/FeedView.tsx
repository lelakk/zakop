import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import type { components } from "../api/schema";

type PostSummary = components["schemas"]["PostSummaryDto"];

interface FeedViewProps {
  onSelectPost: (id: number) => void;
  onRequireLogin: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ onSelectPost, onRequireLogin }) => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data } = await api.GET("/posts", { params: { query: { sort: "HOT" } } });
    if (data) {
      // Sortowanie po najwyższym voteScore
      setPosts(data.sort((a, b) => b.voteScore - a.voteScore));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVoteChange = (postId: number, newScore: number, newVote: "UPVOTE" | "DOWNVOTE" | "NONE") => {
    setPosts((prev) =>
      prev
        .map((p) => (p.id === postId ? { ...p, voteScore: newScore, userVote: newVote } : p))
        .sort((a, b) => b.voteScore - a.voteScore)
    );
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Wczytywanie wpisów...</div>;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onClick={() => onSelectPost(post.id)}
          onVoteChange={(newScore, newVote) => handleVoteChange(post.id, newScore, newVote)}
          onRequireLogin={onRequireLogin}
        />
      ))}
    </div>
  );
};
