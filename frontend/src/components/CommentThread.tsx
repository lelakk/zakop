import React, { useState } from "react";
import { ChevronDown, ChevronRight, CornerDownRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { components } from "../api/schema";

type CommentDto = components["schemas"]["CommentDto"];

interface CommentThreadProps {
  comment: CommentDto;
  onAddReply: (parentId: number, text: string) => Promise<void>;
  onRequireLogin: () => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comment, onAddReply, onRequireLogin }) => {
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    await onAddReply(comment.id, replyText);
    setReplyText("");
    setReplying(false);
    setSubmitting(false);
  };

  return (
    <div className="relative pl-3 border-l-2 border-slate-800 my-2">
      <div className="text-xs text-slate-400 flex items-center gap-2 mb-1">
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-slate-200">
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <strong className="text-slate-300">{comment.authorEmail}</strong>
      </div>

      {!collapsed && (
        <>
          <p className="text-sm text-slate-200 py-1">{comment.content}</p>

          <div className="mt-1">
            <button
              onClick={() => (isAuthenticated ? setReplying(!replying) : onRequireLogin())}
              className="text-xs text-slate-400 hover:text-orange-400 flex items-center gap-1"
            >
              <CornerDownRight className="w-3 h-3" /> Odpowiedz
            </button>
          </div>

          {replying && (
            <form onSubmit={handleSubmitReply} className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Napisz odpowiedź..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-500 rounded text-xs font-semibold text-white disabled:opacity-50"
              >
                Dodaj
              </button>
            </form>
          )}

          {comment.children && comment.children.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.children.map((child) => (
                <CommentThread
                  key={child.id}
                  comment={child}
                  onAddReply={onAddReply}
                  onRequireLogin={onRequireLogin}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
