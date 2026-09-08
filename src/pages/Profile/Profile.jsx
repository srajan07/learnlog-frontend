import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import api from "../../services/api";
import { getMyPosts } from "../../services/communityService";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [journeyPostsCount, setJourneyPostsCount] = useState(0);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    if (user) {
      setName(user.name || user.fullName || "");
    }

    async function fetchJourneyPosts() {
      try {
        const myPostsRes = await getMyPosts();

        if (myPostsRes?.data) {
          setJourneyPostsCount(myPostsRes.data.length);
        }
      } catch (err) {
        console.log("Could not load journey posts:", err.message);
      }
    }

    fetchJourneyPosts();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMsg({ text: "", type: "" });

    try {
      await api.put("/users/profile", { name });

      setMsg({
        text: "Profile updated successfully!",
        type: "success",
      });
    } catch (err) {
      setMsg({
        text:
          err.response?.data?.message ||
          "Failed to update profile",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const userInitial = (
    user?.name ||
    user?.fullName ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8 text-[#20242B]">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E2E3DE]">
        <div className="space-y-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
            Account
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#20242B] tracking-tight">
            Profile &amp; Settings
          </h1>

          <p className="text-sm text-[#70757D]">
            Manage your account details.
          </p>
        </div>

        <div className="w-12 h-12 rounded-full bg-[#253044] text-white flex items-center justify-center text-lg font-semibold shrink-0">
          {userInitial}
        </div>
      </div>

      {/* Learning Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Journey Notes */}
        <div className="bg-[#FCFCF9] rounded-xl border border-[#E2E3DE] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-bold text-[#20242B]">
                {journeyPostsCount}
              </div>

              <div className="text-xs text-[#8A8F96] mt-1 font-medium">
                Journey Notes
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/community/me")}
              className="text-xs font-medium text-[#253044] border border-[#E2E3DE] bg-[#F7F7F3] px-3 py-2 rounded-lg hover:bg-[#F0F1EC] hover:border-[#C7CBD1] transition-colors"
            >
              My Journey →
            </button>
          </div>
        </div>

        {/* Learnlog */}
        <div className="bg-[#FCFCF9] rounded-xl border border-[#E2E3DE] p-5">
          <div className="text-2xl font-bold text-[#20242B]">
            Learning
          </div>

          <div className="text-xs text-[#8A8F96] mt-1 font-medium">
            What Learnlog is about
          </div>
        </div>

      </div>

      {/* Profile Form */}
      <div className="bg-[#FCFCF9] rounded-xl border border-[#E2E3DE] p-6 space-y-5">

        <p className="text-xs uppercase tracking-[0.16em] text-[#8A8F96]">
          Account Details
        </p>

        {msg.text && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold border ${
              msg.type === "success"
                ? "bg-[#E6F4EA] border-[#B7E1CD] text-[#137333]"
                : "bg-[#F8EEEE] border-[#E7CECE] text-[#A55D5D]"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#20242B]">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FCFCF9] border border-[#E2E3DE] rounded-xl text-[#20242B] outline-none focus:border-[#9AA5B5]"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#20242B]">
              Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-3.5 py-2.5 text-sm bg-[#F0F1EC] border border-[#E2E3DE] rounded-xl text-[#70757D] cursor-not-allowed"
            />
          </div>

          {/* Member Since */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#20242B]">
              Member Since
            </label>

            <p className="text-sm text-[#70757D]">
              {createdDate}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E3DE]">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#253044] !text-white px-4 py-2.5 text-sm font-medium hover:bg-[#1D2636] transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={logout}
              className="text-xs font-semibold text-[#A55D5D] hover:underline"
            >
              Logout
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;