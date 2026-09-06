import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPost, deletePost,toggleReaction } from "../../services/communityService";
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

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPost(id);
        const { post, reactionCount } = response.data;
        setPost(post);
        setReactionCount(reactionCount);
      } catch (error) {
        console.error("Post detail error:", error);
        setError(
          error.response?.data?.message ||
          "Journey entry not found."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
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
      setError(
        error.response?.data?.message ||
        "Failed to delete this journey entry."
      );
      setDeleting(false);
    }
  };
const handleReaction = async () => {
  try {
    const response = await toggleReaction(post._id);
    const { reacted, count } = response;
    setReactionCount(count);
    setReacted(reacted);
  } catch (error) {
   console.log("error while reacting ");
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

  const authorName = post.user?.name || post.user?.fullName || "Learner";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const postDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const isOwner =
    user &&
    post.user?._id &&
    String(post.user._id) === String(user.id);

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

            {/* OWNER ACTIONS */}
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
       className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
       reacted
      ? "bg-[#E8EEE8] text-[#3F5D3A] border-[#B9CDB4] hover:bg-[#DCE6DC]"
      : "bg-[#F0F1EC] text-[#5C6B57] border-[#DDE1D6] hover:bg-[#E4E8E0]"
      }`}
      >
  🤔 I struggled with this too{" "}
  <span className="font-semibold">{reactionCount}</span>
  </button>
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