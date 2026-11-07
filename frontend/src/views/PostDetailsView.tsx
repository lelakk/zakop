import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { CommentThread } from "../components/CommentThread";
import { VoteControls } from "../components/VoteControls";
import { useAuth } from "../context/AuthContext";
import type { components } from "../api/schema";

type PostDetails = components["schemas"]["PostDetailsDto"];

interface PostDetailsViewProps {
  postId?: number;
  onBack?: () => void;
  onRequireLogin?: () => void;
}

export const PostDetailsView: React.FC<PostDetailsViewProps> = ({
  postId: propPostId,
  onBack: propOnBack,
  onRequireLogin: propOnRequireLogin,
}) => {
  const { postId: routePostId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const postId = propPostId ?? (routePostId ? parseInt(routePostId, 10) : NaN);
  const onBack = propOnBack ?? (() => navigate("/"));
  const onRequireLogin = propOnRequireLogin ?? (() => navigate("/login"));

  const [post, setPost] = useState<PostDetails | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadPost = useCallback(async () => {
    if (isNaN(postId)) {
      setHasError(true);
      setLoading(false);
      return;
    }

    setHasError(false);
    const { data, response } = await api.GET("/posts/{postId}", {
      params: { path: { postId } },
    });

    if (!response.ok || !data) {
      setHasError(true);
    } else {
      setPost(data);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleAddComment = async (parentId: number | null, text: string) => {
    const { data: newComment } = await api.POST("/posts/{postId}/comments", {
      params: { path: { postId } },
      body: { content: text, parentId },
    });

    if (newComment) {
      await loadPost();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Ładowanie wpisu...</div>;
  }

  if (hasError || !post) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-400 mb-4">Wpis nie istnieje lub wystąpił błąd pobierania danych.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Powrót do strony głównej
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Powrót do strony głównej
      </button>

      <article className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex gap-4">
          <VoteControls
            postId={post.id}
            voteScore={post.voteScore}
            userVote={post.userVote}
            onVoteChange={(newScore, newVote) =>
              setPost({ ...post, voteScore: newScore, userVote: newVote })
            }
            onRequireLogin={onRequireLogin}
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-100">{post.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Autor: {post.authorEmail} • {post.createdAt}
            </p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                className="w-full aspect-video object-cover rounded-lg my-4 border border-slate-800"
              />
            )}
            <p className="text-slate-200 mt-3 whitespace-pre-line leading-relaxed">{post.content}</p>
          </div>
        </div>
      </article>

      {/* Sekcja komentarzy */}
      <section className="mt-8">
        <h3 className="text-lg font-bold text-slate-200 mb-4">
          Komentarze ({post.commentsCount})
        </h3>

        {isAuthenticated ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (commentText.trim()) {
                handleAddComment(null, commentText);
                setCommentText("");
              }
            }}
            className="mb-6 flex gap-2"
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Dodaj komentarz..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
              rows={2}
            />
            <button
              type="submit"
              className="px-4 bg-orange-600 hover:bg-orange-500 rounded-lg font-semibold text-sm text-white self-end py-2 transition"
            >
              Dodaj
            </button>
          </form>
        ) : (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400 mb-6 flex justify-between items-center">
            <span>Zaloguj się, aby brać udział w dyskusji.</span>
            <button
              onClick={onRequireLogin}
              className="text-orange-500 font-semibold hover:underline"
            >
              Zaloguj
            </button>
          </div>
        )}

        <div className="space-y-4">
          {post.comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onAddReply={(parentId, text) => handleAddComment(parentId, text)}
              onRequireLogin={onRequireLogin}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
