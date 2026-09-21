import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import bg from "../../assets/bg.png";
import logo from "../assets/logo.png";
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F5F5F0] bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-sm">
        {/* Logo & Heading */}
        <div className="text-center mb-8 space-y-2">
          <img
            src={logo}
            alt="Learnlog logo"
            className="h-8 sm:h-9 mx-auto object-contain"
          />
          <p className="text-sm text-[#6B7280]">Sign in to your workspace</p>
        </div>
        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-md p-7 space-y-5">
          {error && (
            <div className="text-xs bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] p-3 rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#374151]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                autoFocus
                className="w-full px-3.5 py-2.5 text-sm rounded-lg"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-14 text-sm rounded-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] hover:text-[#374151] font-medium"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#70757D] hover:text-[#253044] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-1"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] pt-1">
            No account?{" "}
            <Link to="/register" className="text-[#1E3A5F] font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;