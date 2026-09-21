import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import logo from "../../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = user?.name || user?.fullName || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      className="w-full bg-[#FCFCF9] border-b border-[#E2E3DE] sticky top-0 z-30"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
        <div className="h-[60px] flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={logo}
              alt="Learnlog logo"
              className="h-10 sm:h-11 object-contain"
            />
          </Link>

          {/* Desktop Profile + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/profile"
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname === "/profile"
                  ? "border-[#253044] bg-[#253044] text-white"
                  : "border-[#E2E3DE] bg-[#FCFCF9] text-[#374151] hover:border-[#C7CBD1] hover:bg-[#F7F7F3]"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#253044] text-white flex items-center justify-center text-[10px] font-bold">
                {userInitial}
              </div>

              <span className="max-w-[100px] truncate">
                {displayName}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-[#8A8F96] hover:text-[#A55D5D] font-medium transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/profile"
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                location.pathname === "/profile"
                  ? "bg-[#253044] text-white ring-2 ring-[#E2E3DE]"
                  : "bg-[#253044] text-white"
              }`}
            >
              {userInitial}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#374151] border border-[#E2E3DE] bg-[#FCFCF9] hover:bg-[#F7F7F3] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#E2E3DE] space-y-1 bg-[#FCFCF9]">

            {/* Profile */}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/profile"
                  ? "bg-[#253044] text-white"
                  : "text-[#70757D] hover:text-[#20242B] hover:bg-[#F7F7F3]"
              }`}
            >
              Profile
            </Link>

            {/* Account info + Logout */}
            <div className="pt-2 border-t border-[#E2E3DE] px-3 flex items-center justify-between gap-3">
              <span className="text-xs text-[#8A8F96] truncate">
                Signed in as{" "}
                <strong className="text-[#374151]">
                  {displayName}
                </strong>
              </span>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-[#A55D5D] hover:underline shrink-0"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;