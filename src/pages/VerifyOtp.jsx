import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService";
import logo from "../assets/logo.png";

function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = sessionStorage.getItem("resetEmail");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email) {
      setError("Reset session not found. Please request a new OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(email, otp);

      // Keep the OTP temporarily for the reset step.
      sessionStorage.setItem("resetOtp", otp);

      navigate("/reset-password");
    } catch (error) {
      console.error("OTP verification error:", error);

      setError(
        error.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <main className="min-h-screen bg-[#F7F7F3] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-[#FCFCF9] border border-[#E2E3DE] rounded-2xl p-6 sm:p-8 text-center">

          <div className="w-12 h-12 mx-auto rounded-xl bg-[#F8EEEE] text-[#A55D5D] flex items-center justify-center text-lg mb-5">
            !
          </div>

          <h1 className="text-2xl font-semibold text-[#20242B]">
            Reset session not found
          </h1>

          <p className="mt-3 text-sm text-[#70757D] leading-6">
            Please request a new password reset OTP.
          </p>

          <Link
            to="/forgot-password"
            className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-[#253044] !text-white hover:bg-[#1D2636] text-sm font-medium transition-colors"
          >
            Request new OTP
          </Link>

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
              Verify email
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Check your email.
            </h1>

            <p className="mt-3 text-sm text-[#70757D] leading-6">
              Enter the 6-digit OTP we sent to:
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

            <div className="space-y-2">

              <label
                htmlFor="otp"
                className="text-sm font-medium text-[#20242B]"
              >
                One-time password
              </label>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(event) => {
                  const value =
                    event.target.value.replace(/\D/g, "");

                  setOtp(value);
                }}
                placeholder="123456"
                className="w-full px-4 py-3 text-center text-lg tracking-[0.4em] font-medium bg-[#F7F7F3] border border-[#E2E3DE] rounded-xl text-[#20242B] placeholder:text-[#A0A4AA] outline-none transition-all focus:border-[#9AA5B5] focus:ring-2 focus:ring-[#D9E3F0]"
                required
              />

            </div>


            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#253044] !text-white hover:bg-[#1D2636] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

          </form>


          {/* Footer */}

          <div className="mt-6 pt-6 border-t border-[#E2E3DE] flex flex-col items-center gap-3">

            <Link
              to="/forgot-password"
              className="text-sm text-[#70757D] hover:text-[#253044] transition-colors"
            >
              Need a new OTP?
            </Link>

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

export default VerifyOtp;