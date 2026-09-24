import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import logo from "../assets/logo.png";

function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = sessionStorage.getItem("resetEmail");
  const otp = sessionStorage.getItem("resetOtp");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email || !otp) {
      setError(
        "Your password reset session has expired. Please request a new OTP."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(
        email,
        otp,
        newPassword
      );

      // Clear password reset data after successful reset.
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetOtp");

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Password reset successfully. You can now sign in with your new password.",
        },
      });
    } catch (error) {
      console.error("Reset password error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to reset your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otp) {
    return (
      <main className="min-h-screen bg-[#F7F7F3] flex items-center justify-center px-5 py-10">

        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <Link
              to="/login"
              className="text-xl font-semibold tracking-tight text-[#20242B]"
            >
              Learnlog
            </Link>
          </div>

          <div className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-2xl p-6 sm:p-8 text-center">

            <div className="w-12 h-12 mx-auto rounded-xl bg-[#F8EEEE] text-[#A55D5D] flex items-center justify-center text-lg mb-5">
              !
            </div>

            <h1 className="text-2xl font-semibold text-[#20242B]">
              Reset session expired
            </h1>

            <p className="mt-3 text-sm text-[#70757D] leading-6">
              Please request a new OTP before creating a new password.
            </p>

            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-lg bg-[#253044] !text-white hover:bg-[#1D2636] text-sm font-medium transition-colors"
            >
              Request new OTP
            </Link>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#20242B] flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-md">

        {/* Brand */}

        <div className="text-center mb-8">

          <Link to="/login" className="inline-block hover:opacity-80 transition-opacity">
            <img
              src={logo}
              alt="Learnlog logo"
              className="h-8 sm:h-9 mx-auto object-contain"
            />
          </Link>

        </div>


        {/* Card */}

        <div className="bg-[#FCFCF9] border border-[#E2E3DE] rounded-2xl p-6 sm:p-8">

          {/* Header */}

          <div className="mb-7">

            <p className="text-xs uppercase tracking-[0.16em] text-[#8A8F96] mb-3">
              New password
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Create a new password.
            </h1>

            <p className="mt-3 text-sm text-[#70757D] leading-6">
              Choose a new password for:
            </p>

            <p className="mt-1 text-sm font-medium text-[#20242B] break-all">
              {email}
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="mb-5 rounded-xl border border-[#E7CECE] bg-[#F8EEEE] px-4 py-3 text-sm text-[#A55D5D]">
              {error}
            </div>
          )}


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* New password */}

            <div className="space-y-2">

              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-[#20242B]"
              >
                New password
              </label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full px-4 py-3 bg-[#F7F7F3] border border-[#E2E3DE] rounded-xl text-sm text-[#20242B] placeholder:text-[#A0A4AA] outline-none transition-all focus:border-[#9AA5B5] focus:ring-2 focus:ring-[#D9E3F0]"
              />

            </div>


            {/* Confirm password */}

            <div className="space-y-2">

              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-[#20242B]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Enter your password again"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full px-4 py-3 bg-[#F7F7F3] border border-[#E2E3DE] rounded-xl text-sm text-[#20242B] placeholder:text-[#A0A4AA] outline-none transition-all focus:border-[#9AA5B5] focus:ring-2 focus:ring-[#D9E3F0]"
              />

            </div>


            {/* Password hint */}

            <p className="text-xs text-[#9A9EA4]">
              Use at least 6 characters.
            </p>


            {/* Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#253044] !text-white hover:bg-[#1D2636] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {loading
                ? "Resetting password..."
                : "Reset Password"}
            </button>

          </form>


          {/* Footer */}

          <div className="mt-6 pt-6 border-t border-[#E2E3DE] text-center">

            <Link
              to="/login"
              className="text-sm text-[#70757D] hover:text-[#253044] transition-colors"
            >
              ← Back to Login
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}

export default ResetPassword;