import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import type { components } from "../api/schema";

type PostSummary = components["schemas"]["PostSummaryDto"];

interface FeedViewProps {
  onSelectPost?: (id: number) => void;
  onRequireLogin?: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  onSelectPost,
  onRequireLogin,
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSelect = onSelectPost ?? ((id: number) => navigate(`/posts/${id}`));
  const handleRequireLogin = onRequireLogin ?? (() => navigate("/login"));

  const fetchPosts = async () => {
    const { data } = await api.GET("/posts", {
      params: { query: { sort: "HOT", page: 0, size: 20 } },
    });
    if (data) {
      // Create a shallow copy before sorting to avoid mutating response in place
      setPosts([...data].sort((a, b) => b.voteScore - a.voteScore));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVoteChange = (
    postId: number,
    newScore: number,
    newVote: "UPVOTE" | "DOWNVOTE" | "NONE"
  ) => {
    // Stable in-place update without re-sorting to prevent jarring layout shifts under the cursor
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, voteScore: newScore, userVote: newVote } : p
      )
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Wczytywanie wpisów...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-3">
      {posts.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-xl">
          Brak wpisów do wyświetlenia.
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => handleSelect(post.id)}
            onVoteChange={(newScore, newVote) =>
              handleVoteChange(post.id, newScore, newVote)
            }
            onRequireLogin={handleRequireLogin}
          />
        ))
      )}
    </div>
  );
};
