import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/common/AppLayout";

import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

import CommunityPage from "./pages/Community/CommunityPage";
import CreatePost from "./pages/Community/CreatePost";
import MyJourney from "./pages/Community/MyJourney";
import EditPost from "./pages/Community/EditPost";
import PostDetail from "./pages/Community/PostDetail";
import Sample from "./pages/Dashboard/Sample";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        {/* Home / Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            COMMUNITY
        ========================== */}

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CommunityPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/create"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreatePost />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/me"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyJourney />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditPost />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PostDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            PROFILE
        ========================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            DEFAULT ROUTES
        ========================== */}

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route path="/sample" element={<Sample />} />
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;