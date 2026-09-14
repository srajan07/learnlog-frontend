import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { getPosts } from "../../services/communityService";

import thinkingDev from "../../assets/illustrations/thinking-dev.png";
import communityDev from "../../assets/illustrations/community-dev.png";

function Dashboard() {
  const { user } = useAuth();

  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.name || user?.fullName || "Learner";
  const userInitial = displayName.charAt(0).toUpperCase();

 useEffect(() => {
  const loadPosts = async () => {
    try {
      const response = await getPosts();

      const posts = response?.data?.posts || [];

      setRecentPosts(posts.slice(0, 3));
    } catch (error) {
      console.error("Failed to load recent posts:", error);
    } finally {
      setLoading(false);
    }
  };

  loadPosts();
}, []);
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#20242B]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* =====================================================
            WELCOME
        ====================================================== */}
        <section className="mb-12">
          <div className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_340px] items-center">

              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#ECEFEA] text-[#587A63] flex items-center justify-center font-semibold">
                    {userInitial}
                  </div>

                  <span className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
                    Welcome back
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight leading-tight">
                  Hi, {displayName}.
                </h1>

                <p className="mt-4 text-sm sm:text-base text-[#70757D] leading-relaxed max-w-xl">
                  Keep learning at your own pace. When something finally
                  makes sense, leave a note for the next person.
                </p>

                <Link
                  to="/community/create"
                  className="inline-flex mt-6 items-center justify-center rounded-lg bg-[#253044] !text-white px-5 py-3 text-sm font-medium hover:bg-[#1D2636] transition-colors"
                >
                  Share something you learned →
                </Link>
              </div>

              {/* Illustration */}
              <div className="flex justify-center items-end px-6 pt-2 pb-6 md:py-8 lg:px-8">
                <img
                  src={thinkingDev}
                  alt="A developer thinking while learning"
                  className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px] lg:max-w-[320px] h-auto object-contain"
                />
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            NOTES FROM OTHER LEARNERS
        ====================================================== */}
        <section className="mb-12">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
                Community
              </p>

              <h2 className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight">
                Notes from other learners
              </h2>

              <p className="mt-2 text-sm text-[#70757D]">
                See what people are learning and understanding along the way.
              </p>
            </div>

            <Link
              to="/community"
              className="text-sm font-medium text-[#253044] hover:underline"
            >
              Explore community →
            </Link>
          </div>

          {loading ? (
            <div className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-xl p-5 text-sm text-[#8A8F96]">
              Loading notes...
            </div>
          ) : recentPosts.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {recentPosts.map((post, index) => {
                const cardStyles = [
                  {
                    bg: "bg-[#EEF3F7]",
                    border: "border-[#D8E1E8]",
                    tag: "bg-[#DCE7EE]",
                  },
                  {
                    bg: "bg-[#F3F0E8]",
                    border: "border-[#E5DED0]",
                    tag: "bg-[#E8E1D1]",
                  },
                  {
                    bg: "bg-[#EEF1EC]",
                    border: "border-[#DCE0D8]",
                    tag: "bg-[#E0E7DB]",
                  },
                ];

                const style = cardStyles[index % cardStyles.length];

                return (
                  <Link
                    key={post._id}
                    to={`/community/${post._id}`}
                    className={`group ${style.bg} border ${style.border} rounded-2xl p-5 sm:p-6 min-w-0 hover:-translate-y-0.5 transition-all duration-200`}
                  >

                    {/* User */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">

                        <div className="w-8 h-8 rounded-full bg-white/70 border border-black/5 flex items-center justify-center text-xs font-semibold text-[#587A63] shrink-0">
                          {(post.user?.name ||
                            post.user?.fullName ||
                            "L")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <p className="text-xs text-[#70757D] truncate">
                          {post.user?.name ||
                            post.user?.fullName ||
                            "Learner"}
                        </p>
                      </div>

                      <span className="text-[11px] text-[#8A8F96] shrink-0">
                        Learning note
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-5 text-base sm:text-lg font-semibold leading-snug text-[#20242B] group-hover:text-[#253044] break-words">
                      {post.title}
                    </h3>

                    {/* Content */}
                    {post.content && (
                      <p className="mt-3 text-sm text-[#70757D] leading-relaxed line-clamp-4">
                        {post.content}
                      </p>
                    )}

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-5">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={`${post._id}-${tag}`}
                            className={`rounded-full ${style.tag} px-2.5 py-1 text-[11px] text-[#59616A]`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom */}
                    <div className="mt-5 flex items-center gap-4 text-xs text-[#70757D]">
                      <span className="inline-flex items-center gap-1.5">
                        🤔
                        <span>{post.reactionCount || 0}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        💬
                        <span>{post.commentCount || 0}</span>
                      </span>
                    </div>

                  </Link>
                );
              })}

            </div>

          ) : (

            <div className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">

                <img
                  src={communityDev}
                  alt="Developers sharing what they learn"
                  className="w-36 sm:w-44 h-auto object-contain shrink-0"
                />

                <div className="text-center sm:text-left">

                  <p className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
                    Start here
                  </p>

                  <h3 className="mt-1.5 text-lg font-semibold">
                    Nothing here yet.
                  </h3>

                  <p className="mt-2 text-sm text-[#70757D] leading-relaxed max-w-md">
                    Be the first to share something you learned, a mistake
                    that taught you something, or an idea that finally
                    clicked.
                  </p>

                  <Link
                    to="/community/create"
                    className="inline-flex mt-4 items-center justify-center rounded-lg bg-[#253044] !text-white px-4 py-2.5 text-sm font-medium hover:bg-[#1D2636] transition-colors"
                  >
                    Write a learning note →
                  </Link>

                </div>

              </div>
            </div>
          )}

        </section>

        {/* =====================================================
            HOW TO WRITE A GOOD POST (teaser → guide page)
        ====================================================== */}
        <section className="mb-12">
          <Link
            to="/sample"
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FCFCF9] border border-[#E2E3DE] rounded-2xl p-5 sm:p-7 hover:border-[#D9C7A8] transition-colors"
          >
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
                Before you post
              </p>

              <h2 className="mt-1.5 text-lg sm:text-xl font-semibold tracking-tight">
                A good learning post is simple.
              </h2>

              <p className="mt-1.5 text-sm text-[#70757D] leading-relaxed">
                See a real example and what makes it useful.
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 shrink-0 rounded-lg bg-[#253044] !text-white px-4 py-2.5 text-sm font-medium group-hover:bg-[#1D2636] transition-colors">
              Read the guide →
            </span>
          </Link>
        </section>

        {/* =====================================================
            SMALL HUMAN THOUGHT
        ====================================================== */}
        <section className="mt-12 sm:mt-14">

          <div className="border-t border-[#E2E3DE] pt-8">
            <div className="max-w-2xl mx-auto text-center px-4">

              <p className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
                A small thought
              </p>

              <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">
                You don't have to know everything to help someone.
              </h2>

              <p className="mt-3 text-sm sm:text-base text-[#70757D] leading-relaxed">
                Sometimes the thing you understood a few minutes ago
                is exactly what another learner is struggling with.
              </p>

              <Link
                to="/community/create"
                className="inline-flex mt-5 text-sm font-medium text-[#253044] hover:underline"
              >
                Share something small →
              </Link>

            </div>
          </div>

        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer className="mt-12 sm:mt-16 border-t border-[#E2E3DE] pt-6 pb-2">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8A8F96]">

            <p className="text-center sm:text-left">
              <span className="font-medium text-[#20242B]">
                Learnlog
              </span>{" "}
              — learn, understand, share what clicked.
            </p>

            <p className="text-center sm:text-right">
              Made for people figuring things out.
            </p>

          </div>

        </footer>

      </div>
    </main>
  );
}

export default Dashboard;