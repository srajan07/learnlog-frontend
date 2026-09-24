import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import logo from "../../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] px-4">
      <div className="w-full max-w-sm">
       <div className="text-center mb-8 space-y-2">
  <img
    src={logo}
    alt="Learnlog logo"
    className="h-8 sm:h-9 mx-auto object-contain"
  />
  <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Create Account</h1>
  <p className="text-sm text-[#6B7280]">Start your Learnlog journey</p>
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
              <label className="block text-xs font-semibold text-[#374151]">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#374151]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#374151]">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Create a password"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-1"
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] pt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1E3A5F] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;