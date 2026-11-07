import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface VoteControlsProps {
  postId: number;
  voteScore: number;
  userVote?: "UPVOTE" | "DOWNVOTE" | "NONE";
  onVoteChange: (newScore: number, newVote: "UPVOTE" | "DOWNVOTE" | "NONE") => void;
  onRequireLogin: () => void;
}

export const VoteControls: React.FC<VoteControlsProps> = ({
  postId,
  voteScore,
  userVote = "NONE",
  onVoteChange,
  onRequireLogin,
}) => {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateOptimisticState = (targetType: "UPVOTE" | "DOWNVOTE") => {
    if (userVote === targetType) {
      const delta = targetType === "UPVOTE" ? -1 : 1;
      return { score: voteScore + delta, vote: "NONE" as const };
    }
    const delta = userVote === "NONE" ? (targetType === "UPVOTE" ? 1 : -1) : (targetType === "UPVOTE" ? 2 : -2);
    return { score: voteScore + delta, vote: targetType };
  };

  const handleVote = async (targetType: "UPVOTE" | "DOWNVOTE") => {
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }
    if (isSubmitting) return;

    const previousScore = voteScore;
    const previousVote = userVote;
    const { score: optimisticScore, vote: optimisticVote } = calculateOptimisticState(targetType);

    onVoteChange(optimisticScore, optimisticVote);
    setIsSubmitting(true);

    try {
      const response = optimisticVote === "NONE"
        ? await api.DELETE("/posts/{postId}/votes", { params: { path: { postId } } })
        : await api.PUT("/posts/{postId}/votes", {
            params: { path: { postId } },
            body: { voteType: targetType },
          });

      if (response.error || !response.data) {
        throw new Error("Vote request failed");
      }

      onVoteChange(response.data.newVoteScore, response.data.currentVote);
    } catch {
      onVoteChange(previousScore, previousVote);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 w-14 shrink-0">
      <button
        type="button"
        disabled={isSubmitting}
        onClick={(e) => { e.stopPropagation(); handleVote("UPVOTE"); }}
        className={`p-1 rounded hover:bg-slate-800 disabled:opacity-50 transition ${
          userVote === "UPVOTE" ? "text-orange-500 bg-orange-950/40" : "text-slate-400"
        }`}
        title="Wykop (+1)"
      >
        <ChevronUp className="w-6 h-6 stroke-[3]" />
      </button>

      <span
        className={`text-sm font-bold my-0.5 ${
          voteScore > 0 ? "text-orange-500" : voteScore < 0 ? "text-blue-500" : "text-slate-400"
        }`}
      >
        {voteScore}
      </span>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={(e) => { e.stopPropagation(); handleVote("DOWNVOTE"); }}
        className={`p-1 rounded hover:bg-slate-800 disabled:opacity-50 transition ${
          userVote === "DOWNVOTE" ? "text-blue-500 bg-blue-950/40" : "text-slate-400"
        }`}
        title="Zakop (-1)"
      >
        <ChevronDown className="w-6 h-6 stroke-[3]" />
      </button>
    </div>
  );
};
