import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import logo from "../../assets/logo.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email.trim());

      setSuccess("OTP sent successfully. Check your email.");

      // Keep the email so the next page knows
      // which account is being verified.
      sessionStorage.setItem(
        "resetEmail",
        email.trim()
      );

      // Small delay so user can see success message.
      setTimeout(() => {
        navigate("/verify-otp");
      }, 800);
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
              Account recovery
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#20242B]">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm text-[#70757D] leading-6">
              Enter the email linked to your account and we'll
              send you a one-time password.
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="mb-5 rounded-xl border border-[#E7CECE] bg-[#F8EEEE] px-4 py-3 text-sm text-[#A55D5D]">
              {error}
            </div>
          )}


          {/* Success */}

          {success && (
            <div className="mb-5 rounded-xl border border-[#C8D8CB] bg-[#EAF1EB] px-4 py-3 text-sm text-[#587A63]">
              {success}
            </div>
          )}


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="space-y-2">

              <label
                htmlFor="email"
                className="text-sm font-medium text-[#20242B]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-[#F7F7F3] border border-[#E2E3DE] rounded-xl text-sm text-[#20242B] placeholder:text-[#A0A4AA] outline-none transition-all focus:border-[#9AA5B5] focus:ring-2 focus:ring-[#D9E3F0]"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#253044] !text-white hover:bg-[#1D2636] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>


          {/* Back */}

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

export default ForgotPassword;