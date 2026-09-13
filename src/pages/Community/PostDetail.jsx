import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPost, deletePost, toggleReaction, getComments, createComment, updateComment, deleteComment } from "../../services/communityService";
import { useAuth } from "../../Context/AuthContext";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [reactionCount, setReactionCount] = useState(0);
  const [reacted, setReacted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // --- comment edit/delete state (this was missing) ---
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [commentActionLoading, setCommentActionLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPost(id);
        const { post, reactionCount, reacted } = response.data;
        setPost(post);
        setReactionCount(reactionCount);
        setReacted(reacted);
      } catch (error) {
        console.error("Post detail error:", error);
        setError(error.response?.data?.message || "Journey entry not found.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchComments() {
      try {
        const response = await getComments(id);
        setComments(response.data);
      } catch (error) {
        console.error("Comments error:", error);
      } finally {
        setCommentsLoading(false);
      }
    }

    fetchPost();
    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this journey entry?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deletePost(id);
      navigate("/community");
    } catch (error) {
      console.error("Delete post error:", error);
      setError(error.response?.data?.message || "Failed to delete this journey entry.");
      setDeleting(false);
    }
  };

  const handleCreateComment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!commentText.trim()) return;
    if (commentSubmitting) return;

    setCommentSubmitting(true);
    try {
      const response = await createComment(id, commentText);
      const newComment = response.data;
      setComments((currentComments) => [newComment, ...currentComments]);
      setCommentText("");
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleReaction = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (reacting) return;

    setReacting(true);
    try {
      const response = await toggleReaction(post._id);
      const { reacted, count } = response;
      setReactionCount(count);
      setReacted(reacted);
    } catch (error) {
      console.log("error while reacting");
    } finally {
      setReacting(false);
    }
  };

  // --- comment edit handlers ---
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;
    if (commentActionLoading) return;

    setCommentActionLoading(true);
    try {
      const response = await updateComment(commentId, editingText);
      const updatedComment = response.data;

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );

      setEditingCommentId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setCommentActionLoading(false);
    }
  };

  // --- comment delete handler (was missing entirely) ---
  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;
    if (deletingCommentId) return;

    setDeletingCommentId(commentId);
    try {
      await deleteComment(commentId);
      setComments((currentComments) =>
        currentComments.filter((comment) => comment._id !== commentId)
      );
      // in case the deleted comment was mid-edit
      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditingText("");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F7F3] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="spinner mx-auto" />
          <p className="mt-4 text-sm text-[#8A8F96]">Loading journey...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-[#F7F7F3] flex items-center justify-center px-5 text-[#20242B]">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-xl font-semibold text-[#20242B]">
            We couldn't find this journey.
          </h1>
          <p className="text-sm text-[#70757D]">
            {error || "This entry may have been removed."}
          </p>
          <Link to="/community" className="btn-primary">
            ← Back to Community
          </Link>
        </div>
      </main>
    );
  }

  const authorName = post.user?.fullName || "Learner";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const postDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const isOwner =
    user && post.user?._id && String(post.user._id) === String(user.id);

  return (
    <main className="w-full min-h-screen bg-[#F7F7F3] text-[#20242B]">
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* BACK LINK */}
        <Link
          to="/community"
          className="inline-flex items-center text-sm text-[#8A8F96] hover:text-[#20242B] transition-colors mb-8"
        >
          ← Back to Community
        </Link>

        {/* ARTICLE */}
        <article className="space-y-8">

          {/* AUTHOR & ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E3DE]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ECEFEA] text-[#587A63] flex items-center justify-center text-xs font-semibold shrink-0">
                {authorInitial}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[#20242B]">
                    {authorName}
                  </span>
                  {isOwner && (
                    <span className="badge text-[10px] py-0.5 px-2">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8A8F96] mt-0.5">
                  {postDate}
                </p>
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center gap-3">
                <Link to={`/community/edit/${post._id}`} className="btn-secondary text-xs">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-danger text-xs"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>

          {/* TITLE */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#20242B] leading-tight">
            {post.title}
          </h1>

          {/* MAIN CONTENT */}
          <div className="text-base sm:text-lg text-[#20242B] leading-relaxed whitespace-pre-line">
            {post.content}
          </div>

          {/* OPTIONAL IMAGE */}
          {post.image && (
            <figure className="pt-4">
              <div className="overflow-hidden rounded-xl border border-[#E2E3DE] bg-[#FCFCF9]">
                <img
                  src={post.image}
                  alt={post.title || "Note attachment"}
                  className="w-full max-h-[500px] object-contain mx-auto"
                />
              </div>
            </figure>
          )}

          {/* TAGS */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="pt-6 border-t border-[#E2E3DE] flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="text-xs px-3 py-1 rounded-full bg-[#F0F1EC] border border-[#E2E3DE] text-[#70757D]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleReaction}
            disabled={reacting}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
              reacted
                ? "bg-violet-100 text-violet-700 border-violet-300 hover:bg-violet-200"
                : "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
            } ${reacting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {reacting ? (
              "Reacting..."
            ) : (
              <>
                🤔 I struggled with this too{" "}
                <span className="font-semibold">{reactionCount}</span>
              </>
            )}
          </button>

          {/* COMMENTS */}
          <section className="mt-14 pt-8 border-t border-[#E2E3DE]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#20242B]">
                Comments
              </h2>
              <span className="text-xs text-[#8A8F96]">
                {comments.length}
              </span>
            </div>

            {/* ADD COMMENT */}
            <div className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  user ? "Share your thoughts..." : "Log in to leave a comment"
                }
                disabled={!user || commentSubmitting}
                className="w-full min-h-[100px] resize-none rounded-xl border border-[#E2E3DE] bg-[#FCFCF9] px-4 py-3 text-sm text-[#20242B] placeholder:text-[#8A8F96] outline-none focus:border-[#253044] transition-colors"
              />

              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={handleCreateComment}
                  disabled={!user || commentSubmitting || !commentText.trim()}
                  className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {commentSubmitting ? "Posting..." : "Post comment"}
                </button>
              </div>
            </div>

            {/* COMMENTS LIST */}
            {commentsLoading ? (
              <p className="text-sm text-[#8A8F96]">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-[#8A8F96]">
                No comments yet. Be the first to share your thoughts.
              </p>
            ) : (
              <div className="space-y-5">
                {comments.map((comment) => {
                  const isCommentOwner =
                    user &&
                    comment.user?._id &&
                    String(comment.user._id) === String(user.id);
                  const isEditing = editingCommentId === comment._id;
                  const isDeletingThis = deletingCommentId === comment._id;

                  return (
                    <div
                      key={comment._id}
                      className="pb-5 border-b border-[#E2E3DE]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ECEFEA] text-[#587A63] flex items-center justify-center text-xs font-semibold">
                            {(comment.user?.name || comment.user?.fullName || "L")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-[#20242B]">
                              {comment.user?.fullName || "Learner"}
                            </p>
                            <p className="text-xs text-[#8A8F96]">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </p>
                          </div>
                        </div>

                        {/* EDIT / DELETE ACTIONS */}
                        {isCommentOwner && !isEditing && (
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(comment)}
                              className="text-xs text-[#587A63] hover:text-[#3f5a48] font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment._id)}
                              disabled={isDeletingThis}
                              className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                            >
                              {isDeletingThis ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* CONTENT OR EDIT FORM */}
                      {isEditing ? (
                        <div className="ml-11">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            disabled={commentActionLoading}
                            autoFocus
                            className="w-full min-h-[80px] resize-none rounded-xl border border-[#E2E3DE] bg-[#FCFCF9] px-4 py-3 text-sm text-[#20242B] outline-none focus:border-[#253044] transition-colors"
                          />
                          <div className="flex justify-end gap-3 mt-2">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              disabled={commentActionLoading}
                              className="btn-secondary text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditComment(comment._id)}
                              disabled={commentActionLoading || !editingText.trim()}
                              className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {commentActionLoading ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="ml-11 text-sm text-[#374151] leading-relaxed whitespace-pre-line">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </article>

        {/* FOOTER */}
        <footer className="mt-14 pt-8 border-t border-[#E2E3DE] text-center">
          <p className="text-xs text-[#8A8F96]">
            Share what clicked. Someone else might be learning the same thing.
          </p>
        </footer>

      </div>
    </main>
  );
}

export default PostDetail;