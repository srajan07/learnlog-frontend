import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts, toggleReaction } from "../../services/communityService";
import { useAuth } from "../../Context/AuthContext";

function SkeletonCard() {
  return (
    <div className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-xl p-6 sm:p-7 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#F0F1EC]" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 rounded bg-[#F0F1EC]" />
          <div className="h-2.5 w-16 rounded bg-[#F0F1EC]" />
        </div>
      </div>
      <div className="h-5 w-3/4 rounded bg-[#F0F1EC] mb-3" />
      <div className="h-3 w-full rounded bg-[#F0F1EC] mb-2" />
      <div className="h-3 w-5/6 rounded bg-[#F0F1EC]" />
    </div>
  );
}

function CommunityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reactingPostId, setReactingPostId] = useState(null);

  const handleReaction = async (postId) => {
    if (!user) {
    navigate("/login");
    return;
  }

  if (reactingPostId === postId) return;

  setReactingPostId(postId);
  try {
    const response = await toggleReaction(postId);

    const { reacted, count } = response;

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              reacted,
              reactionCount: count,
            }
          : post
      )
    );
  } catch (error) {
    console.error("Error reacting to post:", error);
  } finally {
    setReactingPostId(null);
  }
};
  const fetchPosts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getPosts();

      setPosts(
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []
      );
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load learning journeys."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#F7F7F3] text-[#20242B]">
      <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* HEADER */}
        <section className="pb-8 border-b border-[#E2E3DE] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="min-w-0 space-y-1.5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
                Learning community
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#20242B]">
                Learn from each other.
              </h1>
              <p className="text-sm text-[#70757D] leading-relaxed">
                Read notes and reflections shared by fellow learners.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/community/me" className="btn-secondary">
                My Journey
              </Link>
              <Link to="/community/create" className="btn-primary">
                Share Journey →
              </Link>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-7 rounded-xl border border-[#E7CECE] bg-[#F8EEEE] px-4 py-3 text-sm text-[#A55D5D]">
            {error}
          </div>
        )}

        {/* SECTION TITLE */}
        <section>
          <div className="flex items-center justify-between pb-5">
            <h2 className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
              Recent Journeys
            </h2>
            {!loading && posts.length > 0 && (
              <p className="text-xs text-[#8A8F96]">
                {posts.length} {posts.length === 1 ? "entry" : "entries"}
              </p>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* POSTS LIST */}
          {!loading && posts.length > 0 && (
            <div className="space-y-5">
              {posts.map((post) => {
                const authorName =
                  post.user?.name ||
                  post.user?.fullName ||
                  "Learner";

                const authorInitial = authorName.charAt(0).toUpperCase();

                const postDate = post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently";

                const isOwner =
                  user &&
                  post.user?._id &&
                  String(post.user._id) === String(user.id);

                return (
                  <article
                    key={post._id}
                    className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-xl p-6 sm:p-7 transition-all hover:border-[#C7CBD1] block"
                  >
                    {/* AUTHOR & DATE */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#ECEFEA] text-[#587A63] flex items-center justify-center text-xs font-semibold shrink-0">
                        {authorInitial}
                      </div>

                      <div className="min-w-0">
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

                    {/* CONTENT LINK */}
                    <Link to={`/community/${post._id}`} className="block group">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#20242B] group-hover:text-[#253044] transition-colors leading-snug">
                        {post.title}
                      </h3>

                      {post.content && (
                        <p className="mt-2.5 text-sm text-[#70757D] leading-relaxed line-clamp-3">
                          {post.content}
                        </p>
                      )}

                      {/* OPTIONAL IMAGE */}
                      {post.image && (
                        <div className="mt-4 max-w-lg overflow-hidden rounded-xl border border-[#E2E3DE] bg-[#F0F1EC]">
                          <img
                            src={post.image}
                            alt={post.title || "Learning note"}
                            className="w-full max-h-72 object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.parentElement.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {/* TAGS + LINK */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2E3DE]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {post.tags?.slice(0, 3).map((tag, idx) => (
                            <span
                              key={`${tag}-${idx}`}
                              className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0F1EC] border border-[#E2E3DE] text-[#70757D]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <span className="text-xs font-medium text-[#253044] group-hover:underline shrink-0">
                          Read journey →
                        </span>
                      </div>
                    </Link>
                <div className="mt-4 flex items-center gap-3">
  {/* Reaction */}
  <button
    onClick={() => handleReaction(post._id)}
    disabled={reactingPostId === post._id}
    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
      post.reacted
        ? "bg-violet-100 border-violet-300 text-violet-700 hover:bg-violet-200"
        : "bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100"
    } ${
      reactingPostId === post._id
        ? "opacity-60 cursor-not-allowed"
        : "cursor-pointer"
    }`}
  >
    {reactingPostId === post._id ? (
      <span>Reacting...</span>
    ) : (
      <>
        <span>🤔</span>
        <span>I struggled with this too</span>
        <span className="font-semibold">{post.reactionCount || 0}</span>
      </>
    )}
  </button>

  {/* Comments */}
  <button
    className="inline-flex items-center gap-2 rounded-full border border-[#E2E3DE] bg-[#F7F7F3] px-3.5 py-2 text-sm font-medium text-[#70757D] hover:bg-[#F0F1EC] hover:text-[#20242B] transition-all"
  >
    <span>💬</span>
    <span>Comments</span>
    <span className="font-semibold">{post.commentCount || 0}</span>
  </button>
</div>
                  </article>
                );
              })}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && posts.length === 0 && !error && (
            <div className="bg-[#FCFCF9] border border-dashed border-[#E2E3DE] rounded-xl py-14 px-6 text-center space-y-3">
              <p className="text-base font-semibold text-[#20242B]">
                No learning notes yet.
              </p>
              <p className="text-sm text-[#70757D] max-w-sm mx-auto">
                Be the first to share what you worked on or understood today.
              </p>
              <Link to="/community/create" className="btn-primary inline-flex mt-2">
                Share your journey →
              </Link>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="pt-12 text-center border-t border-[#E2E3DE] mt-12">
          <p className="text-xs text-[#8A8F96]">
            Share what clicked. Someone else may be learning the same thing.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default CommunityPage;