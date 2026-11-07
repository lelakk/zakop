import React from "react";
import { MessageSquare } from "lucide-react";
import { VoteControls } from "./VoteControls";
import type { components } from "../api/schema";

type PostSummary = components["schemas"]["PostSummaryDto"];

interface PostCardProps {
  post: PostSummary;
  onClick: () => void;
  onVoteChange: (newScore: number, newVote: "UPVOTE" | "DOWNVOTE" | "NONE") => void;
  onRequireLogin: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick, onVoteChange, onRequireLogin }) => {
  return (
    <article
      onClick={onClick}
      className="flex gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition cursor-pointer"
    >
      <VoteControls
        postId={post.id}
        voteScore={post.voteScore}
        userVote={post.userVote}
        onVoteChange={onVoteChange}
        onRequireLogin={onRequireLogin}
      />

      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-slate-100 hover:text-orange-400 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-slate-400 line-clamp-2 mt-1">{post.content}</p>

        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
          <span>{post.authorEmail}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount}
          </span>
        </div>
      </div>

      {post.imageUrl && (
        <div className="w-32 aspect-video bg-slate-800 rounded-lg overflow-hidden shrink-0 self-center border border-slate-700/50">
          <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </article>
  );
};
