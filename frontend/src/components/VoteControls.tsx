import React from "react";
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

  const handleVote = async (targetType: "UPVOTE" | "DOWNVOTE") => {
    if (!isAuthenticated) return onRequireLogin();

    if (userVote === targetType) {
      // Cofnięcie głosu
      const diff = targetType === "UPVOTE" ? -1 : 1;
      onVoteChange(voteScore + diff, "NONE");
      await api.DELETE("/posts/{postId}/votes", { params: { path: { postId } } });
    } else {
      // Nowy głos lub zmiana
      const diff = userVote === "NONE" ? (targetType === "UPVOTE" ? 1 : -1) : (targetType === "UPVOTE" ? 2 : -2);
      onVoteChange(voteScore + diff, targetType);
      await api.PUT("/posts/{postId}/votes", {
        params: { path: { postId } },
        body: { voteType: targetType },
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 w-14 shrink-0">
      <button
        onClick={(e) => { e.stopPropagation(); handleVote("UPVOTE"); }}
        className={`p-1 rounded hover:bg-slate-800 ${userVote === "UPVOTE" ? "text-orange-500 bg-orange-950/40" : "text-slate-400"}`}
        title="Wykop (+1)"
      >
        <ChevronUp className="w-6 h-6 stroke-[3]" />
      </button>
      <span className={`text-sm font-bold my-0.5 ${voteScore > 0 ? "text-orange-500" : voteScore < 0 ? "text-blue-500" : "text-slate-400"}`}>
        {voteScore}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); handleVote("DOWNVOTE"); }}
        className={`p-1 rounded hover:bg-slate-800 ${userVote === "DOWNVOTE" ? "text-blue-500 bg-blue-950/40" : "text-slate-400"}`}
        title="Zakop (-1)"
      >
        <ChevronDown className="w-6 h-6 stroke-[3]" />
      </button>
    </div>
  );
};
